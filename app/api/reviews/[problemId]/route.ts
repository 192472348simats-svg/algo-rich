import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { recordReview } from "@/lib/reviewEngine";
import { invalidateUserCache } from "@/lib/cache";

/**
 * POST /api/reviews/[problemId]
 * Record a review result with a self-rating (1-4).
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ problemId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { problemId } = await params;
    const body = await request.json();
    const { rating } = body;

    if (!rating || rating < 1 || rating > 4) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 4" },
        { status: 400 }
      );
    }

    const schedule = await recordReview(session.user.id, problemId, rating);

    // Task 3.4: Invalidate caches
    await invalidateUserCache(session.user.id);

    return NextResponse.json({
      success: true,
      nextReviewAt: schedule.nextReviewAt,
      interval: schedule.interval,
      easeFactor: schedule.easeFactor,
    });
  } catch (error) {
    console.error("Error recording review:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
