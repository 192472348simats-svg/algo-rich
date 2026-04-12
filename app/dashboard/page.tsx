import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import DashboardContent from "./components/DashboardContent";
import { categoryIcon } from "@/lib/utils";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/signin");
  }

  const userId = session.user.id;

  // ─── Safe defaults when DB is unreachable ──────────────────
  let lessonsCompleted = 0;
  let problemsSolved = 0;
  let totalProblems = 0;
  let totalCourses = 0;
  let dbCourses: Awaited<ReturnType<typeof prisma.course.findMany>> = [];
  let user: {
    onboardingCompleted: boolean;
    totalXP: number;
    createdAt: Date;
    firstLessonAt: Date | null;
    firstSolveAt: Date | null;
    firstVisualizerAt: Date | null;
    firstPlanAt: Date | null;
    currentPhase: number;
    currentWeek: number;
    targetInterviewDate: Date | null;
  } | null = null;
  let reviewsDue = 0;
  let completedProgress: { lessonId: string }[] = [];
  let progressRecords: { completedAt: Date | null }[] = [];
  let submissionRecords: { createdAt: Date; status: string; problem: { difficulty: string; category: string | null } | null }[] = [];
  let cardsReviewedCount = 0;
  let reviewsCompletedCount = 0;

  try {
    // ── Single consolidated DB round trip ──────────────────────
    [
      lessonsCompleted,
      problemsSolved,
      totalProblems,
      totalCourses,
      dbCourses,
      user,
      reviewsDue,
      completedProgress,
      progressRecords,
      submissionRecords,
      cardsReviewedCount,
      reviewsCompletedCount,
    ] = await Promise.all([
      prisma.progress.count({ where: { userId, completed: true } }),
      prisma.submission.count({ where: { userId, status: "accepted" } }),
      prisma.problem.count(),
      prisma.course.count(),
      prisma.course.findMany({
        orderBy: { order: "asc" },
        include: { lessons: { select: { id: true } } },
      }),
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          onboardingCompleted: true,
          totalXP: true,
          createdAt: true,
          firstLessonAt: true,
          firstSolveAt: true,
          firstVisualizerAt: true,
          firstPlanAt: true,
          currentPhase: true,
          currentWeek: true,
          targetInterviewDate: true,
        },
      }),
      prisma.problemReview.count({
        where: { userId, nextReviewAt: { lte: new Date() } },
      }),
      prisma.progress.findMany({
        where: { userId, completed: true },
        select: { lessonId: true },
      }),
      prisma.progress.findMany({
        where: { userId, completed: true, completedAt: { not: null } },
        select: { completedAt: true },
      }),
      // Fetch accepted submissions with difficulty for achievement tracking
      prisma.submission.findMany({
        where: { userId },
        select: {
          createdAt: true,
          status: true,
          problem: { select: { difficulty: true, category: true } },
        },
      }),
      // Cards reviewed count
      prisma.flashCard.count({ where: { userId, easeFactor: { not: 2.5 } } }).catch(() => 0),
      // Reviews completed
      prisma.problemReview.count({ where: { userId, lastReviewedAt: { not: null } } }).catch(() => 0),
    ]);
  } catch (err) {
    // DB unreachable — render dashboard with safe defaults
    console.error(
      "[DashboardPage] DB unreachable:",
      err instanceof Error ? err.message.slice(0, 120) : err
    );
  }

  const completedLessonIds = new Set(completedProgress.map((p) => p.lessonId));

  // ── Streak calculation ──────────────────────────────────────
  const activityDates = new Set<string>();
  for (const p of progressRecords) {
    if (p.completedAt) activityDates.add(p.completedAt.toISOString().slice(0, 10));
  }
  for (const s of submissionRecords) {
    activityDates.add(s.createdAt.toISOString().slice(0, 10));
  }
  const sortedDays = Array.from(activityDates).sort().reverse();
  
  let currentStreak = 0;
  if (activityDates.size > 0) {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    
    let currentDate = new Date(today);
    let todayStr = currentDate.toISOString().slice(0, 10);
    
    // If no activity today, start counting from yesterday
    if (!activityDates.has(todayStr)) {
      currentDate.setUTCDate(currentDate.getUTCDate() - 1);
    }
    
    // Count consecutive days going backwards
    while (true) {
      let dateStr = currentDate.toISOString().slice(0, 10);
      if (activityDates.has(dateStr)) {
        currentStreak++;
        currentDate.setUTCDate(currentDate.getUTCDate() - 1);
      } else {
        break;
      }
    }
  }

  // ── Days since last activity ───────────────────────────────
  let daysSinceLastActivity = 999;
  if (sortedDays.length > 0) {
    const lastDate = new Date(sortedDays[0]);
    daysSinceLastActivity = Math.floor(
      (today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
    );
  }

  // ── Achievement stats derived from submissions ────────────
  const acceptedSubs = submissionRecords.filter((s) => s.status === "accepted");
  const mediumSolved = new Set(
    acceptedSubs.filter((s) => s.problem?.difficulty === "medium" || s.problem?.difficulty === "Medium")
      .map((_, i) => i)
  ).size;
  const hardSolved = new Set(
    acceptedSubs.filter((s) => s.problem?.difficulty === "hard" || s.problem?.difficulty === "Hard")
      .map((_, i) => i)
  ).size;
  const topicsCovered = new Set(
    acceptedSubs.map((s) => s.problem?.category).filter(Boolean)
  ).size;
  const coursesCompleted = dbCourses.filter((c) => {
    const total = c.lessons.length;
    if (total === 0) return false;
    const completed = c.lessons.filter((l) => completedLessonIds.has(l.id)).length;
    return completed >= total;
  }).length;

  // ── Build course cards ─────────────────────────────────────
  const courses = dbCourses.map((course) => {
    const totalLessons = course.lessons.length;
    const completedLessons = course.lessons.filter((l) =>
      completedLessonIds.has(l.id)
    ).length;
    return {
      id: course.id,
      title: course.title,
      icon: categoryIcon(course.category),
      description: course.description,
      progress: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
      totalLessons,
      completedLessons,
      href: `/dashboard/courses/${course.id}`,
    };
  });

  // ── User state ─────────────────────────────────────────────
  const phase = user?.currentPhase ?? 1;
  const userState: "new" | "active" | "advanced" =
    phase <= 1 && problemsSolved === 0 && lessonsCompleted === 0
      ? "new"
      : phase >= 3
        ? "advanced"
        : "active";

  const onboardingChecklist = {
    accountCreated: true,
    firstLesson: lessonsCompleted > 0,
    firstSolve: problemsSolved > 0,
    firstVisualizer: !!user?.firstVisualizerAt,
    firstPlan: !!user?.firstPlanAt,
  };

  const stats = {
    lessonsCompleted,
    problemsSolved,
    currentStreak,
    totalXP: user?.totalXP ?? 0,
    totalProblems,
    totalCourses,
    reviewsDue,
    daysSinceLastActivity,
    mediumSolved,
    hardSolved,
    topicsCovered,
    cardsReviewed: cardsReviewedCount,
    reviewsCompleted: reviewsCompletedCount,
    coursesCompleted,
  };

  return (
    <DashboardContent
      userName={session.user.name || "User"}
      stats={stats}
      courses={courses}
      onboardingCompleted={user?.onboardingCompleted ?? true}
      isNewUser={userState === "new"}
      userState={userState}
      onboardingChecklist={onboardingChecklist}
      currentPhase={user?.currentPhase ?? 1}
      targetInterviewDate={user?.targetInterviewDate?.toISOString() ?? null}
    />
  );
}

