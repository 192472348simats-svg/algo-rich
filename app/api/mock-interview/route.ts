import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { parseAndNormalizeTestCases } from "@/lib/types/problem";

// GET: return a random unsolved hard/medium problem for this session
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get problems the user hasn't solved yet
    const solved = await prisma.progress.findMany({
      where: { userId: session.user.id, completed: true },
      select: { lessonId: true },
    });
    // Progress tracks lessons not problems; use submissions for solved problems
    const solvedSubs = await prisma.submission.findMany({
      where: { userId: session.user.id, status: "accepted" },
      select: { problemId: true },
    });
    const solvedIds = [...new Set(solvedSubs.map((s: { problemId: string }) => s.problemId))];

    // Pick a medium or hard problem not yet solved
    const problem = await prisma.problem.findFirst({
      where: {
        id: { notIn: solvedIds.length > 0 ? solvedIds : ["__none__"] },
        difficulty: { in: ["Medium", "Hard"] },
      },
      select: {
        id: true,
        title: true,
        difficulty: true,
        description: true,
        examples: true,
        constraints: true,
        pattern: true,
        slug: true,
        starterCode: true,
        testCases: true,
      },
      orderBy: { createdAt: "asc" },
    });

    if (!problem) {
      // Fall back to any medium/hard if all are solved
      const fallback = await prisma.problem.findFirst({
        where: { difficulty: { in: ["Medium", "Hard"] } },
        select: {
          id: true,
          title: true,
          difficulty: true,
          description: true,
          examples: true,
          constraints: true,
          pattern: true,
          slug: true,
          starterCode: true,
          testCases: true,
        },
      });
      return NextResponse.json({
        problem: fallback
          ? { ...fallback, testCases: parseAndNormalizeTestCases(fallback.testCases) }
          : null,
      });
    }

    return NextResponse.json({
      problem: { ...problem, testCases: parseAndNormalizeTestCases(problem.testCases) },
    });
  } catch (error) {
    console.error("[mock-interview GET]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST: save mock interview result
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { problemId, passed, timeTakenSeconds, notes } = body;

    if (!problemId || typeof passed !== "boolean") {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    // Record the attempt as a submission
    await prisma.submission.create({
      data: {
        userId: session.user.id,
        problemId,
        code: notes ?? "",
        language: "mock-interview",
        status: passed ? "accepted" : "wrong_answer",
        passedTests: passed ? 1 : 0,
        totalTests: 1,
        executionTime: timeTakenSeconds ? timeTakenSeconds * 1000 : null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[mock-interview POST]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
