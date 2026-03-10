import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// POST /api/patterns/[patternId]/quiz — save a quiz result for pattern recognition
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ patternId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { patternId } = await params;
    const body = await request.json();
    const { correct, timeSpent } = body;

    if (typeof correct !== "boolean") {
      return NextResponse.json(
        { error: "Missing required field: correct" },
        { status: 400 }
      );
    }

    // Save to QuizResult table
    await prisma.quizResult.create({
      data: {
        userId: session.user.id,
        quizType: "pattern_recognition",
        topic: patternId,
        question: `Recognize pattern: ${patternId}`,
        userAnswer: correct ? patternId : "wrong",
        correct,
        timeSpent: timeSpent ?? 0,
      },
    });

    // If correct, also update PatternProgress.quizPassed
    if (correct) {
      await prisma.patternProgress.upsert({
        where: {
          userId_patternSlug: {
            userId: session.user.id,
            patternSlug: patternId,
          },
        },
        update: {
          quizPassed: true,
          recognitionAccuracy: 1.0,
        },
        create: {
          userId: session.user.id,
          patternSlug: patternId,
          quizPassed: true,
          recognitionAccuracy: 1.0,
          status: "learning",
        },
      });
    }

    // Award XP for passing
    if (correct) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { totalXP: { increment: 15 } },
      });
    }

    return NextResponse.json({
      success: true,
      correct,
      xpEarned: correct ? 15 : 0,
    });
  } catch (error) {
    console.error("Error saving quiz result:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
