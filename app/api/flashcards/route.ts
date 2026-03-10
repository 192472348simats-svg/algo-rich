import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET /api/flashcards — Get due flashcards for review
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const deckType = searchParams.get("deck") || undefined;
    const limit = parseInt(searchParams.get("limit") || "20");

    const now = new Date();

    const cards = await prisma.flashCard.findMany({
      where: {
        userId: session.user.id,
        nextReview: { lte: now },
        ...(deckType ? { type: deckType } : {}),
      },
      orderBy: { nextReview: "asc" },
      take: limit,
    });

    return NextResponse.json(cards);
  } catch (error) {
    console.error("Error fetching flashcards:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/flashcards — Create a new flashcard
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { front, back, type, code, patternId } = body;

    if (!front || !back || !type) {
      return NextResponse.json(
        { error: "front, back, and type are required" },
        { status: 400 }
      );
    }

    const card = await prisma.flashCard.create({
      data: {
        userId: session.user.id,
        front,
        back,
        type,
        code: code || null,
        patternId: patternId || null,
      },
    });

    return NextResponse.json(card, { status: 201 });
  } catch (error) {
    console.error("Error creating flashcard:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
