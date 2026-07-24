import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateSM2 } from "@/lib/spacedRepetition";

/**
 * POST /api/cards/review
 * Record a review for a prediction card and update SM-2 scheduling.
 *
 * Body: { cardId: string, correct: boolean, quality?: number (1-5), responseTimeMs?: number }
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { cardId, correct, quality: userQuality, responseTimeMs } = await req.json();

    if (!cardId || typeof correct !== "boolean") {
      return NextResponse.json(
        { error: "cardId (string) and correct (boolean) are required" },
        { status: 400 }
      );
    }

    // Check card exists
    const card = await prisma.predictionCard.findUnique({ where: { id: cardId } });
    if (!card) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }

    // CardReview has one authoritative scheduling row per user/card.
    const existing = await prisma.cardReview.findUnique({
      where: { userId_cardId: { userId, cardId } },
    });

    const prevEase = existing?.easeFactor ?? 2.5;
    const prevInterval = existing?.interval ?? 0;
    const prevReps = existing?.repetitions ?? 0;

    // SM-2 quality: use explicit quality if provided, otherwise derive from correct
    const quality = typeof userQuality === "number" && userQuality >= 0 && userQuality <= 5
      ? userQuality
      : correct ? 4 : 1;
    const sm2 = calculateSM2(quality, prevReps, prevEase, prevInterval);

    const nextReviewAt = sm2.nextReview;

    // CardReview is the scheduling state for a card, not an event log. Updating
    // the latest record prevents one user/card from being queued multiple times.
    const reviewData = {
      correct,
      responseTimeMs: typeof responseTimeMs === "number" ? Math.max(0, Math.floor(responseTimeMs)) : null,
      easeFactor: sm2.ease,
      interval: sm2.interval,
      repetitions: sm2.repetitions,
      nextReviewAt,
    };
    const review = await prisma.cardReview.upsert({
      where: { userId_cardId: { userId, cardId } },
      update: reviewData,
      create: {
        userId,
        cardId,
        ...reviewData,
      },
    });

    return NextResponse.json({
      review: {
        id: review.id,
        correct,
        nextReviewAt,
        interval: sm2.interval,
        xpEarned: correct ? card.xpReward : 0,
      },
    });
  } catch (error) {
    console.error("POST /api/cards/review error:", error);
    return NextResponse.json(
      { error: "Failed to save review" },
      { status: 500 }
    );
  }
}
