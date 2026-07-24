import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/** Safely parse JSON, returning the original string if it fails */
function safeJsonParse(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

/**
 * GET /api/cards/daily
 * Returns up to 5 prediction cards due for review (SM-2 scheduling).
 * Falls back to unseen cards if none are due.
 */
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const now = new Date();

    // 1. Cards due for review (nextReviewAt <= now)
    const dueReviewCandidates = await prisma.cardReview.findMany({
      where: {
        userId,
        nextReviewAt: { lte: now },
      },
      include: { card: true },
      orderBy: { nextReviewAt: "asc" },
    });
    // Historical duplicate rows may exist from older versions. Keep only the
    // latest schedule per card while the data is migrated separately.
    const dueReviews = Array.from(
      dueReviewCandidates
        .reduce((latest, review) => {
          if (!latest.has(review.cardId)) latest.set(review.cardId, review);
          return latest;
        }, new Map<string, (typeof dueReviewCandidates)[number]>())
        .values()
    ).slice(0, 5);

    if (dueReviews.length >= 5) {
      return NextResponse.json({
        cards: dueReviews.map((r) => ({
          ...r.card,
          treeValues: r.card.treeValues ? JSON.parse(r.card.treeValues) : null,
          correctAnswer: safeJsonParse(r.card.correctAnswer),
          options: r.card.options ? JSON.parse(r.card.options) : null,
          visualData: r.card.visualData ? JSON.parse(r.card.visualData) : null,
          reviewId: r.id,
          repetitions: r.repetitions,
        })),
      });
    }

    // 2. Pad with unseen cards
    const seenCardIds = await prisma.cardReview.findMany({
      where: { userId },
      select: { cardId: true },
      distinct: ["cardId"],
    });
    const seenIds = seenCardIds.map((r) => r.cardId);

    const unseen = await prisma.predictionCard.findMany({
      where: { id: { notIn: seenIds } },
      take: 5 - dueReviews.length,
      orderBy: { createdAt: "asc" },
    });

    const combined = [
      ...dueReviews.map((r) => ({
        ...r.card,
        treeValues: r.card.treeValues ? JSON.parse(r.card.treeValues) : null,
        correctAnswer: safeJsonParse(r.card.correctAnswer),
        options: r.card.options ? JSON.parse(r.card.options) : null,
        visualData: r.card.visualData ? JSON.parse(r.card.visualData) : null,
        reviewId: r.id,
        repetitions: r.repetitions,
      })),
      ...unseen.map((c) => ({
        ...c,
        treeValues: c.treeValues ? JSON.parse(c.treeValues) : null,
        correctAnswer: safeJsonParse(c.correctAnswer),
        options: c.options ? JSON.parse(c.options) : null,
        visualData: c.visualData ? JSON.parse(c.visualData) : null,
        reviewId: null,
        repetitions: 0,
      })),
    ];

    return NextResponse.json({ cards: combined });
  } catch (error) {
    console.error("GET /api/cards/daily error:", error);
    return NextResponse.json(
      { error: "Failed to fetch daily cards" },
      { status: 500 }
    );
  }
}
