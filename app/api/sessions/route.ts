import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET /api/sessions — return all session progress for current user
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rows = await prisma.sessionProgress.findMany({
      where: {
        userId: session.user.id,
        // Exclude plan and walkthrough entries (those use special prefixes)
        NOT: [
          { sessionSlug: { startsWith: "plan_" } },
          { sessionSlug: { startsWith: "wt_" } },
        ],
      },
      select: {
        sessionSlug: true,
        currentStageIndex: true,
        completed: true,
        totalXPEarned: true,
      },
    });

    const progress: Record<
      string,
      { completed: boolean; currentStage: number; totalXP: number }
    > = {};
    for (const row of rows) {
      progress[row.sessionSlug] = {
        completed: row.completed,
        currentStage: row.currentStageIndex,
        totalXP: row.totalXPEarned,
      };
    }

    return NextResponse.json({ progress });
  } catch (error) {
    console.error("Error fetching sessions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
