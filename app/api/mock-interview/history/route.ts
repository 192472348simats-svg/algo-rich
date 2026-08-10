import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET: list past mock interview sessions for the current user
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sessions = await prisma.mockInterviewSession.findMany({
      where: { userId: session.user.id },
      orderBy: { startedAt: "desc" },
      take: 10,
      select: {
        id: true,
        company: true,
        difficulty: true,
        timeLimitMins: true,
        score: true,
        status: true,
        startedAt: true,
        endedAt: true,
        problemIds: true,
        aiFeedback: true,
      },
    });

    const enriched = await Promise.all(
      sessions.map(async (s) => {
        let problemTitles: string[] = [];
        try {
          const ids: string[] = JSON.parse(s.problemIds);
          const problems = await prisma.problem.findMany({
            where: { id: { in: ids } },
            select: { id: true, title: true, difficulty: true },
          });
          problemTitles = ids.map(
            (id) => problems.find((p) => p.id === id)?.title ?? "Unknown"
          );
        } catch {
          // ignore
        }
        return { ...s, problemTitles };
      })
    );

    return NextResponse.json({ sessions: enriched });
  } catch (error) {
    console.error("[mock-interview/history GET]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
