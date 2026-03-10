import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { calculateSM2, qualityToSM2 } from "@/lib/spacedRepetition";

// PATCH /api/flashcards/[cardId] — Review a flashcard (SM-2 update)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ cardId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { cardId } = await params;
    const body = await request.json();
    const { quality } = body as {
      quality: "again" | "hard" | "good" | "easy";
    };

    if (!quality || !["again", "hard", "good", "easy"].includes(quality)) {
      return NextResponse.json(
        { error: "quality must be one of: again, hard, good, easy" },
        { status: 400 }
      );
    }

    // Get current card
    const card = await prisma.flashCard.findFirst({
      where: { id: cardId, userId: session.user.id },
    });

    if (!card) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }

    // Calculate SM-2
    const sm2Quality = qualityToSM2(quality);
    const result = calculateSM2(
      sm2Quality,
      card.repetitions,
      card.ease,
      card.interval
    );

    const updated = await prisma.flashCard.update({
      where: { id: cardId },
      data: {
        repetitions: result.repetitions,
        ease: result.ease,
        interval: result.interval,
        nextReview: result.nextReview,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error reviewing flashcard:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/flashcards/[cardId]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ cardId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { cardId } = await params;

    await prisma.flashCard.deleteMany({
      where: { id: cardId, userId: session.user.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting flashcard:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
