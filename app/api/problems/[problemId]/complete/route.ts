import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// POST /api/problems/[problemId]/complete — mark a problem as completed
// Used by guided flows, plan steps, etc. when user finishes a problem
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ problemId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { problemId } = await params;

    // Verify problem exists
    const problem = await prisma.problem.findUnique({
      where: { id: problemId },
      select: { id: true, slug: true, title: true, difficulty: true },
    });

    if (!problem) {
      return NextResponse.json({ error: "Problem not found" }, { status: 404 });
    }

    // Check if already solved
    const existingSolve = await prisma.submission.findFirst({
      where: {
        userId: session.user.id,
        problemId,
        status: "accepted",
      },
    });

    if (existingSolve) {
      return NextResponse.json({
        success: true,
        alreadySolved: true,
        message: "Problem was already completed",
      });
    }

    const body = await request.json().catch(() => ({}));

    // Create a "completed" submission record
    const submission = await prisma.submission.create({
      data: {
        userId: session.user.id,
        problemId,
        code: body.code ?? "# Completed via guided flow",
        language: body.language ?? "python",
        status: "accepted",
        passedTests: body.totalTests ?? 0,
        totalTests: body.totalTests ?? 0,
        executionTime: body.executionTime ?? null,
      },
    });

    // XP award
    const xpMap: Record<string, number> = { easy: 10, medium: 25, hard: 50 };
    const xpEarned = xpMap[problem.difficulty] ?? 10;

    await prisma.user.update({
      where: { id: session.user.id },
      data: { totalXP: { increment: xpEarned } },
    });

    return NextResponse.json(
      {
        success: true,
        submissionId: submission.id,
        xpEarned,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error completing problem:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
