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

    const [totalReviews, correctReviews, uniqueCards, dueCount] =
      await Promise.all([
        prisma.cardReview.count({ where: { userId } }),
        prisma.cardReview.count({ where: { userId, correct: true } }),
        prisma.cardReview.groupBy({
          by: ["cardId"],
          where: { userId },
        }),
        prisma.cardReview.count({
          where: { userId, nextReviewAt: { lte: new Date() } },
        }),
      ]);

    const totalCards = await prisma.predictionCard.count();

    return NextResponse.json({
      totalReviews,
      correctReviews,
      accuracy: totalReviews > 0 ? Math.round((correctReviews / totalReviews) * 100) : 0,
      cardsStudied: uniqueCards.length,
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
