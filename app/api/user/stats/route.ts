import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { computeStreak } from "@/lib/streakUtils";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

  // Parallel queries
  const [
    lessonsCompleted,
    totalLessons,
    problemsSolved,
    totalProblems,
    progressRecords,
    submissionRecords,
    userData,
  ] = await Promise.all([
    prisma.progress.count({ where: { userId, completed: true } }),
    prisma.lesson.count(),
    prisma.submission.count({ where: { userId, status: "accepted" } }),
    prisma.problem.count(),
    prisma.progress.findMany({
      where: { userId, completed: true, completedAt: { not: null } },
      select: { completedAt: true },
      orderBy: { completedAt: "desc" },
    }),
    prisma.submission.findMany({
      where: { userId },
      select: { createdAt: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.findUnique({
      where: { id: userId },
      select: { totalXP: true, currentPhase: true, targetInterviewDate: true },
    }),
  ]);

  // Calculate estimated hours from completed lessons
  const completedLessonsData = await prisma.progress.findMany({
    where: { userId, completed: true },
    include: { lesson: { select: { estimatedTime: true } } },
  });
  const estimatedMinutes = completedLessonsData.reduce(
    (sum, p) => sum + p.lesson.estimatedTime,
    0
  );
  const estimatedHours = Math.round((estimatedMinutes / 60) * 10) / 10;

  // Calculate streak from unique activity days
  const activityDates = new Set<string>();
  for (const p of progressRecords) {
    if (p.completedAt) {
      activityDates.add(p.completedAt.toISOString().slice(0, 10));
    }
  }
  for (const s of submissionRecords) {
    activityDates.add(s.createdAt.toISOString().slice(0, 10));
  }

  const { currentStreak } = computeStreak(Array.from(activityDates));

  // Progress over the last 180 days for the progress heatmap.

  const progressOverTime: Array<{ date: string; count: number }> = [];
  for (let i = 179; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);

    let count = 0;
    for (const p of progressRecords) {
      if (p.completedAt && p.completedAt.toISOString().slice(0, 10) === dateStr) {
        count++;
      }
    }
    for (const s of submissionRecords) {
      if (s.createdAt.toISOString().slice(0, 10) === dateStr) {
        count++;
      }
    }
    progressOverTime.push({ date: dateStr, count });
  }

  return NextResponse.json({
    lessonsCompleted,
    totalLessons,
    problemsSolved,
    totalProblems,
    currentStreak,
    estimatedHours,
    progressOverTime,
    totalXP: userData?.totalXP ?? 0,
    currentPhase: userData?.currentPhase ?? 1,
    targetInterviewDate: userData?.targetInterviewDate ?? null,
  });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
