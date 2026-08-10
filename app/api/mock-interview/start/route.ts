import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

const startSchema = z.object({
  company: z.enum(["Amazon", "Google", "Flipkart", "Microsoft", "TCS", "General"]),
  difficulty: z.enum(["easy", "medium", "hard", "mixed"]),
  timeLimitMins: z.number().int().min(15).max(120).default(45),
  problemCount: z.number().int().min(1).max(3).default(2),
});

// Company → difficulty weight mapping for problem selection
const COMPANY_DIFFICULTY: Record<string, string[]> = {
  Amazon:   ["medium", "medium", "hard"],
  Google:   ["medium", "hard", "hard"],
  Flipkart: ["medium", "medium", "hard"],
  Microsoft:["easy",   "medium", "medium"],
  TCS:      ["easy",   "easy",   "medium"],
  General:  ["easy",   "medium", "hard"],
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    const parsed = startSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request", details: parsed.error.flatten() }, { status: 400 });
    }

    const { company, difficulty, timeLimitMins, problemCount } = parsed.data;

    // Find problems already solved by the user
    const solved = await prisma.submission.findMany({
      where: { userId: session.user.id, status: "accepted" },
      select: { problemId: true },
    });
    const solvedIds = new Set(solved.map((s) => s.problemId));

    // Build difficulty array for selection
    const difficultyPool: string[] = difficulty === "mixed"
      ? COMPANY_DIFFICULTY[company] ?? ["medium", "hard"]
      : Array(problemCount).fill(difficulty);

    // Fetch company-targeted problems
    const selectedProblems: Array<{ id: string; title: string; difficulty: string }> = [];
    const usedIds = new Set<string>();

    for (let i = 0; i < problemCount; i++) {
      const targetDiff = difficultyPool[i];

      // Find problems: prefer company-tagged + right difficulty + unsolved
      const candidates = await prisma.problem.findMany({
        where: {
          AND: [
            { isActive: true },
            { id: { notIn: [...usedIds, ...(solvedIds.size > 0 ? [...solvedIds] : ["__none__"])] } },
            {
              OR: [
                { companies: { contains: company } },
                { companies: { contains: "General" } },
              ],
            },
            { difficulty: { equals: targetDiff.charAt(0).toUpperCase() + targetDiff.slice(1) } },
          ],
        },
        select: { id: true, title: true, difficulty: true },
        take: 30,
      });

      const pool = shuffle(candidates);

      if (pool.length > 0) {
        selectedProblems.push(pool[0]);
        usedIds.add(pool[0].id);
      } else {
        // Fallback: any problem of this difficulty not already picked
        const fallback = await prisma.problem.findFirst({
          where: {
            isActive: true,
            id: { notIn: [...usedIds] },
            difficulty: { equals: targetDiff.charAt(0).toUpperCase() + targetDiff.slice(1) },
          },
          select: { id: true, title: true, difficulty: true },
        });
        if (fallback) {
          selectedProblems.push(fallback);
          usedIds.add(fallback.id);
        }
      }
    }

    if (selectedProblems.length === 0) {
      return NextResponse.json({ error: "No suitable problems found. Please seed the database first." }, { status: 404 });
    }

    // Create the session
    const interview = await prisma.mockInterviewSession.create({
      data: {
        userId: session.user.id,
        company,
        difficulty,
        timeLimitMins,
        problemIds: JSON.stringify(selectedProblems.map((p) => p.id)),
        status: "active",
      },
    });

    return NextResponse.json({
      sessionId: interview.id,
      company,
      difficulty,
      timeLimitMins,
      problems: selectedProblems,
    });
  } catch (error) {
    console.error("[mock-interview/start POST]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
