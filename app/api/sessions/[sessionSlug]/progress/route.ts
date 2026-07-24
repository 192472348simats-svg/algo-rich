import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getSessionDefinition, type SessionStage } from "@/lib/sessionDefinitions";

const MAX_STAGE_TIME_SECONDS = 4 * 60 * 60;

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

function maximumStageXp(stage: SessionStage): number {
  switch (stage.type) {
    case "predict": {
      const questions = (stage.config as { questions?: { xp?: number }[] }).questions;
      return questions?.reduce((total, question) => total + Math.max(0, question.xp ?? 0), 0) ?? 0;
    }
    case "guided-build":
      return 15;
    case "code":
      return 50;
    case "reflect": {
      const questions = (stage.config as { questions?: unknown[] }).questions;
      return (questions?.length ?? 0) * 10;
    }
    default:
      // The summary reports XP earned by earlier stages; it must never award it a second time.
      return 0;
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ sessionSlug: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sessionSlug } = await params;
    const body = await req.json();
    const { stageId, stageIndex, score, timeSpent } = body;

    if (typeof stageId !== "string" || !Number.isInteger(stageIndex) || stageIndex < 0) {
      return NextResponse.json({ error: "Invalid stage progress" }, { status: 400 });
    }

    const definition = getSessionDefinition(sessionSlug);
    const stage = definition?.stages[stageIndex];
    if (!stage || stage.id !== stageId) {
      return NextResponse.json({ error: "Unknown session stage" }, { status: 400 });
    }

    const existing = await prisma.sessionProgress.findUnique({
      where: {
        userId_sessionSlug: {
          userId: session.user.id,
          sessionSlug,
        },
      },
    });

    const existingResults = parseStageResults(existing?.stageResults);

    // A network retry must be safe: retain the original award instead of paying XP again.
    if (existingResults[stageId]) {
      return NextResponse.json(existing);
    }

    const expectedStageIndex = existing?.currentStageIndex ?? 0;
    if (stageIndex !== expectedStageIndex) {
      return NextResponse.json(
        { error: "Stage completion is out of order", expectedStageIndex },
        { status: 409 }
      );
    }

    const awardedXp = Math.min(
      maximumStageXp(stage),
      Math.max(0, Number.isFinite(score) ? Math.floor(score) : 0)
    );
    const safeTimeSpent = Math.min(
      MAX_STAGE_TIME_SECONDS,
      Math.max(0, Number.isFinite(timeSpent) ? Math.floor(timeSpent) : 0)
    );
    const isLastStage = stageIndex === definition.stages.length - 1;

    existingResults[stageId] = {
      score: awardedXp,
      timeSpent: safeTimeSpent,
      completedAt: new Date().toISOString(),
    };

    const progress = await prisma.sessionProgress.upsert({
      where: {
        userId_sessionSlug: {
          userId: session.user.id,
          sessionSlug,
        },
      },
      update: {
        currentStageIndex: stageIndex + 1,
        stageResults: JSON.stringify(existingResults),
        completed: isLastStage,
        completedAt: isLastStage ? new Date() : undefined,
        totalXPEarned: { increment: awardedXp },
      },
      create: {
        userId: session.user.id,
        sessionSlug,
        currentStageIndex: stageIndex + 1,
        stageResults: JSON.stringify(existingResults),
        completed: isLastStage,
        completedAt: isLastStage ? new Date() : undefined,
        totalXPEarned: awardedXp,
      },
    });

    // Increment user's total XP
    if (awardedXp > 0) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { totalXP: { increment: awardedXp } },
      });
    }

    return NextResponse.json(progress);
  } catch (error) {
    console.error("[SESSION PROGRESS] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
