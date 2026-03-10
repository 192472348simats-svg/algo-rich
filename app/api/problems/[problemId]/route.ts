import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

interface Props {
  params: Promise<{ problemId: string }>;
}

export async function GET(_request: Request, { params }: Props) {
  try {
    const { problemId } = await params;
    const session = await auth();
    const userId = session?.user?.id;

    const problem = await prisma.problem.findUnique({
      where: { id: problemId },
      include: {
        lessons: {
          orderBy: { order: "asc" },
          include: {
            lesson: {
              select: {
                id: true,
                slug: true,
                title: true,
                difficulty: true,
                courseId: true,
                course: {
                  select: { title: true, category: true },
                },
              },
            },
          },
        },
      },
    });

    if (!problem) {
      return NextResponse.json({ error: "Problem not found" }, { status: 404 });
    }

    let testCases;
    try {
      testCases = JSON.parse(problem.testCases);
    } catch {
      testCases = [];
    }

    // Get related lessons shaped nicely
    const relatedLessons = problem.lessons.map((lp) => lp.lesson);

    // Get recent submissions and next problem in topic if authenticated
    let recentSubmissions: unknown[] = [];
    let nextProblem = null;

    if (userId) {
      recentSubmissions = await prisma.submission.findMany({
        where: { userId, problemId },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          status: true,
          passedTests: true,
          totalTests: true,
          createdAt: true,
        },
      });

      // Find next problem in topic order
      if (problem.topicOrder > 0) {
        nextProblem = await prisma.problem.findFirst({
          where: {
            topicOrder: { gt: problem.topicOrder },
            isActive: true,
          },
          orderBy: { topicOrder: "asc" },
          select: {
            id: true,
            slug: true,
            title: true,
            difficulty: true,
          },
        });
      }
    }

    return NextResponse.json({
      ...problem,
      testCases,
      lessons: undefined,
      relatedLessons,
      recentSubmissions,
      nextProblem,
    });
  } catch (error) {
    console.error("Error fetching problem:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
