import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/cards/stats
 * Returns the user's prediction-card review statistics.
 */
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const reviews = await prisma.cardReview.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    // Older versions wrote an event row for every answer. Treat the newest row
    // as the current schedule state until historical rows are migrated away.
    const currentByCard = new Map<string, (typeof reviews)[number]>();
    for (const review of reviews) {
      if (!currentByCard.has(review.cardId)) currentByCard.set(review.cardId, review);
    }
    const currentReviews = Array.from(currentByCard.values());
    const totalReviews = currentReviews.length;
    const correctReviews = currentReviews.filter((review) => review.correct).length;
    const dueCount = currentReviews.filter((review) => review.nextReviewAt <= new Date()).length;

    const totalCards = await prisma.predictionCard.count();

    return NextResponse.json({
      totalReviews,
      correctReviews,
      accuracy: totalReviews > 0 ? Math.round((correctReviews / totalReviews) * 100) : 0,
      cardsStudied: totalReviews,
      totalCards,
      dueForReview: dueCount,
    });
  } catch (error) {
    console.error("GET /api/cards/stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
