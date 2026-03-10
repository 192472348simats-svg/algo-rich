import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const difficulty = searchParams.get("difficulty");
    const category = searchParams.get("category");
    const pattern = searchParams.get("pattern");
    const slug = searchParams.get("slug");
    const afterOrder = searchParams.get("afterOrder");
    const limit = searchParams.get("limit");

    const session = await auth();
    const userId = session?.user?.id;

    // Build where clause
    const where: Record<string, unknown> = {};
    if (difficulty && difficulty !== "All") {
      where.difficulty = difficulty.charAt(0).toLowerCase() + difficulty.slice(1).toLowerCase();
    }
    if (category) {
      where.category = category;
    }
    if (pattern) {
      where.pattern = pattern;
    }
    if (slug) {
      where.slug = slug;
    }
    if (afterOrder) {
      where.topicOrder = { gt: parseInt(afterOrder, 10) };
    }

    const problems = await prisma.problem.findMany({
      where,
      orderBy: [{ topicOrder: "asc" }, { title: "asc" }],
      take: limit ? parseInt(limit, 10) : undefined,
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        difficulty: true,
        category: true,
        pattern: true,
        topics: true,
        topicOrder: true,
        lessons: {
          select: {
            lesson: {
              select: {
                id: true,
                slug: true,
                title: true,
              },
            },
          },
        },
      },
    });

    // Enrich with user solve status if authenticated
    let solvedSet = new Set<string>();
    if (userId) {
      const acceptedSubmissions = await prisma.submission.findMany({
        where: {
          userId,
          status: "accepted",
          problemId: { in: problems.map((p) => p.id) },
        },
        select: { problemId: true },
        distinct: ["problemId"],
      });
      solvedSet = new Set(acceptedSubmissions.map((s) => s.problemId));
    }

    const enriched = problems.map((p) => ({
      ...p,
      topics: p.topics ? JSON.parse(p.topics) : [],
      connectedLessons: p.lessons.map((lp) => lp.lesson),
      lessons: undefined,
      solved: solvedSet.has(p.id),
    }));

    return NextResponse.json(enriched);
  } catch (error) {
    console.error("Error fetching problems:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
