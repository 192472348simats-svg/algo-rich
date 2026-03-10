import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { patterns } from "@/lib/patterns/patternDefinitions";

// GET /api/patterns — List all patterns with user progress
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userProgress = await prisma.patternProgress.findMany({
      where: { userId: session.user.id },
    });

    const progressMap = new Map(
      userProgress.map((p) => [p.patternSlug, p])
    );

    const data = patterns.map((pattern) => {
      const progress = progressMap.get(pattern.id);
      return {
        ...pattern,
        progress: progress
          ? {
              status: progress.status,
              visualizationWatched: progress.visualizationWatched,
              templateStudied: progress.templateStudied,
              quizPassed: progress.quizPassed,
              recognitionAccuracy: progress.recognitionAccuracy,
              problemsSolved: progress.problemsSolved,
            }
          : null,
      };
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching patterns:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
