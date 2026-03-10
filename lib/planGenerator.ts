import prisma from "@/lib/prisma";

// ── Data interfaces for each step type ──────────────────
export interface ReviewData {
  problemId: string;
  problemSlug: string;
  problemTitle: string;
  difficulty: string;
  originalSolveDate: string;
  daysSinceSolved: number;
}

export interface LessonData {
  lessonId: string;
  lessonSlug: string;
  lessonTitle: string;
  courseName: string;
  courseCategory: string;
}

export interface VisualizeData {
  visualizerType: string;
  topic: string;
  guided: boolean;
  guidedSteps?: { instruction: string; values?: number[] }[];
}

export interface SolveData {
  problemId: string;
  problemSlug: string;
  problemTitle: string;
  difficulty: string;
  category: string;
  connectedLessonTitle?: string;
}

export interface CardsData {
  cardCount: number;
  topics: string[];
}

export interface PlanStep {
  id: string;
  type: "review" | "lesson" | "visualize" | "solve" | "cards";
  title: string;
  subtitle: string;
  estimatedMinutes: number;
  data: ReviewData | LessonData | VisualizeData | SolveData | CardsData;
}

export interface DailyPlan {
  steps: PlanStep[];
  totalMinutes: number;
  generatedAt: string;
  metadata: {
    totalSolved: number;
    totalProblems: number;
    currentStreak: number;
    weakTopics: { topic: string; percentage: number }[];
    nextMilestone: { label: string; current: number; target: number };
  };
}

// ═══════════════════════════════════════════════
// MAIN GENERATOR
// ═══════════════════════════════════════════════

export async function generateDailyPlan(userId: string): Promise<DailyPlan> {
  const steps: PlanStep[] = [];

  // ── STEP 1: Find problems to RE-SOLVE (spaced review) ──
  const reviewProblems = await getReviewProblems(userId);

  for (const rp of reviewProblems.slice(0, 3)) {
    steps.push({
      id: `review-${rp.problemId}`,
      type: "review",
      title: `Re-solve: ${rp.title}`,
      subtitle: `You solved this ${rp.daysSinceSolved} days ago. Can you do it from memory?`,
      estimatedMinutes:
        rp.difficulty === "easy" ? 5 : rp.difficulty === "medium" ? 8 : 12,
      data: {
        problemId: rp.problemId,
        problemSlug: rp.slug,
        problemTitle: rp.title,
        difficulty: rp.difficulty,
        originalSolveDate: rp.solvedAt,
        daysSinceSolved: rp.daysSinceSolved,
      } satisfies ReviewData,
    });
  }

  // ── STEP 2: Find the NEXT LESSON in curriculum ──
  const nextLesson = await getNextLesson(userId);

  if (nextLesson) {
    steps.push({
      id: `lesson-${nextLesson.id}`,
      type: "lesson",
      title: nextLesson.title,
      subtitle: `Next in ${nextLesson.courseName}`,
      estimatedMinutes: 7,
      data: {
        lessonId: nextLesson.id,
        lessonSlug: nextLesson.slug,
        lessonTitle: nextLesson.title,
        courseName: nextLesson.courseName,
        courseCategory: nextLesson.courseCategory,
      } satisfies LessonData,
    });

    // ── STEP 3: Add a VISUALIZER step based on lesson topic ──
    const visualizerType = getVisualizerForCategory(nextLesson.courseCategory);
    if (visualizerType) {
      steps.push({
        id: `visualize-${nextLesson.courseCategory}`,
        type: "visualize",
        title: `Visualize: ${getVisualizerTitle(visualizerType)}`,
        subtitle: "See the concept in action before coding",
        estimatedMinutes: 3,
        data: {
          visualizerType,
          topic: nextLesson.courseCategory,
          guided: true,
          guidedSteps: getGuidedStepsForTopic(nextLesson.courseCategory),
        } satisfies VisualizeData,
      });
    }
  }

  // ── STEP 4: Find the NEXT PROBLEM to solve ──
  const nextProblem = await getNextProblem(userId, nextLesson?.id);

  if (nextProblem) {
    steps.push({
      id: `solve-${nextProblem.id}`,
      type: "solve",
      title: `Solve: ${nextProblem.title}`,
      subtitle: nextProblem.connectedLessonTitle
        ? `Practices: ${nextProblem.connectedLessonTitle}`
        : `${nextProblem.difficulty} · ${nextProblem.category}`,
      estimatedMinutes:
        nextProblem.difficulty === "easy"
          ? 8
          : nextProblem.difficulty === "medium"
            ? 12
            : 18,
      data: {
        problemId: nextProblem.id,
        problemSlug: nextProblem.slug,
        problemTitle: nextProblem.title,
        difficulty: nextProblem.difficulty,
        category: nextProblem.category,
        connectedLessonTitle: nextProblem.connectedLessonTitle,
      } satisfies SolveData,
    });
  }

  // ── STEP 5: Flash cards review ──
  try {
    const dueCards = await prisma.flashCard.count({
      where: {
        userId,
        nextReview: { lte: new Date() },
      },
    });

    if (dueCards > 0) {
      // Gather unique topics from due cards
      const dueCardRecords = await prisma.flashCard.findMany({
        where: { userId, nextReview: { lte: new Date() } },
        select: { type: true },
        take: 20,
      });
      const topics = [...new Set(dueCardRecords.map((c) => c.type))];

      steps.push({
        id: "cards-daily",
        type: "cards",
        title: "Flash Cards",
        subtitle: `${dueCards} card${dueCards !== 1 ? "s" : ""} due for review`,
        estimatedMinutes: Math.max(2, Math.ceil(dueCards * 0.5)),
        data: {
          cardCount: dueCards,
          topics,
        } satisfies CardsData,
      });
    }
  } catch {
    // FlashCard table may not exist yet — skip silently
  }

  // ── METADATA: Stats for the plan display ──
  const totalProblems = await prisma.problem.count();
  const solvedCount = await prisma.submission.findMany({
    where: { userId, status: "accepted" },
    distinct: ["problemId"],
    select: { problemId: true },
  });
  const totalSolved = solvedCount.length;

  const streak = await calculateStreak(userId);
  const weakTopics = await getWeakTopics(userId);

  let nextMilestone = { label: "First problem", current: totalSolved, target: 1 };
  if (totalSolved >= 1 && totalSolved < 10)
    nextMilestone = { label: "10 problems", current: totalSolved, target: 10 };
  else if (totalSolved >= 10 && totalSolved < 25)
    nextMilestone = { label: "25 problems", current: totalSolved, target: 25 };
  else if (totalSolved >= 25 && totalSolved < 50)
    nextMilestone = { label: "50 problems", current: totalSolved, target: 50 };
  else if (totalSolved >= 50 && totalSolved < 100)
    nextMilestone = { label: "100 problems", current: totalSolved, target: 100 };
  else if (totalSolved >= 100)
    nextMilestone = { label: "150 problems", current: totalSolved, target: 150 };

  const totalMinutes = steps.reduce((sum, s) => sum + s.estimatedMinutes, 0);

  return {
    steps,
    totalMinutes,
    generatedAt: new Date().toISOString(),
    metadata: {
      totalSolved,
      totalProblems,
      currentStreak: streak,
      weakTopics,
      nextMilestone,
    },
  };
}

// ═══════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════

async function getReviewProblems(userId: string) {
  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

  const oneDayAgo = new Date();
  oneDayAgo.setDate(oneDayAgo.getDate() - 1);

  // Get accepted submissions older than 3 days
  const oldSolves = await prisma.submission.findMany({
    where: {
      userId,
      status: "accepted",
      createdAt: { lt: threeDaysAgo },
    },
    distinct: ["problemId"],
    orderBy: { createdAt: "asc" },
    take: 10,
    include: {
      problem: {
        select: { id: true, slug: true, title: true, difficulty: true },
      },
    },
  });

  const reviewList: {
    problemId: string;
    slug: string;
    title: string;
    difficulty: string;
    solvedAt: string;
    daysSinceSolved: number;
  }[] = [];

  for (const solve of oldSolves) {
    // Skip if user re-solved within the last day
    const recentReSolve = await prisma.submission.findFirst({
      where: {
        userId,
        problemId: solve.problemId,
        status: "accepted",
        createdAt: { gt: oneDayAgo },
      },
    });

    if (!recentReSolve) {
      const daysSinceSolved = Math.floor(
        (Date.now() - solve.createdAt.getTime()) / (1000 * 60 * 60 * 24)
      );

      reviewList.push({
        problemId: solve.problem.id,
        slug: solve.problem.slug,
        title: solve.problem.title,
        difficulty: solve.problem.difficulty,
        solvedAt: solve.createdAt.toISOString(),
        daysSinceSolved,
      });
    }
  }

  // Prioritize by spaced repetition intervals
  return reviewList.sort((a, b) => {
    const aPriority = getReviewPriority(a.daysSinceSolved);
    const bPriority = getReviewPriority(b.daysSinceSolved);
    return bPriority - aPriority;
  });
}

function getReviewPriority(daysSince: number): number {
  if (daysSince >= 3 && daysSince <= 4) return 10;
  if (daysSince >= 7 && daysSince <= 8) return 9;
  if (daysSince >= 14 && daysSince <= 16) return 8;
  if (daysSince >= 28 && daysSince <= 32) return 7;
  if (daysSince > 32) return 6;
  return 3;
}

async function getNextLesson(userId: string) {
  const allLessons = await prisma.lesson.findMany({
    orderBy: [{ course: { order: "asc" } }, { order: "asc" }],
    include: {
      course: {
        select: { title: true, slug: true, category: true, order: true },
      },
      progress: {
        where: { userId },
        take: 1,
        select: { completed: true, masteryLevel: true },
      },
    },
  });

  for (const lesson of allLessons) {
    const completed = lesson.progress[0]?.completed || false;
    if (!completed) {
      return {
        id: lesson.id,
        slug: lesson.slug,
        title: lesson.title,
        courseName: lesson.course.title,
        courseSlug: lesson.course.slug,
        courseCategory: lesson.course.category,
      };
    }
  }

  return null;
}

async function getNextProblem(
  userId: string,
  currentLessonId?: string
) {
  // Priority 1: Unsolved problem connected to a completed lesson
  const lessonProblems = await prisma.lessonProblem.findMany({
    where: {
      lesson: {
        progress: {
          some: { userId, completed: true },
        },
      },
      problem: {
        submissions: {
          none: { userId, status: "accepted" },
        },
      },
    },
    orderBy: [
      { lesson: { course: { order: "asc" } } },
      { lesson: { order: "asc" } },
      { order: "asc" },
    ],
    take: 1,
    include: {
      problem: {
        select: {
          id: true,
          slug: true,
          title: true,
          difficulty: true,
          category: true,
        },
      },
      lesson: { select: { title: true } },
    },
  });

  if (lessonProblems.length > 0) {
    const lp = lessonProblems[0];
    return {
      id: lp.problem.id,
      slug: lp.problem.slug,
      title: lp.problem.title,
      difficulty: lp.problem.difficulty,
      category: lp.problem.category || "DSA",
      connectedLessonTitle: lp.lesson.title,
    };
  }

  // Priority 2: Next unsolved problem by topicOrder
  const nextByOrder = await prisma.problem.findFirst({
    where: {
      submissions: {
        none: { userId, status: "accepted" },
      },
    },
    orderBy: { topicOrder: "asc" },
    select: {
      id: true,
      slug: true,
      title: true,
      difficulty: true,
      category: true,
    },
  });

  if (nextByOrder) {
    return {
      id: nextByOrder.id,
      slug: nextByOrder.slug,
      title: nextByOrder.title,
      difficulty: nextByOrder.difficulty,
      category: nextByOrder.category || "DSA",
      connectedLessonTitle: undefined,
    };
  }

  return null;
}

async function calculateStreak(userId: string): Promise<number> {
  const submissions = await prisma.submission.findMany({
    where: { userId, status: "accepted" },
    select: { createdAt: true },
    orderBy: { createdAt: "desc" },
  });

  if (submissions.length === 0) return 0;

  const dates = [
    ...new Set(
      submissions.map((s) => {
        const d = new Date(s.createdAt);
        d.setHours(0, 0, 0, 0);
        return d.getTime();
      })
    ),
  ].sort((a, b) => b - a); // newest first

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayMs = today.getTime();

  const mostRecent = dates[0];
  const daysSinceLastSubmission = Math.floor(
    (todayMs - mostRecent) / (1000 * 60 * 60 * 24)
  );

  if (daysSinceLastSubmission > 1) return 0;

  let streak = 0;
  for (let i = 0; i < dates.length; i++) {
    const expectedDate = todayMs - i * 24 * 60 * 60 * 1000;
    const actualDate = dates[i];
    const diffDays = Math.floor(
      (expectedDate - actualDate) / (1000 * 60 * 60 * 24)
    );
    if (diffDays <= 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

async function getWeakTopics(userId: string) {
  const allProblems = await prisma.problem.findMany({
    select: { id: true, category: true },
  });

  const solvedIds = new Set(
    (
      await prisma.submission.findMany({
        where: { userId, status: "accepted" },
        distinct: ["problemId"],
        select: { problemId: true },
      })
    ).map((s) => s.problemId)
  );

  const topicStats: Record<string, { total: number; solved: number }> = {};
  for (const p of allProblems) {
    const cat = p.category || "DSA";
    if (!topicStats[cat]) topicStats[cat] = { total: 0, solved: 0 };
    topicStats[cat].total++;
    if (solvedIds.has(p.id)) topicStats[cat].solved++;
  }

  return Object.entries(topicStats)
    .map(([topic, stats]) => ({
      topic,
      percentage:
        stats.total > 0
          ? Math.round((stats.solved / stats.total) * 100)
          : 0,
    }))
    .filter((t) => t.percentage < 60)
    .sort((a, b) => a.percentage - b.percentage)
    .slice(0, 4);
}

function getVisualizerForCategory(category: string): string | null {
  const map: Record<string, string | null> = {
    fundamentals: null,
    "data-structures": "array",
    algorithms: "array",
    patterns: null,
    arrays: "array",
    "linked-lists": "linked-list",
    stacks: "stack-queue",
    trees: "tree",
    graphs: null,
    "hash-maps": null,
    "binary-search": "array",
  };
  return map[category] ?? null;
}

function getVisualizerTitle(type: string): string {
  const titles: Record<string, string> = {
    tree: "Binary Search Tree",
    array: "Array Operations",
    "linked-list": "Linked List",
    "stack-queue": "Stack & Queue",
  };
  return titles[type] || type;
}

function getGuidedStepsForTopic(
  category: string
): { instruction: string; values?: number[] }[] {
  const guides: Record<string, { instruction: string; values?: number[] }[]> = {
    trees: [
      {
        instruction: "Insert these values to build a BST",
        values: [50, 25, 75, 10, 30, 60, 90],
      },
    ],
    stacks: [
      {
        instruction: "Push these values onto the stack",
        values: [10, 20, 30, 40],
      },
    ],
    "linked-lists": [
      { instruction: "Insert these nodes", values: [5, 10, 15, 20, 25] },
    ],
    "data-structures": [
      {
        instruction: "Observe how elements are inserted and removed",
        values: [2, 5, 8, 12, 16, 23, 38],
      },
    ],
    arrays: [
      {
        instruction:
          "Observe how binary search works on this sorted array",
        values: [2, 5, 8, 12, 16, 23, 38, 56, 72, 91],
      },
    ],
  };
  return guides[category] || [];
}
