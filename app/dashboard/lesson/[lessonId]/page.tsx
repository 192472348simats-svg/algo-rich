import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import LessonViewer from "./LessonViewer";

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ lessonId: string }>;
}

export default async function LessonPage({ params }: Props) {
  const session = await auth();
  if (!session?.user?.id) redirect("/signin");

  const { lessonId } = await params;

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      course: {
        include: {
          lessons: {
            orderBy: { order: "asc" },
            select: { id: true, order: true, title: true },
          },
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
            },
          },
        },
      },
    },
  });

  if (!lesson) redirect("/dashboard");

  // Check progress for this lesson
  const progress = await prisma.progress.findUnique({
    where: {
      userId_lessonId: {
        userId: session.user.id,
        lessonId,
      },
    },
  });

  // Fetch submission status for connected problems
  const problemIds = lesson.problems.map((lp) => lp.problem.id);
  const problemStatuses: Record<string, { solved: boolean; attempts: number }> = {};
  if (problemIds.length > 0) {
    const submissions = await prisma.submission.findMany({
      where: {
        userId: session.user.id,
        problemId: { in: problemIds },
      },
      select: { problemId: true, status: true },
    });
    for (const pid of problemIds) {
      const subs = submissions.filter((s) => s.problemId === pid);
      problemStatuses[pid] = {
        solved: subs.some((s) => s.status === "accepted"),
        attempts: subs.length,
      };
    }
  }

  const connectedProblems = lesson.problems.map((lp) => ({
    ...lp.problem,
    order: lp.order,
    solved: problemStatuses[lp.problem.id]?.solved ?? false,
    attempts: problemStatuses[lp.problem.id]?.attempts ?? 0,
  }));

  // Previous and next lessons
  const allLessons = lesson.course.lessons;
  const currentIndex = allLessons.findIndex((l) => l.id === lessonId);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  return (
    <LessonViewer
      lesson={{
        id: lesson.id,
        title: lesson.title,
        content: lesson.content,
        codeExample: lesson.codeExample,
        difficulty: lesson.difficulty,
        estimatedTime: lesson.estimatedTime,
        order: lesson.order,
      }}
      course={{
        id: lesson.course.id,
        title: lesson.course.title,
      }}
      isCompleted={progress?.completed ?? false}
      prevLesson={prevLesson}
      nextLesson={nextLesson}
      totalLessons={allLessons.length}
      connectedProblems={connectedProblems}
      masteryLevel={progress?.masteryLevel ?? "none"}
    />
  );
}
