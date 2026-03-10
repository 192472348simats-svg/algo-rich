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

  // Fetch real stats
  const [
    lessonsCompleted,
    problemsSolved,
    totalProblems,
    totalCourses,
    dbCourses,
    user,
    reviewsDue,
  ] = await Promise.all([
    prisma.progress.count({
      where: { userId, completed: true },
    }),
    prisma.submission.count({
      where: { userId, status: "accepted" },
    }),
    prisma.problem.count(),
    prisma.course.count(),
    prisma.course.findMany({
      orderBy: { order: "asc" },
      include: {
        lessons: {
          select: { id: true },
        },
      },
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
      },
    }),
    prisma.problemReview.count({
      where: {
        userId,
        nextReviewAt: { lte: new Date() },
      },
    }),
  ]);
  // Onboarding redirect removed. Dashboard always renders.

  // Fetch completed lesson IDs for this user
  const [completedProgress, progressRecords, submissionRecords] =
    await Promise.all([
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
        select: { createdAt: true },
      }),
    ]);
  const completedLessonIds = new Set(
    completedProgress.map((p) => p.lessonId)
  );

  // Calculate streak from unique activity days
  const activityDates = new Set<string>();
  for (const p of progressRecords) {
    if (p.completedAt)
      activityDates.add(p.completedAt.toISOString().slice(0, 10));
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

  // Calculate days since last activity
  let daysSinceLastActivity = 999;
  if (sortedDays.length > 0) {
    const lastDate = new Date(sortedDays[0]);
    daysSinceLastActivity = Math.floor(
      (today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
    );
  }

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
      progress:
        totalLessons > 0
          ? Math.round((completedLessons / totalLessons) * 100)
          : 0,
      totalLessons,
      completedLessons,
      href: `/dashboard/courses/${course.id}`,
    };
  });

  // Determine user state based on phase
  const phase = user?.currentPhase ?? 1;
  const userState: "new" | "active" | "advanced" =
    phase <= 1 && problemsSolved === 0 && lessonsCompleted === 0
      ? "new"
      : phase >= 3
        ? "advanced"
        : "active";

  // Onboarding checklist
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
    />
  );
}
