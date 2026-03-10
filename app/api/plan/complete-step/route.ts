import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { stepId, stepType, timeSpent, score, skipped } = body;

    if (!stepId) {
      return NextResponse.json(
        { error: "Missing stepId" },
        { status: 400 }
      );
    }

    // Store step completion in SessionProgress using a special slug for plan steps
    const planSlug = `plan_${new Date().toISOString().slice(0, 10)}`;

    const existing = await prisma.sessionProgress.findUnique({
      where: {
        userId_sessionSlug: {
          userId: session.user.id,
          sessionSlug: planSlug,
        },
      },
    });

    let stageResults: Record<string, unknown> = {};
    if (existing) {
      try {
        stageResults = JSON.parse(existing.stageResults || "{}");
      } catch {
        stageResults = {};
      }
    }

    stageResults[stepId] = {
      stepType,
      timeSpent: timeSpent || 0,
      score: score || 0,
      skipped: skipped || false,
      completedAt: new Date().toISOString(),
    };

    const completedCount = Object.keys(stageResults).length;

    await prisma.sessionProgress.upsert({
      where: {
        userId_sessionSlug: {
          userId: session.user.id,
          sessionSlug: planSlug,
        },
      },
      update: {
        stageResults: JSON.stringify(stageResults),
        currentStageIndex: completedCount,
      },
      create: {
        userId: session.user.id,
        sessionSlug: planSlug,
        stageResults: JSON.stringify(stageResults),
        currentStageIndex: completedCount,
      },
    });

    // Award XP for non-skipped steps
    if (!skipped) {
      const xpForStep = stepType === "solve" ? 25 : 10;
      await prisma.user.update({
        where: { id: session.user.id },
        data: { totalXP: { increment: xpForStep } },
      });
    }

    return NextResponse.json({
      success: true,
      completedSteps: Object.keys(stageResults),
    });
  } catch (error) {
    console.error("[PLAN COMPLETE STEP] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET /api/plan/complete-step — fetch today's completed steps
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const planSlug = `plan_${new Date().toISOString().slice(0, 10)}`;

    const existing = await prisma.sessionProgress.findUnique({
      where: {
        userId_sessionSlug: {
          userId: session.user.id,
          sessionSlug: planSlug,
        },
      },
    });

    if (!existing) {
      return NextResponse.json({ completedSteps: {}, stepIds: [] });
    }

    let stageResults: Record<string, unknown> = {};
    try {
      stageResults = JSON.parse(existing.stageResults || "{}");
    } catch {
      stageResults = {};
    }

    return NextResponse.json({
      completedSteps: stageResults,
      stepIds: Object.keys(stageResults),
    });
  } catch (error) {
    console.error("[PLAN COMPLETE STEP GET] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

