/* ──────────────────────────────────────────────
   XP Reward Table & Level System
   ────────────────────────────────────────────── */

export const XP_REWARDS = {
  CARD_CORRECT: 10,
  CARD_CORRECT_FIRST_TRY: 15,
  CARD_STREAK_3: 5,
  CARD_STREAK_5: 15,
  CARD_STREAK_10: 30,
  PROBLEM_EASY: 25,
  PROBLEM_MEDIUM: 50,
  PROBLEM_HARD: 100,
  LESSON_COMPLETE: 30,
  DAILY_CARDS_COMPLETE: 50,
  VISUALIZER_FIRST_USE: 10,
  STREAK_DAY: 20,
} as const;

export interface Level {
  level: number;
  title: string;
  xpRequired: number;
  icon: string;
}

export const LEVELS: Level[] = [
  { level: 1, title: "Seedling", xpRequired: 0, icon: "🌱" },
  { level: 2, title: "Sprout", xpRequired: 100, icon: "🌿" },
  { level: 3, title: "Sapling", xpRequired: 300, icon: "🌲" },
  { level: 4, title: "Bloom", xpRequired: 600, icon: "🌸" },
  { level: 5, title: "Forest", xpRequired: 1000, icon: "🏕️" },
  { level: 6, title: "Mountain", xpRequired: 1500, icon: "⛰️" },
  { level: 7, title: "Summit", xpRequired: 2200, icon: "🏔️" },
  { level: 8, title: "Cloud", xpRequired: 3000, icon: "☁️" },
  { level: 9, title: "Star", xpRequired: 4000, icon: "⭐" },
  { level: 10, title: "Supernova", xpRequired: 5500, icon: "💫" },
  { level: 11, title: "Galaxy", xpRequired: 7500, icon: "🌌" },
  { level: 12, title: "Universe", xpRequired: 10000, icon: "🔮" },
];

/**
 * Get the user's current level info based on total XP.
 */
export function getLevelForXP(totalXP: number): {
  current: Level;
  next: Level | null;
  progress: number; // 0-1 progress toward next level
  xpIntoLevel: number;
  xpNeeded: number;
} {
  let current = LEVELS[0];
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (totalXP >= LEVELS[i].xpRequired) {
      current = LEVELS[i];
      break;
    }
  }

  const nextIdx = LEVELS.findIndex((l) => l.level === current.level + 1);
  const next = nextIdx >= 0 ? LEVELS[nextIdx] : null;

  const xpIntoLevel = totalXP - current.xpRequired;
  const xpNeeded = next ? next.xpRequired - current.xpRequired : 0;
  const progress = xpNeeded > 0 ? Math.min(xpIntoLevel / xpNeeded, 1) : 1;

  return { current, next, progress, xpIntoLevel, xpNeeded };
}

/**
 * Calculate streak bonus XP for consecutive correct answers.
 */
export function getStreakBonus(streak: number): number {
  if (streak >= 10) return XP_REWARDS.CARD_STREAK_10;
  if (streak >= 5) return XP_REWARDS.CARD_STREAK_5;
  if (streak >= 3) return XP_REWARDS.CARD_STREAK_3;
  return 0;
}
