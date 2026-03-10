import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

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
    const { stageId, stageIndex, score, timeSpent, completed } = body;

    const existing = await prisma.sessionProgress.findUnique({
      where: {
        userId_sessionSlug: {
          userId: session.user.id,
          sessionSlug,
        },
      },
    });

    const existingResults = existing?.stageResults
      ? JSON.parse(existing.stageResults)
      : {};

    existingResults[stageId] = {
      score,
      timeSpent,
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
        completed: completed || false,
        completedAt: completed ? new Date() : undefined,
        totalXPEarned: { increment: score || 0 },
      },
      create: {
        userId: session.user.id,
        sessionSlug,
        currentStageIndex: stageIndex + 1,
        stageResults: JSON.stringify(existingResults),
        completed: completed || false,
        completedAt: completed ? new Date() : undefined,
        totalXPEarned: score || 0,
      },
    });

    // Increment user's total XP
    if (score > 0) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { totalXP: { increment: score } },
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
