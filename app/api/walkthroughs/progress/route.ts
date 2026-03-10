import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET /api/walkthroughs/progress — return list of completed walkthrough slugs
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Use SessionProgress table where sessionSlug starts with "wt_"
    const rows = await prisma.sessionProgress.findMany({
      where: {
        userId: session.user.id,
        sessionSlug: { startsWith: "wt_" },
        completed: true,
      },
      select: { sessionSlug: true },
    });

    const completed = rows.map((r) => r.sessionSlug.replace(/^wt_/, ""));

    return NextResponse.json({ completed });
  } catch (error) {
    console.error("Error fetching walkthrough progress:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/walkthroughs/progress — mark a walkthrough as complete
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { slug, stepsCompleted, totalSteps } = body;

    if (!slug) {
      return NextResponse.json(
        { error: "Missing required field: slug" },
        { status: 400 }
      );
    }

    const sessionSlug = `wt_${slug}`;
    const isComplete = (stepsCompleted ?? totalSteps ?? 0) >= (totalSteps ?? 1);

    await prisma.sessionProgress.upsert({
      where: {
        userId_sessionSlug: {
          userId: session.user.id,
          sessionSlug,
        },
      },
      update: {
        currentStageIndex: stepsCompleted ?? 0,
        completed: isComplete,
        ...(isComplete ? { completedAt: new Date() } : {}),
      },
      create: {
        userId: session.user.id,
        sessionSlug,
        currentStageIndex: stepsCompleted ?? 0,
        completed: isComplete,
        ...(isComplete ? { completedAt: new Date() } : {}),
      },
    });

    return NextResponse.json({ success: true, completed: isComplete });
  } catch (error) {
    console.error("Error saving walkthrough progress:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
