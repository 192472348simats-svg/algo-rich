import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET /api/user/phase — Get user's current phase info + progress
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        currentPhase: true,
        currentWeek: true,
        phaseStartedAt: true,
        phase1CompletedAt: true,
        phase2CompletedAt: true,
        phase3CompletedAt: true,
        phase4CompletedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Count problems solved per phase
    const phaseProblems = await prisma.problem.groupBy({
      by: ["phase"],
      _count: { id: true },
    });

    const phaseSolved = await prisma.submission.findMany({
      where: { userId: session.user.id, status: "accepted" },
      select: { problemId: true },
      distinct: ["problemId"],
    });

    const solvedProblemIds = phaseSolved.map((s) => s.problemId);
    const solvedByPhase: Record<number, number> = {};

    if (solvedProblemIds.length > 0) {
      const solvedProblems = await prisma.problem.findMany({
        where: { id: { in: solvedProblemIds } },
        select: { phase: true },
      });
      for (const p of solvedProblems) {
        solvedByPhase[p.phase] = (solvedByPhase[p.phase] || 0) + 1;
      }
    }

    const phases = [
      { phase: 1, name: "Python Foundations", weeks: "1-4" },
      { phase: 2, name: "Logic Building", weeks: "5-8" },
      { phase: 3, name: "Data Structures", weeks: "9-16" },
      { phase: 4, name: "Patterns & Algorithms", weeks: "17-22" },
      { phase: 5, name: "Interview Ready", weeks: "23-26" },
    ].map((p) => {
      const total =
        phaseProblems.find((pp) => pp.phase === p.phase)?._count.id ?? 0;
      const solved = solvedByPhase[p.phase] ?? 0;
      const completedAtKey = `phase${p.phase}CompletedAt` as keyof typeof user;
      return {
        ...p,
        totalProblems: total,
        solvedProblems: solved,
        progress: total > 0 ? Math.round((solved / total) * 100) : 0,
        completedAt:
          p.phase < 5
            ? (user[completedAtKey] as Date | null)
            : null,
        status:
          p.phase < user.currentPhase
            ? "completed"
            : p.phase === user.currentPhase
              ? "current"
              : "locked",
      };
    });

    return NextResponse.json({
      currentPhase: user.currentPhase,
      currentWeek: user.currentWeek,
      phaseStartedAt: user.phaseStartedAt,
      phases,
    });
  } catch (error) {
    console.error("[GET /api/user/phase]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/user/phase — Advance to next phase (after checkpoint passes)
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { action } = body; // "advance" or "setPhase"

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { currentPhase: true, currentWeek: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (action === "advance") {
      if (user.currentPhase >= 5) {
        return NextResponse.json(
          { error: "Already at maximum phase" },
          { status: 400 }
        );
      }

      const completedKey = `phase${user.currentPhase}CompletedAt`;
      const weekMap: Record<number, number> = {
        1: 5,
        2: 9,
        3: 17,
        4: 23,
      };

      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          currentPhase: user.currentPhase + 1,
          currentWeek: weekMap[user.currentPhase] ?? user.currentWeek + 1,
          phaseStartedAt: new Date(),
          [completedKey]: new Date(),
        },
      });

      return NextResponse.json({
        success: true,
        newPhase: user.currentPhase + 1,
        message: `Advanced to Phase ${user.currentPhase + 1}!`,
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("[POST /api/user/phase]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
