import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress: number; // 0-100
  requirement: string;
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

  const [
    lessonsCompleted,
    totalLessons,
    problemsSolved,
    totalProblems,
    submissionCount,
    progressRecords,
    submissionRecords,
    pythonLessonsCompleted,
    pythonTotalLessons,
    dsLessonsCompleted,
    dsTotalLessons,
  ] = await Promise.all([
    prisma.progress.count({ where: { userId, completed: true } }),
    prisma.lesson.count(),
    prisma.submission.count({ where: { userId, status: "accepted" } }),
    prisma.problem.count(),
    prisma.submission.count({ where: { userId } }),
    prisma.progress.findMany({
      where: { userId, completed: true, completedAt: { not: null } },
      select: { completedAt: true },
    }),
    prisma.submission.findMany({
      where: { userId },
      select: { createdAt: true },
    }),
    prisma.progress.count({
      where: {
        userId,
        completed: true,
        lesson: { course: { category: "python" } },
      },
    }),
    prisma.lesson.count({ where: { course: { category: "python" } } }),
    prisma.progress.count({
      where: {
        userId,
        completed: true,
        lesson: { course: { category: "data-structures" } },
      },
    }),
    prisma.lesson.count({ where: { course: { category: "data-structures" } } }),
  ]);

  // Calculate streak
  const activityDates = new Set<string>();
  for (const p of progressRecords) {
    if (p.completedAt) activityDates.add(p.completedAt.toISOString().slice(0, 10));
  }
  for (const s of submissionRecords) {
    activityDates.add(s.createdAt.toISOString().slice(0, 10));
  }
  const sortedDays = Array.from(activityDates).sort().reverse();
  let currentStreak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = 0; i < sortedDays.length; i++) {
    const expected = new Date(today);
    expected.setDate(expected.getDate() - i);
    if (sortedDays[i] === expected.toISOString().slice(0, 10)) {
      currentStreak++;
    } else break;
  }

  const badges: Badge[] = [
    {
      id: "first-steps",
      name: "First Steps",
      description: "Complete your first lesson",
      icon: "🎯",
      unlocked: lessonsCompleted >= 1,
      progress: Math.min(100, (lessonsCompleted / 1) * 100),
      requirement: "Complete 1 lesson",
    },
    {
      id: "python-master",
      name: "Python Basics Master",
      description: "Complete all Python Foundations lessons",
      icon: "🐍",
      unlocked: pythonTotalLessons > 0 && pythonLessonsCompleted >= pythonTotalLessons,
      progress: pythonTotalLessons > 0
        ? Math.min(100, Math.round((pythonLessonsCompleted / pythonTotalLessons) * 100))
        : 0,
      requirement: `Complete all ${pythonTotalLessons} Python lessons`,
    },
    {
      id: "problem-solver",
      name: "Problem Solver",
      description: "Successfully solve 5 practice problems",
      icon: "💡",
      unlocked: problemsSolved >= 5,
      progress: Math.min(100, Math.round((problemsSolved / 5) * 100)),
      requirement: "Solve 5 problems",
    },
    {
      id: "consistent-learner",
      name: "Consistent Learner",
      description: "Maintain a 3-day learning streak",
      icon: "🔥",
      unlocked: currentStreak >= 3,
      progress: Math.min(100, Math.round((currentStreak / 3) * 100)),
      requirement: "3-day streak",
    },
    {
      id: "ds-pro",
      name: "Data Structures Pro",
      description: "Complete all Data Structures lessons",
      icon: "🏗️",
      unlocked: dsTotalLessons > 0 && dsLessonsCompleted >= dsTotalLessons,
      progress: dsTotalLessons > 0
        ? Math.min(100, Math.round((dsLessonsCompleted / dsTotalLessons) * 100))
        : 0,
      requirement: `Complete all ${dsTotalLessons} DS lessons`,
    },
    {
      id: "speed-demon",
      name: "Speed Demon",
      description: "Submit 10 solutions to practice problems",
      icon: "⚡",
      unlocked: submissionCount >= 10,
      progress: Math.min(100, Math.round((submissionCount / 10) * 100)),
      requirement: "Submit 10 solutions",
    },
    {
      id: "completionist",
      name: "Completionist",
      description: "Complete every lesson and solve every problem",
      icon: "👑",
      unlocked:
        totalLessons > 0 &&
        lessonsCompleted >= totalLessons &&
        problemsSolved >= totalProblems,
      progress:
        totalLessons > 0 && totalProblems > 0
          ? Math.min(
              100,
              Math.round(
                ((lessonsCompleted + problemsSolved) /
                  (totalLessons + totalProblems)) *
                  100
              )
            )
          : 0,
      requirement: "Complete all lessons & solve all problems",
    },
  ];

  const unlockedCount = badges.filter((b) => b.unlocked).length;

  return NextResponse.json({ badges, unlockedCount, totalBadges: badges.length });
  } catch (error) {
    console.error("Error fetching achievements:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
