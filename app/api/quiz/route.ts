import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

const quizSchema = z.object({
  quizType: z.string().trim().min(1).max(100),
  topic: z.string().trim().min(1).max(120),
  question: z.string().max(5_000).optional().default(""),
  userAnswer: z.string().max(5_000).optional().default(""),
  correct: z.boolean(),
  timeSpent: z.number().int().nonnegative().max(3_600).optional().default(0),
});

// POST /api/quiz — Save quiz result
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const parsedBody = quizSchema.safeParse(await request.json().catch(() => null));
    if (!parsedBody.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    const { quizType, topic, question, userAnswer, correct, timeSpent } = parsedBody.data;

    const result = await prisma.quizResult.create({
      data: {
        userId: session.user.id,
        quizType,
        topic,
        question,
        userAnswer,
        correct,
        timeSpent,
      },
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Error saving quiz result:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// GET /api/quiz — Get quiz history
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const topic = searchParams.get("topic") || undefined;
    const requestedLimit = Number(searchParams.get("limit") || 50);
    const limit = Number.isInteger(requestedLimit) ? Math.min(Math.max(requestedLimit, 1), 100) : 50;

    const results = await prisma.quizResult.findMany({
      where: {
        userId: session.user.id,
        ...(topic ? { topic } : {}),
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return NextResponse.json(results);
  } catch (error) {
    console.error("Error fetching quiz results:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
