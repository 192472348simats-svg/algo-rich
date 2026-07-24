import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import DashboardContent from "./components/DashboardContent";
import { categoryIcon } from "@/lib/utils";
import { unstable_cache } from "next/cache";
import { computeStreak } from "@/lib/streakUtils";

// Cache static/global data for 1 hour
const getGlobalDashboardData = unstable_cache(
  async () => {
    const [totalProblems, totalCourses, dbCourses] = await Promise.all([
      prisma.problem.count(),
      prisma.course.count(),
      prisma.course.findMany({
        orderBy: { order: "asc" },
        include: { lessons: { select: { id: true } } },
      }),
    ]);
    return { totalProblems, totalCourses, dbCourses };
  },
  ["global-dashboard-data"],
  { revalidate: 3600, tags: ["global-data"] }
);

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/signin");
  }

  const userId = session.user.id;

  // ─── Safe defaults when DB is unreachable ──────────────────
  let lessonsCompleted = 0;
  let problemsSolved = 0;
  let reviewsDue = 0;
  let completedProgress: { lessonId: string }[] = [];
  let progressRecords: { completedAt: Date | null }[] = [];
  let submissionRecords: { problemId: string; createdAt: Date; status: string; problem: { difficulty: string; category: string | null } | null }[] = [];
  let cardsReviewedCount = 0;
  let reviewsCompletedCount = 0;
  let user: any = null;

  // Global content is also database-backed; render an empty dashboard if local
  // development cannot reach the database.
  let globalData: Awaited<ReturnType<typeof getGlobalDashboardData>> = {
    totalProblems: 0,
    totalCourses: 0,
    dbCourses: [],
  };
  try {
    globalData = await getGlobalDashboardData();
  } catch (error) {
    console.warn("[DashboardPage] Global data unavailable; using empty state.", error instanceof Error ? error.message : error);
  }
  const { totalProblems, totalCourses, dbCourses } = globalData;

  try {
    // ── User-specific DB round trip ──────────────────────
    const results = await Promise.all([
      prisma.progress.count({ where: { userId, completed: true } }),
      prisma.submission.count({ where: { userId, status: "accepted" } }),
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
      prisma.submission.findMany({
        where: { userId },
        select: {
          problemId: true,
          createdAt: true,
          status: true,
          problem: { select: { difficulty: true, category: true } },
        },
      }),
      prisma.flashCard.count({ where: { userId, ease: { not: 2.5 } } }).catch(() => 0),
      prisma.problemReview.count({ where: { userId, lastReviewedAt: { not: null } } }).catch(() => 0),
    ]);

    [
      lessonsCompleted,
      problemsSolved,
      user,
      reviewsDue,
      completedProgress,
      progressRecords,
      submissionRecords,
      cardsReviewedCount,
      reviewsCompletedCount,
    ] = results;
  } catch (err) {
    console.warn("[DashboardPage] User data unavailable; using empty state.", err instanceof Error ? err.message : err);
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
  const acceptedProblemIds = new Set(
    submissionRecords
      .filter((submission) => submission.status === "accepted")
      .map((submission) => submission.problemId)
  );
  problemsSolved = acceptedProblemIds.size;
  
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const { currentStreak } = computeStreak(Array.from(activityDates));

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
      .map((submission) => submission.problemId)
  ).size;
  const hardSolved = new Set(
    acceptedSubs.filter((s) => s.problem?.difficulty === "hard" || s.problem?.difficulty === "Hard")
      .map((submission) => submission.problemId)
  ).size;
  const topicsCovered = new Set(
    acceptedSubs.map((s) => s.problem?.category).filter(Boolean)
  ).size;
  const coursesCompleted = dbCourses.filter((c) => {
    const total = c.lessons.length;
    if (total === 0) return false;
    const completed = c.lessons.filter((l: { id: string }) => completedLessonIds.has(l.id)).length;
    return completed >= total;
  }).length;

  // ── Build course cards ─────────────────────────────────────
  const courses = dbCourses.map((course) => {
    const totalLessons = course.lessons.length;
    const completedLessons = course.lessons.filter((l: { id: string }) =>
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

