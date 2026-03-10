import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getPattern } from "@/lib/patterns/patternDefinitions";

// GET /api/patterns/[patternId] — Get single pattern with user progress
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ patternId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { patternId } = await params;
    const pattern = getPattern(patternId);
    if (!pattern) {
      return NextResponse.json({ error: "Pattern not found" }, { status: 404 });
    }

    const progress = await prisma.patternProgress.findUnique({
      where: {
        userId_patternSlug: {
          userId: session.user.id,
          patternSlug: patternId,
        },
      },
    });

    return NextResponse.json({ ...pattern, progress });
  } catch (error) {
    console.error("Error fetching pattern:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH /api/patterns/[patternId] — Update pattern progress
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ patternId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { patternId } = await params;
    const pattern = getPattern(patternId);
    if (!pattern) {
      return NextResponse.json({ error: "Pattern not found" }, { status: 404 });
    }

  const body = await request.json();
  const allowedFields = [
    "status",
    "visualizationWatched",
    "templateStudied",
    "quizPassed",
    "recognitionAccuracy",
    "problemsSolved",
  ];

  const updateData: Record<string, unknown> = {};
  for (const field of allowedFields) {
    if (body[field] !== undefined) {
      updateData[field] = body[field];
    }
  }

  const progress = await prisma.patternProgress.upsert({
    where: {
      userId_patternSlug: {
        userId: session.user.id,
        patternSlug: patternId,
      },
    },
    update: updateData,
    create: {
      userId: session.user.id,
      patternSlug: patternId,
      ...updateData,
    },
  });

  return NextResponse.json(progress);
  } catch (error) {
    console.error("Error updating pattern progress:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
