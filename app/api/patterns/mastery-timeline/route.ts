import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { buildTimeline } from "@/lib/masteryTimeline";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const patterns = await prisma.patternProgress.findMany({
      where: {
        userId: session.user.id,
        NOT: { status: "locked" },
      },
      select: {
        patternSlug: true,
        problemsSolved: true,
        status: true,
        recognitionAccuracy: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: "asc" },
    });

    const timeline = buildTimeline(patterns);
    return NextResponse.json({ timeline });
  } catch (error) {
    console.error("[patterns/mastery-timeline GET]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
