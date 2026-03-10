// ─── Achievement Definitions ──────────────────────────────
// Evaluated client-side against user stats.
// Each achievement defines a condition and progress tracker.

export interface UserStats {
  totalSolved: number;
  lessonsCompleted: number;
  cardsReviewed: number;
  streak: number;
  mediumSolved: number;
  hardSolved: number;
  topicsCovered: number;
  reviewsCompleted: number;
  fastestEasy: number | null; // seconds
  patternsLearned: number;
  coursesCompleted: number;
}

export interface Achievement {
  id: string;
  emoji: string;
  title: string;
  description: string;
  condition: (s: UserStats) => boolean;
  progress: (s: UserStats) => { current: number; target: number };
}

export const achievements: Achievement[] = [
  // ─── Beginner ────────────────────────────────────────────
  {
    id: "first-blood",
    emoji: "🩸",
    title: "First Blood",
    description: "Solve your first problem",
    condition: (s) => s.totalSolved >= 1,
    progress: (s) => ({ current: Math.min(s.totalSolved, 1), target: 1 }),
  },
  {
    id: "first-lesson",
    emoji: "📖",
    title: "Student",
    description: "Complete your first lesson",
    condition: (s) => s.lessonsCompleted >= 1,
    progress: (s) => ({
      current: Math.min(s.lessonsCompleted, 1),
      target: 1,
    }),
  },
  {
    id: "first-card",
    emoji: "🃏",
    title: "Card Collector",
    description: "Review 10 daily cards",
    condition: (s) => s.cardsReviewed >= 10,
    progress: (s) => ({
      current: Math.min(s.cardsReviewed, 10),
      target: 10,
    }),
  },

  // ─── Streak ──────────────────────────────────────────────
  {
    id: "streak-3",
    emoji: "🔥",
    title: "On Fire",
    description: "3-day streak",
    condition: (s) => s.streak >= 3,
    progress: (s) => ({ current: Math.min(s.streak, 3), target: 3 }),
  },
  {
    id: "streak-7",
    emoji: "🔥",
    title: "Week Warrior",
    description: "7-day streak",
    condition: (s) => s.streak >= 7,
    progress: (s) => ({ current: Math.min(s.streak, 7), target: 7 }),
  },
  {
    id: "streak-30",
    emoji: "💎",
    title: "Diamond Habit",
    description: "30-day streak",
    condition: (s) => s.streak >= 30,
    progress: (s) => ({ current: Math.min(s.streak, 30), target: 30 }),
  },

  // ─── Problem Milestones ──────────────────────────────────
  {
    id: "solve-10",
    emoji: "⭐",
    title: "Getting Started",
    description: "Solve 10 problems",
    condition: (s) => s.totalSolved >= 10,
    progress: (s) => ({ current: Math.min(s.totalSolved, 10), target: 10 }),
  },
  {
    id: "solve-25",
    emoji: "🌟",
    title: "Quarter Century",
    description: "Solve 25 problems",
    condition: (s) => s.totalSolved >= 25,
    progress: (s) => ({ current: Math.min(s.totalSolved, 25), target: 25 }),
  },
  {
    id: "solve-50",
    emoji: "💫",
    title: "Half Century",
    description: "Solve 50 problems",
    condition: (s) => s.totalSolved >= 50,
    progress: (s) => ({ current: Math.min(s.totalSolved, 50), target: 50 }),
  },
  {
    id: "solve-100",
    emoji: "🏅",
    title: "Centurion",
    description: "Solve 100 problems",
    condition: (s) => s.totalSolved >= 100,
    progress: (s) => ({
      current: Math.min(s.totalSolved, 100),
      target: 100,
    }),
  },
  {
    id: "solve-150",
    emoji: "🏆",
    title: "Champion",
    description: "Solve 150 problems",
    condition: (s) => s.totalSolved >= 150,
    progress: (s) => ({
      current: Math.min(s.totalSolved, 150),
      target: 150,
    }),
  },

  // ─── Difficulty ──────────────────────────────────────────
  {
    id: "first-medium",
    emoji: "🟡",
    title: "Stepping Up",
    description: "Solve your first medium",
    condition: (s) => s.mediumSolved >= 1,
    progress: (s) => ({
      current: Math.min(s.mediumSolved, 1),
      target: 1,
    }),
  },
  {
    id: "first-hard",
    emoji: "🔴",
    title: "Beast Mode",
    description: "Solve your first hard",
    condition: (s) => s.hardSolved >= 1,
    progress: (s) => ({ current: Math.min(s.hardSolved, 1), target: 1 }),
  },
  {
    id: "medium-20",
    emoji: "💪",
    title: "Interview Ready",
    description: "Solve 20 mediums",
    condition: (s) => s.mediumSolved >= 20,
    progress: (s) => ({
      current: Math.min(s.mediumSolved, 20),
      target: 20,
    }),
  },

  // ─── Topics ──────────────────────────────────────────────
  {
    id: "topic-5",
    emoji: "🗺️",
    title: "Explorer",
    description: "Practice 5 different topics",
    condition: (s) => s.topicsCovered >= 5,
    progress: (s) => ({
      current: Math.min(s.topicsCovered, 5),
      target: 5,
    }),
  },
  {
    id: "topic-all",
    emoji: "🌍",
    title: "World Traveler",
    description: "Practice all 12 topics",
    condition: (s) => s.topicsCovered >= 12,
    progress: (s) => ({
      current: Math.min(s.topicsCovered, 12),
      target: 12,
    }),
  },

  // ─── Review ──────────────────────────────────────────────
  {
    id: "review-10",
    emoji: "🧠",
    title: "Memory Builder",
    description: "Complete 10 review sessions",
    condition: (s) => s.reviewsCompleted >= 10,
    progress: (s) => ({
      current: Math.min(s.reviewsCompleted, 10),
      target: 10,
    }),
  },

  // ─── Speed ───────────────────────────────────────────────
  {
    id: "speed-easy",
    emoji: "⚡",
    title: "Lightning",
    description: "Solve an easy in under 3 minutes",
    condition: (s) => s.fastestEasy !== null && s.fastestEasy < 180,
    progress: (s) => ({
      current: s.fastestEasy
        ? Math.max(0, Math.min(180, 180 - s.fastestEasy))
        : 0,
      target: 180,
    }),
  },

  // ─── Patterns ────────────────────────────────────────────
  {
    id: "pattern-5",
    emoji: "🎯",
    title: "Pattern Spotter",
    description: "Master 5 patterns",
    condition: (s) => s.patternsLearned >= 5,
    progress: (s) => ({
      current: Math.min(s.patternsLearned, 5),
      target: 5,
    }),
  },

  // ─── Courses ─────────────────────────────────────────────
  {
    id: "course-complete",
    emoji: "🎓",
    title: "Graduate",
    description: "Complete a full course",
    condition: (s) => s.coursesCompleted >= 1,
    progress: (s) => ({
      current: Math.min(s.coursesCompleted, 1),
      target: 1,
    }),
  },
];

/**
 * Evaluate achievements and return display-ready objects
 */
export function evaluateAchievements(stats: UserStats) {
  return achievements.map((a) => {
    const unlocked = a.condition(stats);
    const { current, target } = a.progress(stats);
    return {
      id: a.id,
      emoji: a.emoji,
      title: a.title,
      description: a.description,
      unlocked,
      progress: current,
      target,
    };
  });
}
