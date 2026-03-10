import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const { lessonId } = await params;
    const session = await auth();
    const userId = session?.user?.id;

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            category: true,
          },
        },
        problems: {
          orderBy: { order: "asc" },
          include: {
            problem: {
              select: {
                id: true,
                slug: true,
                title: true,
                difficulty: true,
                category: true,
                pattern: true,
              },
            },
          },
        },
      },
    });

    if (!lesson) {
      return NextResponse.json(
        { error: "Lesson not found" },
        { status: 404 }
      );
    }

    // Fetch user progress for this lesson if authenticated
    let progress = null;
    let problemStatuses: Record<string, { solved: boolean; attempts: number }> = {};

    if (userId) {
      progress = await prisma.progress.findUnique({
        where: {
          userId_lessonId: { userId, lessonId },
        },
        select: {
          completed: true,
          completedAt: true,
          masteryLevel: true,
          practicedAt: true,
        },
      });

      // Fetch submission status for connected problems
      if (lesson.problems.length > 0) {
        const problemIds = lesson.problems.map((lp) => lp.problem.id);
        const submissions = await prisma.submission.findMany({
          where: {
            userId,
            problemId: { in: problemIds },
          },
          select: {
            problemId: true,
            status: true,
          },
        });

        for (const pid of problemIds) {
          const subs = submissions.filter((s) => s.problemId === pid);
          problemStatuses[pid] = {
            solved: subs.some((s) => s.status === "accepted"),
            attempts: subs.length,
          };
        }
      }
    }

    // Shape connected problems with status
    const connectedProblems = lesson.problems.map((lp) => ({
      ...lp.problem,
      order: lp.order,
      solved: problemStatuses[lp.problem.id]?.solved ?? false,
      attempts: problemStatuses[lp.problem.id]?.attempts ?? 0,
    }));

    return NextResponse.json({
      ...lesson,
      problems: undefined,
      connectedProblems,
      progress,
    });
  } catch (error) {
    console.error("Error fetching lesson:", error);
    return NextResponse.json(
      { error: "Failed to fetch lesson" },
      { status: 500 }
    );
  }
}
