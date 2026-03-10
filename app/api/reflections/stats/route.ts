import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

/**
 * GET /api/reflections/stats
 * Returns reflection accuracy stats for the authenticated user.
 */
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const reflections = await prisma.reflection.findMany({
      where: {
        userId: session.user.id,
        skipped: false,
      },
      select: {
        patternCorrect: true,
        timeCorrect: true,
        spaceCorrect: true,
        optimizeCorrect: true,
        patternUsed: true,
      },
    });

    const total = reflections.length;
    if (total === 0) {
      return NextResponse.json({
        total: 0,
        patternAccuracy: 0,
        timeAccuracy: 0,
        spaceAccuracy: 0,
        optimizeAccuracy: 0,
        overallAccuracy: 0,
        patternDistribution: {},
        weakArea: null,
      });
    }

    // Calculate accuracies
    const withPattern = reflections.filter((r) => r.patternCorrect !== null);
    const withTime = reflections.filter((r) => r.timeCorrect !== null);
    const withSpace = reflections.filter((r) => r.spaceCorrect !== null);
    const withOptimize = reflections.filter((r) => r.optimizeCorrect !== null);

    const patternAccuracy =
      withPattern.length > 0
        ? Math.round(
            (withPattern.filter((r) => r.patternCorrect).length /
              withPattern.length) *
              100
          )
        : 0;

    const timeAccuracy =
      withTime.length > 0
        ? Math.round(
            (withTime.filter((r) => r.timeCorrect).length / withTime.length) *
              100
          )
        : 0;

    const spaceAccuracy =
      withSpace.length > 0
        ? Math.round(
            (withSpace.filter((r) => r.spaceCorrect).length /
              withSpace.length) *
              100
          )
        : 0;

    const optimizeAccuracy =
      withOptimize.length > 0
        ? Math.round(
            (withOptimize.filter((r) => r.optimizeCorrect).length /
              withOptimize.length) *
              100
          )
        : 0;

    // Count how many categories have data for averaging
    const activeCategories = [
      patternAccuracy > 0 ? patternAccuracy : null,
      timeAccuracy > 0 ? timeAccuracy : null,
      spaceAccuracy > 0 ? spaceAccuracy : null,
      optimizeAccuracy > 0 ? optimizeAccuracy : null,
    ].filter((v) => v !== null) as number[];

    const overallAccuracy =
      activeCategories.length > 0
        ? Math.round(
            activeCategories.reduce((s, v) => s + v, 0) /
              activeCategories.length
          )
        : 0;

    // Pattern distribution
    const patternCounts: Record<string, number> = {};
    for (const r of reflections) {
      if (r.patternUsed) {
        patternCounts[r.patternUsed] =
          (patternCounts[r.patternUsed] || 0) + 1;
      }
    }

    // Identify weakest area
    const areas = [
      { name: "Pattern Recognition", accuracy: patternAccuracy },
      { name: "Time Complexity", accuracy: timeAccuracy },
      { name: "Space Complexity", accuracy: spaceAccuracy },
    ].filter((a) => a.accuracy > 0);

    const weakArea =
      areas.length > 0
        ? areas.sort((a, b) => a.accuracy - b.accuracy)[0]
        : null;

    return NextResponse.json({
      total,
      patternAccuracy,
      timeAccuracy,
      spaceAccuracy,
      optimizeAccuracy,
      overallAccuracy,
      patternDistribution: patternCounts,
      weakArea,
    });
  } catch (error) {
    console.error("[REFLECTION STATS] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
