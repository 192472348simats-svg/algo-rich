/**
 * Streak freeze mechanic.
 * A "freeze" lets a user miss one day without losing their streak.
 * Freezes are granted (e.g., upon reaching milestones) and consumed
 * automatically when the user logs in after a missed day.
 */

/** Max freezes a user can stockpile at once */
export const MAX_STREAK_FREEZES = 3;

/**
 * Returns true if the missed day should be covered by a freeze.
 * The caller must then decrement `streakFreezes` in the DB.
 */
export function shouldApplyFreeze(
  daysMissed: number,
  availableFreezes: number
): boolean {
  return daysMissed === 1 && availableFreezes > 0;
}
