import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { parseProblem } from "@/lib/types/problem";
import { invalidateUserCache } from "@/lib/cache";
import { enrollProblemForReview } from "@/lib/reviewEngine";
import { checkPatternDiscovery } from "@/lib/patternDiscovery";
import { checkAhaMoment } from "@/lib/ahaDetector";
import { getLevelForXP } from "@/lib/xpSystem";

const submissionRateLimit = new Map<string, { count: number; resetAt: number }>();

// Circuit breaker state for Piston
let pistonBreaker = {
  failures: 0,
  lastFailureAt: 0,
  isOpen: false,
};

const CIRCUIT_BREAKER_THRESHOLD = 3;
const CIRCUIT_BREAKER_COOLDOWN = 5 * 60 * 1000; // 5 minutes

/** Remove the interactive stdin runner from starter templates before appending
 * the server's hidden-test harness. The runner is useful in the editor, but it
 * would consume stdin or print a second result during hidden validation. */
function stripInputHarness(code: string): string {
  const lines = code.split("\n");
  let callableSeen = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    if (/^(def|class)\s+\w+/.test(trimmed)) callableSeen = true;

    const topLevel = line === trimmed;
    const startsRunner =
      /^(import\s+json(?:\s|,|$)|from\s+sys\s+import\s)/.test(trimmed) ||
      /\binput\s*\(/.test(trimmed);

    if (callableSeen && topLevel && startsRunner) {
      return lines.slice(0, i).join("\n").trimEnd();
    }
  }

  return code;
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = Date.now();
    const window = 60 * 1000; // 1 minute
    const userId = session.user.id;
    const entry = submissionRateLimit.get(userId);
    if (entry && now < entry.resetAt) {
      if (entry.count >= 10) {
        return Response.json(
          { error: "Slow down — maximum 10 runs per minute." },
          { status: 429 }
        );
      }
      entry.count++;
    } else {
      submissionRateLimit.set(userId, { count: 1, resetAt: now + window });
    }

  const body = await request.json();
  const { problemId, code, language = "python", testResults } = body;

  if (typeof problemId !== "string" || typeof code !== "string" || !code.trim()) {
    return NextResponse.json(
      { error: "Missing required fields: problemId, code" },
      { status: 400 }
    );
  }

  // The hidden-test harness invokes a Python function. Accepting another language
  // would misrepresent the result and allows unnecessarily large request bodies.
  if (language !== "python") {
    return NextResponse.json({ error: "Only Python submissions are supported." }, { status: 400 });
  }

  if (code.length > 100_000) {
    return NextResponse.json({ error: "Code must be 100 KB or smaller." }, { status: 413 });
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
    const passedVisibleIndexes = new Set<number>();
    for (let i = 0; i < testResults.length; i++) {
      const result = testResults[i];
      if (!result || typeof result !== "object") continue;
      const candidate = result as { passed?: unknown; index?: unknown };
      const index = typeof candidate.index === "number" ? candidate.index : i + 1;
      if (Number.isInteger(index) && index >= 1 && index <= visibleTests && candidate.passed === true) {
        passedVisibleIndexes.add(index);
      }
    }
    const visiblePassed = passedVisibleIndexes.size;

    let hiddenPassed = 0;
    
    // Server Validate Hidden Tests securely using Piston API
    if (hiddenTests > 0) {
      // Check circuit breaker
      const now = Date.now();
      if (pistonBreaker.isOpen && now - pistonBreaker.lastFailureAt < CIRCUIT_BREAKER_COOLDOWN) {
        console.warn("Piston circuit breaker is OPEN. Skipping hidden tests.");
      } else {
        if (pistonBreaker.isOpen) {
          console.log("Piston circuit breaker resetting to CLOSED.");
          pistonBreaker.isOpen = false;
          pistonBreaker.failures = 0;
        }

        try {
          // Extract function name from starter code
          const match = problem.starterCode.match(/def\s+(\w+)\s*\(/);
          const funcName = match ? match[1] : "";

          if (funcName) {
            const functionCode = stripInputHarness(code);
            let testHarness = `import json\n\n${functionCode}\n\n`;
            testHarness += `tests = ${JSON.stringify(problem.hiddenTestCases)}\n`;
            testHarness += `passed = 0\n`;
            testHarness += `for t in tests:\n`;
            testHarness += `    try:\n`;
            testHarness += `        inp = t['input']\n`;
            testHarness += `        exp = t['expectedOutput']\n`;
            testHarness += `        if isinstance(inp, dict):\n`;
            testHarness += `            res = ${funcName}(**inp)\n`;
            testHarness += `        elif isinstance(inp, list) or isinstance(inp, tuple):\n`;
            testHarness += `            res = ${funcName}(*inp)\n`;
            testHarness += `        else:\n`;
            testHarness += `            res = ${funcName}(inp)\n`;
            testHarness += `        if json.dumps(res) == json.dumps(exp) or res == exp:\n`;
            testHarness += `            passed += 1\n`;
            testHarness += `    except Exception as e:\n`;
            testHarness += `        pass\n`;
            testHarness += `print(f"HIDDEN_PASS:{passed}")\n`;

            // Timeout after 5 seconds
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);

            const pistonRes = await fetch("https://emkc.org/api/v2/piston/execute", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                language: "python",
                version: "3.10.0",
                files: [{ name: "main.py", content: testHarness }]
              }),
              signal: controller.signal
            });
            
            clearTimeout(timeoutId);

            if (pistonRes.ok) {
              const data = await pistonRes.json();
              const output = data.run?.output || "";
              const match = output.match(/HIDDEN_PASS:(\d+)/);
              if (match) {
                hiddenPassed = parseInt(match[1], 10);
              }
              // Reset failures on success
              pistonBreaker.failures = 0;
            } else {
              throw new Error(`Piston responded with ${pistonRes.status}`);
            }
          }
        } catch (error) {
          console.error("Piston API execution failed:", error);
          pistonBreaker.failures++;
          pistonBreaker.lastFailureAt = Date.now();
          if (pistonBreaker.failures >= CIRCUIT_BREAKER_THRESHOLD) {
            pistonBreaker.isOpen = true;
            console.error("Piston circuit breaker is now OPEN.");
          }
        }
      }
    }

    passedTests = visiblePassed + hiddenPassed;
    passed = passedTests === totalTests;
  } else if (typeof body.passed === "boolean") {
    // ──────────────────────────────────────────────────────────────────
    // TRUST BOUNDARY — Legacy client compatibility
    //
    // This branch handles older clients that submit a simple { passed: boolean }
    // instead of the structured testResults[] array. The client-supplied `passed`
    // flag is trusted ONLY when the problem has zero hidden test cases, because:
    //   - Visible test cases are inherently client-visible anyway, so a dishonest
    //     client gains nothing by lying about them.
    //   - When hidden tests exist, we CANNOT trust the client because the client
    //     never sees the hidden inputs/outputs.
    //
    // TODO: Remove this branch once all clients (PracticeEditor, PlanLessonStep)
    // have been migrated to send structured testResults[]. Track via issue/ticket.
    // ──────────────────────────────────────────────────────────────────
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
      easy: 25,
      medium: 50,
      hard: 100,
    };
    const xpEarned = isFirstSolve
      ? xpMap[problem.difficulty] || 10
      : Math.floor((xpMap[problem.difficulty] || 10) / 4);

    // Update user totalXP and calculate level-up from the authoritative value.
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { totalXP: { increment: xpEarned } },
      select: { totalXP: true },
    });
    const previousLevel = getLevelForXP(updatedUser.totalXP - xpEarned).current.level;
    const newLevel = getLevelForXP(updatedUser.totalXP).current.level;

    // Update pattern progress if applicable
    let ahaMoment = null;
    if (problem.pattern) {
      const updatedPattern = await prisma.patternProgress.upsert({
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
      if (isFirstSolve) {
        ahaMoment = checkAhaMoment(problem.pattern, updatedPattern.problemsSolved);
      }
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
      levelUp: newLevel > previousLevel,
      newLevel,
      patternDiscovery,
      ahaMoment,
    };
  }

    // Task 3.4: Invalidate caches
    await invalidateUserCache(session.user.id);

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
