import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { parseAndNormalizeTestCases } from "@/lib/types/problem";

// Circuit breaker state for Piston (shared with submissions route pattern)
let pistonBreaker = {
  failures: 0,
  lastFailureAt: 0,
  isOpen: false,
};

const CIRCUIT_BREAKER_THRESHOLD = 3;
const CIRCUIT_BREAKER_COOLDOWN = 5 * 60 * 1000; // 5 minutes

/** Remove the interactive stdin runner from starter templates before appending
 * the server's hidden-test harness. */
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

/**
 * Run the user's code against the problem's test cases via Piston and return
 * the number of tests passed. Returns null if verification could not be performed
 * (e.g. Piston unavailable, no function name found, no code submitted).
 */
async function verifyCodeServerSide(
  code: string,
  starterCode: string,
  testCases: Array<{ input: unknown; expectedOutput: unknown }>
): Promise<number | null> {
  if (!code || !code.trim() || testCases.length === 0) return null;

  // Check circuit breaker
  const now = Date.now();
  if (pistonBreaker.isOpen && now - pistonBreaker.lastFailureAt < CIRCUIT_BREAKER_COOLDOWN) {
    console.warn("[mock-interview] Piston circuit breaker is OPEN. Skipping server verification.");
    return null;
  }
  if (pistonBreaker.isOpen) {
    console.log("[mock-interview] Piston circuit breaker resetting to CLOSED.");
    pistonBreaker.isOpen = false;
    pistonBreaker.failures = 0;
  }

  // Extract function name from starter code
  const match = starterCode.match(/def\s+(\w+)\s*\(/);
  const funcName = match ? match[1] : "";
  if (!funcName) return null;

  try {
    const functionCode = stripInputHarness(code);
    let testHarness = `import json\n\n${functionCode}\n\n`;
    testHarness += `tests = ${JSON.stringify(testCases)}\n`;
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

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const pistonRes = await fetch("https://emkc.org/api/v2/piston/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language: "python",
        version: "3.10.0",
        files: [{ name: "main.py", content: testHarness }],
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (pistonRes.ok) {
      const data = await pistonRes.json();
      const output = data.run?.output || "";
      const passMatch = output.match(/HIDDEN_PASS:(\d+)/);
      pistonBreaker.failures = 0;
      return passMatch ? parseInt(passMatch[1], 10) : 0;
    } else {
      throw new Error(`Piston responded with ${pistonRes.status}`);
    }
  } catch (error) {
    console.error("[mock-interview] Piston verification failed:", error);
    pistonBreaker.failures++;
    pistonBreaker.lastFailureAt = Date.now();
    if (pistonBreaker.failures >= CIRCUIT_BREAKER_THRESHOLD) {
      pistonBreaker.isOpen = true;
      console.error("[mock-interview] Piston circuit breaker is now OPEN.");
    }
    return null;
  }
}

// GET: return a random unsolved hard/medium problem for this session
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get problems the user hasn't solved yet
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
    const { problemId, passed: clientPassed, timeTakenSeconds, notes, code } = body;

    if (!problemId || typeof clientPassed !== "boolean") {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    // Fetch the problem to get test cases and starter code for server-side verification
    const problem = await prisma.problem.findUnique({
      where: { id: problemId },
      select: { testCases: true, starterCode: true },
    });

    let passed = clientPassed;
    let verificationSource: "server" | "client" = "client";

    // If code was submitted, verify server-side instead of trusting the client
    if (code && typeof code === "string" && code.trim() && problem) {
      const testCases = parseAndNormalizeTestCases(problem.testCases);
      const serverPassedCount = await verifyCodeServerSide(
        code,
        problem.starterCode,
        testCases
      );

      if (serverPassedCount !== null) {
        passed = serverPassedCount === testCases.length && testCases.length > 0;
        verificationSource = "server";
      } else {
        // Piston unavailable — fall back to client result, but log the trust gap
        console.warn(
          `[mock-interview] Server verification unavailable for problem ${problemId}, ` +
          `user ${session.user.id}. Falling back to client-reported passed=${clientPassed}.`
        );
      }
    }

    // Record the attempt as a submission
    await prisma.submission.create({
      data: {
        userId: session.user.id,
        problemId,
        code: code || notes || "",
        language: "mock-interview",
        status: passed ? "accepted" : "wrong_answer",
        passedTests: passed ? 1 : 0,
        totalTests: 1,
        executionTime: timeTakenSeconds ? timeTakenSeconds * 1000 : null,
      },
    });

    return NextResponse.json({ success: true, verificationSource });
  } catch (error) {
    console.error("[mock-interview POST]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
