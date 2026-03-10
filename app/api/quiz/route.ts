import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// POST /api/quiz — Save quiz result
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { quizType, topic, question, userAnswer, correct, timeSpent } = body;

    if (!quizType || !topic || correct === undefined) {
      return NextResponse.json(
        { error: "quizType, topic, and correct are required" },
        { status: 400 }
      );
    }

    const result = await prisma.quizResult.create({
      data: {
        userId: session.user.id,
        quizType,
        topic,
        question: question || "",
        userAnswer: userAnswer || "",
        correct: Boolean(correct),
        timeSpent: timeSpent ?? 0,
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
    const limit = parseInt(searchParams.get("limit") || "50");

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
