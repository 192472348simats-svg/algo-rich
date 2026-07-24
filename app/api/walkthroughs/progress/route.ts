import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getWalkthrough } from "@/lib/guidedWalkthroughs";

/**
 * GET /api/walkthroughs/progress?walkthroughId=...
 * Fetches progress for a specific walkthrough or all walkthroughs for the user.
 */
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const walkthroughId = searchParams.get("walkthroughId");

    if (walkthroughId) {
      const progress = await prisma.walkthroughProgress.findUnique({
        where: {
          userId_walkthroughId: {
            userId: session.user.id,
            walkthroughId,
          },
        },
      });
      // Ensure we return a consistent object even if no record exists
      return NextResponse.json(progress || { 
        walkthroughId, 
        currentStep: 0, 
        totalSteps: 0, 
        isCompleted: false 
      });
    }

    const allProgress = await prisma.walkthroughProgress.findMany({
      where: { userId: session.user.id },
    });

    return NextResponse.json(allProgress);
  } catch (error) {
    console.error("[WalkthroughProgress GET]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * POST /api/walkthroughs/progress
 * Updates or creates progress for a walkthrough.
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { walkthroughId, slug, currentStep, totalSteps, isCompleted, progressData } = body;

    // Use slug if walkthroughId is missing (client-side uses both interchangeably sometimes)
    const activeId = walkthroughId || slug;

    if (!activeId || currentStep === undefined || totalSteps === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (currentStep > totalSteps) {
      return NextResponse.json({ error: "currentStep cannot exceed totalSteps" }, { status: 400 });
    }

    // Verify walkthrough exists in registry
    const walkthrough = getWalkthrough(activeId);
    if (!walkthrough && !activeId.startsWith("wt-")) {
        // Log but continue if it looks like a walkthrough ID
        console.warn(`[WalkthroughProgress POST] Unregistered walkthroughId: ${activeId}`);
    }

    const now = new Date();
    
    // Check current progress for XP idempotency
    const existingProgress = await prisma.walkthroughProgress.findUnique({
      where: {
        userId_walkthroughId: {
          userId: session.user.id,
          walkthroughId: activeId,
        },
      },
    });

    const alreadyCompleted = existingProgress?.isCompleted || false;
    const finishingNow = isCompleted || currentStep === totalSteps;

    // Upsert progress
    const progress = await prisma.walkthroughProgress.upsert({
      where: {
        userId_walkthroughId: {
          userId: session.user.id,
          walkthroughId: activeId,
        },
      },
      update: {
        currentStep,
        totalSteps,
        isCompleted: finishingNow || alreadyCompleted,
        completedAt: (finishingNow && !alreadyCompleted) ? now : undefined,
        progressData: progressData || {},
      },
      create: {
        userId: session.user.id,
        walkthroughId: activeId,
        currentStep,
        totalSteps,
        isCompleted: finishingNow,
        completedAt: finishingNow ? now : null,
        progressData: progressData || {},
      },
    });

    // Award XP only if transition from not-completed to completed
    let xpEarned = 0;
    if (finishingNow && !alreadyCompleted) {
        xpEarned = 10; // BASE_WALKTHROUGH_XP
        
        await prisma.user.update({
            where: { id: session.user.id },
            data: { totalXP: { increment: xpEarned } }
        });
    }

    return NextResponse.json({ 
        success: true, 
        progress,
        xpEarned
    });
  } catch (error) {
    console.error("[WalkthroughProgress POST]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
