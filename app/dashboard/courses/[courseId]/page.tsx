import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import CourseOverviewContent from "./CourseOverviewContent";

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ courseId: string }>;
}

export default async function CourseOverviewPage({ params }: Props) {
  const session = await auth();
  if (!session?.user?.id) redirect("/signin");

  const { courseId } = await params;

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      lessons: {
        orderBy: { order: "asc" },
      },
    },
  });

  if (!course) {
    redirect("/dashboard");
  }

  // Fetch user progress for this course
  const progress = await prisma.progress.findMany({
    where: {
      userId: session.user.id,
      lesson: { courseId },
    },
  });

  const completedLessonIds = new Set(
    progress.filter((p) => p.completed).map((p) => p.lessonId)
  );
  const masteryMap = new Map(
    progress.map((p) => [p.lessonId, p.masteryLevel])
  );

  // Fetch problem counts per lesson
  const lessonProblemCounts = await prisma.lessonProblem.groupBy({
    by: ["lessonId"],
    where: {
      lessonId: { in: course.lessons.map((l) => l.id) },
    },
    _count: { id: true },
  });
  const problemCountMap = new Map(
    lessonProblemCounts.map((lp) => [lp.lessonId, lp._count.id])
  );

  const totalTime = course.lessons.reduce((sum, l) => sum + l.estimatedTime, 0);

  const lessonsWithProgress = course.lessons.map((lesson, index) => {
    const isCompleted = completedLessonIds.has(lesson.id);
    // First lesson always unlocked; others need previous completed
    const isUnlocked =
      index === 0 ||
      completedLessonIds.has(course.lessons[index - 1].id);

    return {
      ...lesson,
      isCompleted,
      isUnlocked,
      masteryLevel: masteryMap.get(lesson.id) ?? "none",
      problemCount: problemCountMap.get(lesson.id) ?? 0,
    };
  });

  return (
    <CourseOverviewContent
      course={{
        id: course.id,
        title: course.title,
        description: course.description,
        category: course.category,
      }}
      lessons={lessonsWithProgress}
      completedCount={completedLessonIds.size}
      totalLessons={course.lessons.length}
      totalTime={totalTime}
    />
  );
}
