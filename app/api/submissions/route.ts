import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { parseProblem } from "@/lib/types/problem";
import { enrollProblemForReview } from "@/lib/reviewEngine";
import { checkPatternDiscovery } from "@/lib/patternDiscovery";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

  const body = await request.json();
  const { problemId, code, language = "python", testResults } = body;

  if (!problemId || !code) {
    return NextResponse.json(
      { error: "Missing required fields: problemId, code" },
      { status: 400 }
    );
  }

  // Verify problem exists
  const rawProblem = await prisma.problem.findUnique({
    where: { id: problemId },
  });

  if (!rawProblem) {
    return NextResponse.json({ error: "Problem not found" }, { status: 404 });
  }

  const problem = parseProblem(rawProblem as unknown as Record<string, unknown>);

  // Calculate results from client-side test execution
  // Visible test results are trusted; hidden test results are server-validated
  const visibleTests = problem.testCases.length;
  const hiddenTests = problem.hiddenTestCases.length;
  const totalTests = visibleTests + hiddenTests;
  let passedTests = 0;
  let passed = false;

  if (testResults && Array.isArray(testResults)) {
    // Only count visible test passes from client
    const visiblePassed = testResults
      .filter((r: { passed: boolean; index?: number }, i: number) => {
        const idx = r.index ?? i + 1;
        return idx <= visibleTests && r.passed;
      })
      .length;

    // Server-validate hidden test results
    let hiddenPassed = 0;
    for (let h = 0; h < hiddenTests; h++) {
      const clientIdx = visibleTests + h;
      const clientResult = testResults[clientIdx];
      const hiddenCase = problem.hiddenTestCases[h];

      if (clientResult && hiddenCase) {
        // Validate: compare client's actualOutput against our expected
        try {
          const actualParsed = typeof clientResult.actualOutput === "string"
            ? JSON.parse(clientResult.actualOutput)
            : clientResult.actualOutput;
          const expectedParsed = typeof hiddenCase.expectedOutput === "string"
            ? JSON.parse(hiddenCase.expectedOutput as string)
            : hiddenCase.expectedOutput;
          if (JSON.stringify(actualParsed) === JSON.stringify(expectedParsed)) {
            hiddenPassed++;
          }
        } catch {
          // Fallback string comparison
          const actualStr = String(clientResult.actualOutput ?? "").trim();
          const expectedStr = typeof hiddenCase.expectedOutput === "string"
            ? hiddenCase.expectedOutput.trim()
            : JSON.stringify(hiddenCase.expectedOutput);
          if (actualStr === expectedStr) {
            hiddenPassed++;
          }
        }
      }
    }

    passedTests = visiblePassed + hiddenPassed;
    passed = passedTests === totalTests;
  } else if (typeof body.passed === "boolean") {
    // Legacy support: simple passed boolean — DO NOT trust for hidden tests
    // Only trust if there are no hidden tests
    if (hiddenTests === 0) {
      passed = body.passed;
      passedTests = passed ? totalTests : 0;
    } else {
      passed = false;
      passedTests = 0;
    }
  }

  // Create submission record
  const submission = await prisma.submission.create({
    data: {
      userId: session.user.id,
      problemId,
      code,
      language,
      status: passed ? "accepted" : "wrong_answer",
      totalTests,
      passedTests,
      executionTime: body.executionTime || null,
      errorMessage: null,
    },
  });

  // If all tests pass, check for first solve and stats
  let stats = null;
  if (passed) {
    // Check if this is the first successful submission for this problem
    const previousSolve = await prisma.submission.findFirst({
      where: {
        userId: session.user.id,
        problemId,
        status: "accepted",
        id: { not: submission.id },
      },
    });

    const isFirstSolve = !previousSolve;

    // Calculate XP based on difficulty
    const xpMap: Record<string, number> = {
      easy: 10,
      medium: 25,
      hard: 50,
    };
    const xpEarned = isFirstSolve
      ? xpMap[problem.difficulty] || 10
      : Math.floor((xpMap[problem.difficulty] || 10) / 4);

    // Update pattern progress if applicable
    if (problem.pattern) {
      await prisma.patternProgress.upsert({
        where: {
          userId_patternSlug: {
            userId: session.user.id,
            patternSlug: problem.pattern,
          },
        },
        update: {
          problemsSolved: { increment: isFirstSolve ? 1 : 0 },
          status: "practicing",
        },
        create: {
          userId: session.user.id,
          patternSlug: problem.pattern,
          status: "practicing",
          problemsSolved: 1,
        },
      });
    }

    // Update lesson mastery to "practiced" for all connected lessons
    const connectedLessons = await prisma.lessonProblem.findMany({
      where: { problemId },
      select: { lessonId: true },
    });

    for (const { lessonId } of connectedLessons) {
      const existing = await prisma.progress.findUnique({
        where: {
          userId_lessonId: { userId: session.user.id, lessonId },
        },
      });

      // Only upgrade mastery, never downgrade
      const currentLevel = existing?.masteryLevel || "none";
      const masteryRank: Record<string, number> = {
        none: 0,
        read: 1,
        practiced: 2,
        mastered: 3,
      };

      if (masteryRank["practiced"] > (masteryRank[currentLevel] ?? 0)) {
        await prisma.progress.upsert({
          where: {
            userId_lessonId: { userId: session.user.id, lessonId },
          },
          update: {
            masteryLevel: "practiced",
            practicedAt: new Date(),
          },
          create: {
            userId: session.user.id,
            lessonId,
            masteryLevel: "practiced",
            practicedAt: new Date(),
          },
        });
      } else if (existing) {
        // Just update practicedAt timestamp
        await prisma.progress.update({
          where: { id: existing.id },
          data: { practicedAt: new Date() },
        });
      }

      // Check if user has solved ALL problems for this lesson → mastered
      const allLessonProblems = await prisma.lessonProblem.findMany({
        where: { lessonId },
        select: { problemId: true },
      });

      if (allLessonProblems.length > 0) {
        const solvedCount = await prisma.submission.count({
          where: {
            userId: session.user.id,
            status: "accepted",
            problemId: { in: allLessonProblems.map((lp) => lp.problemId) },
          },
        });

        // Use distinct problemIds for accurate count
        const distinctSolved = await prisma.submission.findMany({
          where: {
            userId: session.user.id,
            status: "accepted",
            problemId: { in: allLessonProblems.map((lp) => lp.problemId) },
          },
          select: { problemId: true },
          distinct: ["problemId"],
        });

        if (distinctSolved.length >= allLessonProblems.length) {
          await prisma.progress.update({
            where: {
              userId_lessonId: { userId: session.user.id, lessonId },
            },
            data: { masteryLevel: "mastered" },
          });
        }
      }
    }

    // Auto-enroll in spaced repetition review queue on first solve
    if (isFirstSolve) {
      await enrollProblemForReview(session.user.id, problemId);
    }

    // Check for pattern discovery trigger
    let patternDiscovery = null;
    if (problem.pattern) {
      try {
        const solvedProblems = await prisma.submission.findMany({
          where: { userId: session.user.id, status: "accepted" },
          select: { problem: { select: { slug: true, category: true } } },
          distinct: ["problemId"],
        });
        const solvedPatterned = solvedProblems
          .filter((s): s is typeof s & { problem: { slug: string; category: string } } => !!s.problem.category)
          .map((s) => ({ slug: s.problem.slug, pattern: s.problem.category }));
        patternDiscovery = checkPatternDiscovery(solvedPatterned);
      } catch {
        // Non-critical — silently ignore
      }
    }

    stats = {
      isFirstSolve,
      xpEarned,
      difficulty: problem.difficulty,
      pattern: problem.pattern,
      patternDiscovery,
    };
  }

  return NextResponse.json(
    {
      success: passed,
      submissionId: submission.id,
      result: {
        totalTests,
        passedTests,
        failedTests: totalTests - passedTests,
        executionTime: body.executionTime || 0,
      },
      stats,
    },
    { status: 201 }
  );
  } catch (error) {
    console.error("Error creating submission:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// GET /api/submissions?problemId=xxx
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

  const { searchParams } = new URL(request.url);
  const problemId = searchParams.get("problemId");

  const where: Record<string, unknown> = { userId: session.user.id };
  if (problemId) where.problemId = problemId;

  const submissions = await prisma.submission.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 20,
    select: {
      id: true,
      problemId: true,
      status: true,
      totalTests: true,
      passedTests: true,
      language: true,
      executionTime: true,
      createdAt: true,
      problem: {
        select: {
          title: true,
          difficulty: true,
          slug: true,
        },
      },
    },
  });

  return NextResponse.json(submissions);
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
