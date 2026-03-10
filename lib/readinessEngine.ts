import prisma from "@/lib/prisma";

// ── Readiness Score Calculator ────────────────────────
// Computes a placement/interview readiness score (0-100)
// based on multiple factors from the user's progress

export interface ReadinessComponent {
  name: string;
  score: number; // 0-100
  weight: number; // 0-1
  status: "strong" | "moderate" | "weak" | "not-started";
}

export interface TopicBreakdown {
  topic: string;
  solved: number;
  total: number;
  percentage: number;
}

export interface WeeklyDay {
  day: string;
  count: number;
  isToday: boolean;
}

export interface ReadinessResult {
  overall: number; // 0-100
  level: "beginner" | "developing" | "intermediate" | "advanced" | "interview-ready";
  components: ReadinessComponent[];
  topicBreakdown: TopicBreakdown[];
  weeklyProgress: WeeklyDay[];
  interviewEstimate: string;
}

function getStatus(score: number): "strong" | "moderate" | "weak" | "not-started" {
  if (score === 0) return "not-started";
  if (score >= 70) return "strong";
  if (score >= 40) return "moderate";
  return "weak";
}

function getLevel(score: number): ReadinessResult["level"] {
  if (score >= 85) return "interview-ready";
  if (score >= 65) return "advanced";
  if (score >= 45) return "intermediate";
  if (score >= 20) return "developing";
  return "beginner";
}

function getInterviewEstimate(score: number): string {
  if (score >= 85) return "You're likely ready for most technical interviews.";
  if (score >= 65) return "With 2-3 more weeks of practice, you'll be interview-ready.";
  if (score >= 45) return "You're building a good foundation. ~4-6 weeks to interview readiness.";
  if (score >= 20) return "Great start! Keep practicing daily. ~8-10 weeks to readiness.";
  return "Welcome! Start with the courses and easy problems to build your foundation.";
}

export async function calculateReadiness(userId: string): Promise<ReadinessResult> {
  // Fetch all user data in parallel
  const [
    submissions,
    reviews,
    reflections,
    progress,
    userPatternProgress,
    problems,
  ] = await Promise.all([
    prisma.submission.findMany({
      where: { userId },
      select: {
        status: true,
        problemId: true,
        createdAt: true,
        problem: { select: { difficulty: true, category: true } },
      },
    }),
    prisma.problemReview.findMany({
      where: { userId },
      select: { totalReviews: true, lastRating: true, interval: true },
    }),
    prisma.reflection.findMany({
      where: { userId },
      select: { patternCorrect: true, timeCorrect: true, spaceCorrect: true },
    }),
    prisma.progress.findMany({
      where: { userId },
      select: { completed: true, masteryLevel: true },
    }),
    (async () => {
      try {
        return await prisma.patternProgress.findMany({
          where: { userId },
          select: { status: true, problemsSolved: true, patternSlug: true },
        });
      } catch {
        return [];
      }
    })(),
    prisma.problem.findMany({
      select: { id: true, category: true, difficulty: true },
    }),
  ]);

  // === Component 1: Problems Solved ===
  const uniqueSolved = new Set(
    submissions.filter((s) => s.status === "accepted").map((s) => s.problemId)
  );
  const solvedCount = uniqueSolved.size;
  const totalProblems = problems.length;
  const solvedScore = Math.min(100, (solvedCount / Math.max(totalProblems * 0.5, 1)) * 100);

  // === Component 2: Difficulty Spread ===
  const solvedByDiff = { easy: 0, medium: 0, hard: 0 };
  for (const s of submissions) {
    if (s.status === "accepted" && uniqueSolved.has(s.problemId)) {
      const d = s.problem.difficulty as keyof typeof solvedByDiff;
      if (d in solvedByDiff) solvedByDiff[d]++;
    }
  }
  const diffScore = Math.min(
    100,
    (solvedByDiff.easy > 0 ? 20 : 0) +
      (solvedByDiff.medium > 0 ? 30 : 0) +
      (solvedByDiff.hard > 0 ? 30 : 0) +
      Math.min(20, (solvedByDiff.medium / 10) * 20)
  );

  // === Component 3: Pattern Coverage ===
  const masteredPatterns = userPatternProgress.filter(
    (p) => p.status === "mastered" || p.problemsSolved >= 3
  ).length;
  const totalPatterns = 15; // from seed
  const patternScore = Math.min(100, (masteredPatterns / (totalPatterns * 0.6)) * 100);

  // === Component 4: Review Consistency ===
  const totalReviewsDone = reviews.reduce((sum, r) => sum + r.totalReviews, 0);
  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + (r.lastRating || 0), 0) / reviews.length
      : 0;
  const reviewScore = Math.min(
    100,
    (totalReviewsDone / 20) * 50 + (avgRating / 5) * 50
  );

  // === Component 5: Reflection Accuracy ===
  const correctReflections = reflections.filter((r) => r.patternCorrect).length;
  const reflectionScore =
    reflections.length > 0
      ? Math.min(100, (correctReflections / reflections.length) * 100)
      : 0;

  // === Component 6: Lesson Progress ===
  const completedLessons = progress.filter((p) => p.completed).length;
  const lessonScore = Math.min(100, (completedLessons / 14) * 100);

  // === Component 7: Consistency (past 7 days) ===
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const recentSubmissions = submissions.filter((s) => s.createdAt >= weekAgo);
  const activeDays = new Set(
    recentSubmissions.map((s) => s.createdAt.toISOString().split("T")[0])
  ).size;
  const consistencyScore = Math.min(100, (activeDays / 5) * 100);

  // === Combine Components ===
  const components: ReadinessComponent[] = [
    { name: "Problems Solved", score: Math.round(solvedScore), weight: 0.25, status: getStatus(solvedScore) },
    { name: "Difficulty Spread", score: Math.round(diffScore), weight: 0.15, status: getStatus(diffScore) },
    { name: "Pattern Coverage", score: Math.round(patternScore), weight: 0.15, status: getStatus(patternScore) },
    { name: "Review Consistency", score: Math.round(reviewScore), weight: 0.1, status: getStatus(reviewScore) },
    { name: "Reflection Accuracy", score: Math.round(reflectionScore), weight: 0.1, status: getStatus(reflectionScore) },
    { name: "Lesson Progress", score: Math.round(lessonScore), weight: 0.15, status: getStatus(lessonScore) },
    { name: "Weekly Consistency", score: Math.round(consistencyScore), weight: 0.1, status: getStatus(consistencyScore) },
  ];

  const overall = Math.round(
    components.reduce((sum, c) => sum + c.score * c.weight, 0)
  );

  // === Topic Breakdown ===
  const topicCounts: Record<string, { solved: number; total: number }> = {};
  for (const p of problems) {
    const cat = p.category || "other";
    if (!topicCounts[cat]) topicCounts[cat] = { solved: 0, total: 0 };
    topicCounts[cat].total++;
    if (uniqueSolved.has(p.id)) topicCounts[cat].solved++;
  }
  const topicBreakdown: TopicBreakdown[] = Object.entries(topicCounts)
    .map(([topic, { solved, total }]) => ({
      topic,
      solved,
      total,
      percentage: total > 0 ? Math.round((solved / total) * 100) : 0,
    }))
    .sort((a, b) => b.total - a.total);

  // === Weekly Progress ===
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const today = now.getDay(); // 0=Sun, 1=Mon, ...
  const todayIdx = today === 0 ? 6 : today - 1; // Convert to Mon=0
  const weeklyProgress: WeeklyDay[] = days.map((day, i) => {
    const dayDate = new Date(now);
    dayDate.setDate(dayDate.getDate() - (todayIdx - i));
    const dateStr = dayDate.toISOString().split("T")[0];
    const count = recentSubmissions.filter(
      (s) => s.createdAt.toISOString().split("T")[0] === dateStr
    ).length;
    return { day, count, isToday: i === todayIdx };
  });

  return {
    overall,
    level: getLevel(overall),
    components,
    topicBreakdown,
    weeklyProgress,
    interviewEstimate: getInterviewEstimate(overall),
  };
}
