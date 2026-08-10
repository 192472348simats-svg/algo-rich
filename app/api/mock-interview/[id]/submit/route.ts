import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

interface Props {
  params: Promise<{ id: string }>;
}

const submitSchema = z.object({
  submissions: z.record(
    z.string(),
    z.object({
      code: z.string().max(50_000).default(""),
      passed: z.boolean(),
      timeTakenMs: z.number().int().nonnegative().optional(),
    })
  ),
  timeUsedMs: z.number().int().nonnegative().optional(),
});

const GROQ_TIMEOUT_MS = 12_000;

async function generateZyraDebrief(
  company: string,
  results: Array<{ title: string; passed: boolean; code: string }>
): Promise<string> {
  const apiKey = (process.env.GROQ_API_KEY || "").trim();
  if (!apiKey) return generateFallbackDebrief(company, results);

  const summaryLines = results
    .map(
      (r, i) =>
        `Problem ${i + 1}: "${r.title}" — ${r.passed ? "✅ PASSED" : "❌ FAILED"}${r.code ? `\nCode submitted:\n\`\`\`python\n${r.code.slice(0, 800)}\n\`\`\`` : " (no code submitted)"}`
    )
    .join("\n\n");

  const prompt = `You are Zyra, reviewing a ${company} mock interview. Be sharp, specific, and honest — like a senior who cares.

${summaryLines}

Give feedback in 4-5 sentences:
1. What they did well (be specific about the pattern/approach if code was submitted)
2. What went wrong or could be better
3. ONE specific thing to study before a real ${company} interview
4. End with an encouraging but direct challenge

Keep it under 100 words. No bullet points. Conversational tone. Reference the problem titles specifically.`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), GROQ_TIMEOUT_MS);

    let res: Response;
    try {
      res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 250,
          temperature: 0.7,
        }),
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeout);
    }

    if (res.ok) {
      const data = await res.json();
      return data.choices?.[0]?.message?.content?.trim() ?? generateFallbackDebrief(company, results);
    }
  } catch (e) {
    console.warn("[mock-interview/submit] Groq debrief failed:", e);
  }

  return generateFallbackDebrief(company, results);
}

function generateFallbackDebrief(
  company: string,
  results: Array<{ title: string; passed: boolean }>
): string {
  const passedCount = results.filter((r) => r.passed).length;
  const total = results.length;

  if (passedCount === total) {
    return `Solid work — you passed all ${total} problem${total > 1 ? "s" : ""}. For ${company}, now focus on optimizing: can you reduce space complexity? Explain your approach out loud — that's what separates candidates in real interviews.`;
  }
  if (passedCount === 0) {
    return `Tough session — none passed. Don't panic. For ${company}, pick the problem you got closest on and trace through it with a simple input. What's the smallest thing you can fix right now? Start there.`;
  }
  return `${passedCount}/${total} — you're on the right track. For ${company}, the unsolved problem likely needs a key pattern insight. Go back and read the constraints carefully — they almost always hint at the right data structure.`;
}

export async function POST(req: NextRequest, { params }: Props) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const interview = await prisma.mockInterviewSession.findUnique({ where: { id } });

    if (!interview || interview.userId !== session.user.id) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    if (interview.status !== "active") {
      return NextResponse.json({ error: "Session already completed" }, { status: 409 });
    }

    const body = await req.json().catch(() => null);
    const parsed = submitSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const { submissions, timeUsedMs } = parsed.data;

    // Fetch problem details for score calculation and debrief
    const problemIds: string[] = JSON.parse(interview.problemIds);
    const problems = await prisma.problem.findMany({
      where: { id: { in: problemIds } },
      select: { id: true, title: true, difficulty: true, starterCode: true, testCases: true },
    });

    // Build results array
    const results = problemIds.map((pid) => {
      const problem = problems.find((p) => p.id === pid);
      const sub = submissions[pid];
      return {
        problemId: pid,
        title: problem?.title ?? "Unknown",
        difficulty: problem?.difficulty ?? "medium",
        passed: sub?.passed ?? false,
        code: sub?.code ?? "",
        timeTakenMs: sub?.timeTakenMs,
      };
    });

    // Calculate score (0-100)
    // Base: 50 pts per problem passed. Bonus: time efficiency
    const timeLimitMs = interview.timeLimitMins * 60 * 1000;
    const usedMs = timeUsedMs ?? timeLimitMs;
    const passedCount = results.filter((r) => r.passed).length;
    const totalCount = results.length;

    let score = Math.round((passedCount / totalCount) * 80);
    // Up to 20 bonus points for time efficiency
    if (passedCount > 0 && usedMs < timeLimitMs) {
      const timeBonus = Math.round(((timeLimitMs - usedMs) / timeLimitMs) * 20);
      score = Math.min(100, score + timeBonus);
    }

    // Generate Zyra's debrief
    const aiFeedback = await generateZyraDebrief(interview.company, results);

    // Save all to DB
    await prisma.mockInterviewSession.update({
      where: { id },
      data: {
        status: "completed",
        endedAt: new Date(),
        submissions: JSON.stringify(submissions),
        score,
        aiFeedback,
      },
    });

    // Record each problem as a submission for XP + progress tracking
    for (const r of results) {
      if (r.code.trim()) {
        await prisma.submission.create({
          data: {
            userId: session.user.id,
            problemId: r.problemId,
            code: r.code,
            language: "python",
            status: r.passed ? "accepted" : "wrong_answer",
            passedTests: r.passed ? 1 : 0,
            totalTests: 1,
            executionTime: r.timeTakenMs ? Math.round(r.timeTakenMs / 1000) : null,
          },
        });
      }
    }

    return NextResponse.json({ success: true, sessionId: id, score, aiFeedback });
  } catch (error) {
    console.error("[mock-interview/[id]/submit POST]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
