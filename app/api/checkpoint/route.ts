import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET /api/checkpoint — Evaluate if user can advance to next phase
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { currentPhase: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const phase = user.currentPhase;

    // Count problems for this phase
    const phaseProblems = await prisma.problem.count({
      where: { phase },
    });

    // Count unique problems solved in this phase
    const solvedSubmissions = await prisma.submission.findMany({
      where: { userId: session.user.id, status: "accepted" },
      select: { problemId: true },
      distinct: ["problemId"],
    });
    const solvedIds = solvedSubmissions.map((s) => s.problemId);

    let solvedInPhase = 0;
    if (solvedIds.length > 0) {
      solvedInPhase = await prisma.problem.count({
        where: {
          id: { in: solvedIds },
          phase,
        },
      });
    }

    // Define checkpoint requirements per phase
    const checkpoints: Record<
      number,
      { minSolved: number; minPercentage: number; label: string }
    > = {
      1: {
        minSolved: 8,
        minPercentage: 67,
        label: "Solve 8/12 Python problems (67%)",
      },
      2: {
        minSolved: 5,
        minPercentage: 80,
        label: "Solve 5/6 Logic problems (80%)",
      },
      3: {
        minSolved: 30,
        minPercentage: 50,
        label: "Solve 50% of Data Structure problems",
      },
      4: {
        minSolved: 20,
        minPercentage: 50,
        label: "Solve 50% of Pattern problems",
      },
    };

    const req = checkpoints[phase];
    if (!req) {
      return NextResponse.json({
        phase,
        canAdvance: false,
        message: "No checkpoint for this phase",
        requirements: null,
      });
    }

    const percentage =
      phaseProblems > 0 ? Math.round((solvedInPhase / phaseProblems) * 100) : 0;
    const canAdvance =
      solvedInPhase >= req.minSolved && percentage >= req.minPercentage;

    return NextResponse.json({
      phase,
      canAdvance,
      requirements: {
        label: req.label,
        solved: solvedInPhase,
        total: phaseProblems,
        percentage,
        minSolved: req.minSolved,
        minPercentage: req.minPercentage,
      },
      message: canAdvance
        ? "You're ready to advance! 🎉"
        : `Solve ${Math.max(0, req.minSolved - solvedInPhase)} more problem(s) to unlock the next phase.`,
    });
  } catch (error) {
    console.error("[GET /api/checkpoint]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
