import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

interface Recommendation {
  type: "lesson" | "problem" | "review";
  id: string;
  title: string;
  reason: string;
  difficulty: string;
  href: string;
  priority: number;
  meta?: Record<string, unknown>;
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const recommendations: Recommendation[] = [];

    // 1. Find lessons the user hasn't completed yet (next in course order)
    const allCourses = await prisma.course.findMany({
      orderBy: { order: "asc" },
      include: {
        lessons: {
          orderBy: { order: "asc" },
          select: {
            id: true,
            slug: true,
            title: true,
            difficulty: true,
            order: true,
            courseId: true,
          },
        },
      },
    });

    const completedProgress = await prisma.progress.findMany({
      where: { userId, completed: true },
      select: { lessonId: true, masteryLevel: true },
    });
    const completedSet = new Set(completedProgress.map((p) => p.lessonId));
    const masteryMap = new Map(
      completedProgress.map((p) => [p.lessonId, p.masteryLevel])
    );

    // Find next uncompleted lesson per course
    for (const course of allCourses) {
      const nextLesson = course.lessons.find((l) => !completedSet.has(l.id));
      if (nextLesson) {
        recommendations.push({
          type: "lesson",
          id: nextLesson.id,
          title: nextLesson.title,
          reason: `Next lesson in ${course.title}`,
          difficulty: nextLesson.difficulty,
          href: `/dashboard/lesson/${nextLesson.id}`,
          priority: course.order * 10 + nextLesson.order,
        });
      }
    }

    // 2. Find lessons that are "read" but not "practiced" — suggest practicing
    const readOnlyLessons = completedProgress.filter(
      (p) => p.masteryLevel === "read"
    );

    if (readOnlyLessons.length > 0) {
      const lessonsWithProblems = await prisma.lesson.findMany({
        where: {
          id: { in: readOnlyLessons.map((p) => p.lessonId) },
        },
        include: {
          problems: {
            take: 1,
            include: {
              problem: {
                select: {
                  id: true,
                  slug: true,
                  title: true,
                  difficulty: true,
                },
              },
            },
          },
        },
      });

      for (const lesson of lessonsWithProblems) {
        if (lesson.problems.length > 0) {
          const problem = lesson.problems[0].problem;
          recommendations.push({
            type: "problem",
            id: problem.id,
            title: problem.title,
            reason: `Practice after completing "${lesson.title}"`,
            difficulty: problem.difficulty,
            href: `/dashboard/practice/${problem.id}`,
            priority: 5, // High priority — reinforce learning
            meta: { lessonTitle: lesson.title },
          });
        }
      }
    }

    // 3. Find unsolved problems connected to completed lessons
    const solvedSubmissions = await prisma.submission.findMany({
      where: { userId, status: "accepted" },
      select: { problemId: true },
      distinct: ["problemId"],
    });
    const solvedSet = new Set(solvedSubmissions.map((s) => s.problemId));

    const connectedProblems = await prisma.lessonProblem.findMany({
      where: {
        lessonId: { in: Array.from(completedSet) },
      },
      include: {
        problem: {
          select: {
            id: true,
            slug: true,
            title: true,
            difficulty: true,
            topicOrder: true,
          },
        },
        lesson: {
          select: { title: true },
        },
      },
      orderBy: { order: "asc" },
    });

    for (const lp of connectedProblems) {
      if (!solvedSet.has(lp.problem.id)) {
        // Avoid duplicates
        if (!recommendations.find((r) => r.id === lp.problem.id)) {
          recommendations.push({
            type: "problem",
            id: lp.problem.id,
            title: lp.problem.title,
            reason: `Linked to "${lp.lesson.title}"`,
            difficulty: lp.problem.difficulty,
            href: `/dashboard/practice/${lp.problem.id}`,
            priority: 15 + (lp.problem.topicOrder || 0),
            meta: { lessonTitle: lp.lesson.title },
          });
        }
      }
    }

    // 4. Suggest reviewing lessons completed > 3 days ago that aren't mastered
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    const reviewCandidates = await prisma.progress.findMany({
      where: {
        userId,
        completed: true,
        masteryLevel: { in: ["read", "practiced"] },
        completedAt: { lt: threeDaysAgo },
      },
      include: {
        lesson: {
          select: {
            id: true,
            title: true,
            difficulty: true,
          },
        },
      },
      take: 3,
    });

    for (const rc of reviewCandidates) {
      recommendations.push({
        type: "review",
        id: rc.lesson.id,
        title: rc.lesson.title,
        reason: "Review for better retention",
        difficulty: rc.lesson.difficulty,
        href: `/dashboard/lesson/${rc.lesson.id}`,
        priority: 50,
      });
    }

    // Sort by priority (lower = higher priority)
    recommendations.sort((a, b) => a.priority - b.priority);

    return NextResponse.json({
      recommendations: recommendations.slice(0, 8),
      totalAvailable: recommendations.length,
    });
  } catch (error) {
    console.error("Error generating recommendations:", error);
    return NextResponse.json(
      { error: "Failed to generate recommendations" },
      { status: 500 }
    );
  }
}
