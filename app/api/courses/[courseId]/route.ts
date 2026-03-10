import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params;
    const session = await auth();
    const userId = session?.user?.id;

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        lessons: {
          orderBy: { order: "asc" },
          include: {
            problems: {
              select: { id: true },
            },
          },
        },
      },
    });

    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    // Fetch user progress for all lessons if authenticated
    let progressMap: Record<
      string,
      { completed: boolean; masteryLevel: string }
    > = {};

    if (userId) {
      const progressList = await prisma.progress.findMany({
        where: {
          userId,
          lessonId: { in: course.lessons.map((l) => l.id) },
        },
        select: {
          lessonId: true,
          completed: true,
          masteryLevel: true,
        },
      });

      for (const p of progressList) {
        progressMap[p.lessonId] = {
          completed: p.completed,
          masteryLevel: p.masteryLevel,
        };
      }
    }

    // Enrich lessons with progress and problem count
    const lessons = course.lessons.map((lesson) => {
      const prog = progressMap[lesson.id];
      return {
        id: lesson.id,
        slug: lesson.slug,
        title: lesson.title,
        order: lesson.order,
        difficulty: lesson.difficulty,
        estimatedTime: lesson.estimatedTime,
        problemCount: lesson.problems.length,
        completed: prog?.completed ?? false,
        masteryLevel: prog?.masteryLevel ?? "none",
      };
    });

    return NextResponse.json({
      id: course.id,
      slug: course.slug,
      title: course.title,
      description: course.description,
      category: course.category,
      difficulty: course.difficulty,
      icon: course.icon,
      lessons,
    });
  } catch (error) {
    console.error("Error fetching course:", error);
    return NextResponse.json(
      { error: "Failed to fetch course" },
      { status: 500 }
    );
  }
}
