import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

/**
 * POST /api/reflections
 * Save a post-solve reflection and evaluate correctness against problem metadata.
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      problemId,
      submissionId,
      patternUsed,
      timeComplexity,
      spaceComplexity,
      canOptimize,
      approachExplanation,
      solveTimeSeconds,
      skipped,
    } = body;

    if (!problemId) {
      return NextResponse.json(
        { error: "problemId required" },
        { status: 400 }
      );
    }

    // Get the problem's correct answers for validation
    const problem = await prisma.problem.findUnique({
      where: { id: problemId },
      select: {
        correctPattern: true,
        correctTimeComplexity: true,
        correctSpaceComplexity: true,
        isOptimal: true,
      },
    });

    // Evaluate correctness
    let patternCorrect: boolean | null = null;
    let timeCorrect: boolean | null = null;
    let spaceCorrect: boolean | null = null;
    let optimizeCorrect: boolean | null = null;

    if (problem && !skipped) {
      if (patternUsed && problem.correctPattern) {
        patternCorrect =
          normalizePattern(patternUsed) ===
          normalizePattern(problem.correctPattern);
      }
      if (timeComplexity && problem.correctTimeComplexity) {
        timeCorrect =
          normalizeComplexity(timeComplexity) ===
          normalizeComplexity(problem.correctTimeComplexity);
      }
      if (spaceComplexity && problem.correctSpaceComplexity) {
        spaceCorrect =
          normalizeComplexity(spaceComplexity) ===
          normalizeComplexity(problem.correctSpaceComplexity);
      }
      if (canOptimize !== undefined && canOptimize !== null) {
        if (problem.isOptimal) {
          optimizeCorrect = canOptimize === "no";
        } else {
          optimizeCorrect = canOptimize === "yes";
        }
      }
    }

    const reflection = await prisma.reflection.create({
      data: {
        userId: session.user.id,
        problemId,
        submissionId: submissionId || null,
        patternUsed: patternUsed || null,
        timeComplexity: timeComplexity || null,
        spaceComplexity: spaceComplexity || null,
        canOptimize: canOptimize || null,
        approachExplanation: approachExplanation || null,
        patternCorrect,
        timeCorrect,
        spaceCorrect,
        optimizeCorrect,
        solveTimeSeconds: solveTimeSeconds || null,
        skipped: skipped || false,
      },
    });

    // Award XP for completing reflection (not skipped)
    if (!skipped) {
      let xp = 5; // base XP
      if (patternCorrect) xp += 5;
      if (timeCorrect) xp += 5;
      if (spaceCorrect) xp += 5;
      if (approachExplanation && approachExplanation.length > 20) xp += 5;

      await prisma.user.update({
        where: { id: session.user.id },
        data: { totalXP: { increment: xp } },
      });
    }

    return NextResponse.json({
      id: reflection.id,
      reflection: {
        patternCorrect,
        timeCorrect,
        spaceCorrect,
        optimizeCorrect,
        correctPattern: problem?.correctPattern,
        correctTimeComplexity: problem?.correctTimeComplexity,
        correctSpaceComplexity: problem?.correctSpaceComplexity,
        isOptimal: problem?.isOptimal,
      },
    });
  } catch (error) {
    console.error("[REFLECTION POST] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ── Helpers ─────────────────────────────────────────────

function normalizePattern(p: string): string {
  const normalized = p.toLowerCase().replace(/[^a-z0-9]/g, "");
  const aliases: Record<string, string> = {
    hashmap: "hashmap",
    hashtable: "hashmap",
    hash: "hashmap",
    twopointers: "twopointers",
    twopointer: "twopointers",
    bfsdfs: "bfsdfs",
    dfs: "bfsdfs",
    bfs: "bfsdfs",
    depthfirstsearch: "bfsdfs",
    breadthfirstsearch: "bfsdfs",
    depthfirst: "bfsdfs",
    breadthfirst: "bfsdfs",
    dynamicprogramming: "dp",
    dp: "dp",
    slidingwindow: "slidingwindow",
    binarysearch: "binarysearch",
    divideandconquer: "divideandconquer",
    divideconquer: "divideandconquer",
    prefixsuffix: "prefixsuffix",
    backtracking: "backtracking",
    greedy: "greedy",
    stack: "stack",
    stackqueue: "stack",
    recursion: "recursion",
    intervals: "intervals",
    design: "design",
    reverse: "reverse",
    bruteforce: "bruteforce",
  };
  return aliases[normalized] || normalized;
}

function normalizeComplexity(c: string): string {
  // Remove all whitespace and lowercase
  const normalized = c.toLowerCase().replace(/\s+/g, "");

  // Normalize common variations
  const aliases: Record<string, string> = {
    "o(n^2)": "o(n²)",
    "o(n**2)": "o(n²)",
    "o(nsquared)": "o(n²)",
    "o(nlogn)": "o(nlogn)",
    "o(n*logn)": "o(nlogn)",
    "o(n·logn)": "o(nlogn)",
    "o(logn)": "o(logn)",
    "o(log(n))": "o(logn)",
    "o(m*n)": "o(m·n)",
    "o(mn)": "o(m·n)",
    "o(n^3)": "o(n³)",
  };

  return aliases[normalized] || normalized;
}
