import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDueReviews, getReviewStats } from "@/lib/reviewEngine";

/**
 * GET /api/reviews
 * Returns due reviews and stats for the authenticated user.
 */
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [dueReviews, stats] = await Promise.all([
      getDueReviews(session.user.id),
      getReviewStats(session.user.id),
    ]);

    return NextResponse.json({ dueReviews, stats });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
