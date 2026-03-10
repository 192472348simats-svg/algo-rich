import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET /api/lessons/[lessonId]/problems — get problems linked to this lesson with solve status
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { lessonId } = await params;

    const lessonProblems = await prisma.lessonProblem.findMany({
      where: { lessonId },
      orderBy: { order: "asc" },
      include: {
        problem: {
          select: {
            id: true,
            slug: true,
            title: true,
            difficulty: true,
            description: true,
            pattern: true,
            category: true,
            starterCode: true,
          },
        },
      },
    });

    // Get user's solve status for these problems
    const problemIds = lessonProblems.map((lp) => lp.problem.id);
    const solvedSubmissions = await prisma.submission.findMany({
      where: {
        userId: session.user.id,
        problemId: { in: problemIds },
        status: "accepted",
      },
      select: { problemId: true },
      distinct: ["problemId"],
    });

    const solvedSet = new Set(solvedSubmissions.map((s) => s.problemId));

    const problems = lessonProblems.map((lp) => ({
      ...lp.problem,
      solved: solvedSet.has(lp.problem.id),
      order: lp.order,
    }));

    return NextResponse.json({ problems });
  } catch (error) {
    console.error("Error fetching lesson problems:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
