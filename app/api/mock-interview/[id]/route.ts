import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { parseAndNormalizeTestCases } from "@/lib/types/problem";

interface Props {
  params: Promise<{ id: string }>;
}

// GET: fetch the active interview session + problems
export async function GET(_req: NextRequest, { params }: Props) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const interview = await prisma.mockInterviewSession.findUnique({
      where: { id },
    });

    if (!interview || interview.userId !== session.user.id) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const problemIds: string[] = JSON.parse(interview.problemIds);
    const problems = await prisma.problem.findMany({
      where: { id: { in: problemIds } },
      select: {
        id: true,
        title: true,
        difficulty: true,
        description: true,
        examples: true,
        constraints: true,
        hints: true,
        starterCode: true,
        testCases: true,
        pattern: true,
        companies: true,
      },
    });

    // Restore original order from problemIds array
    const ordered = problemIds
      .map((pid) => problems.find((p) => p.id === pid))
      .filter(Boolean)
      .map((p) => ({
        ...p!,
        testCases: parseAndNormalizeTestCases(p!.testCases),
      }));

    const elapsedMs = Date.now() - new Date(interview.startedAt).getTime();
    const remainingMs = Math.max(0, interview.timeLimitMins * 60 * 1000 - elapsedMs);

    return NextResponse.json({
      session: {
        id: interview.id,
        company: interview.company,
        difficulty: interview.difficulty,
        timeLimitMins: interview.timeLimitMins,
        status: interview.status,
        startedAt: interview.startedAt,
        remainingMs,
      },
      problems: ordered,
    });
  } catch (error) {
    console.error("[mock-interview/[id] GET]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH: abandon a session
export async function PATCH(_req: NextRequest, { params }: Props) {
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

    await prisma.mockInterviewSession.update({
      where: { id },
      data: { status: "abandoned", endedAt: new Date() },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[mock-interview/[id] PATCH]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
