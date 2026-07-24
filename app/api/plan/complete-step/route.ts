import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { invalidateUserCache } from "@/lib/cache";
import { generateDailyPlan, type PlanStep } from "@/lib/planGenerator";

const PLAN_SNAPSHOT_KEY = "__planSnapshot";
const MAX_STEP_TIME_SECONDS = 4 * 60 * 60;

type StoredPlanSnapshot = {
  steps: Pick<PlanStep, "id" | "type">[];
  createdAt: string;
};

function parseStageResults(value: string | null | undefined): Record<string, unknown> {
  if (!value) return {};

  try {
    const parsed: unknown = JSON.parse(value);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? (parsed as Record<string, unknown>)
      : {};
  } catch {
    return {};
  }
}

function getSnapshot(value: unknown): StoredPlanSnapshot | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const candidate = value as Partial<StoredPlanSnapshot>;
  if (!Array.isArray(candidate.steps) || typeof candidate.createdAt !== "string") return null;
  if (!candidate.steps.every((step) => step && typeof step.id === "string" && typeof step.type === "string")) {
    return null;
  }
  return candidate as StoredPlanSnapshot;
}

function visibleStepResults(stageResults: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(stageResults).filter(([stepId]) => stepId !== PLAN_SNAPSHOT_KEY)
  );
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { stepId, timeSpent, skipped } = body;

    if (typeof stepId !== "string" || stepId.length === 0) {
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

    const stageResults = parseStageResults(existing?.stageResults);
    let snapshot = getSnapshot(stageResults[PLAN_SNAPSHOT_KEY]);

    // Freeze the user's daily plan on first completion so a client cannot invent an ID,
    // and later generator changes do not make a valid in-progress plan uncompletable.
    if (!snapshot) {
      const plan = await generateDailyPlan(session.user.id);
      snapshot = {
        steps: plan.steps.map(({ id, type }) => ({ id, type })),
        createdAt: new Date().toISOString(),
      };
      stageResults[PLAN_SNAPSHOT_KEY] = snapshot;
    }

    const expectedStep = snapshot.steps.find((step) => step.id === stepId);
    if (!expectedStep) {
      return NextResponse.json({ error: "Step is not in today's plan" }, { status: 400 });
    }

    const completedSteps = visibleStepResults(stageResults);
    if (completedSteps[stepId]) {
      return NextResponse.json({
        success: true,
        alreadyCompleted: true,
        completedSteps,
        stepIds: Object.keys(completedSteps),
      });
    }

    const safeTimeSpent = Math.min(
      MAX_STEP_TIME_SECONDS,
      Math.max(0, Number.isFinite(timeSpent) ? Math.floor(timeSpent) : 0)
    );
    const wasSkipped = skipped === true;

    stageResults[stepId] = {
      stepType: expectedStep.type,
      timeSpent: safeTimeSpent,
      skipped: wasSkipped,
      completedAt: new Date().toISOString(),
    };

    const completedCount = Object.keys(visibleStepResults(stageResults)).length;

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
    if (!wasSkipped) {
      const xpForStep = expectedStep.type === "solve" ? 25 : 10;
      await prisma.user.update({
        where: { id: session.user.id },
        data: { totalXP: { increment: xpForStep } },
      });
    }
    // Task 3.4: Invalidate caches
    await invalidateUserCache(session.user.id);

    return NextResponse.json({
      success: true,
      completedSteps: visibleStepResults(stageResults),
      stepIds: Object.keys(visibleStepResults(stageResults)),
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

    const stageResults = visibleStepResults(parseStageResults(existing.stageResults));

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

