/** Streak utility functions shared by API routes and server components */

/** Returns true if the given ISO date string represents today's date (UTC) */
export function isToday(isoDate: string): boolean {
  const today = new Date().toISOString().slice(0, 10);
  return isoDate === today;
}

/** How many hours remain until midnight (local) — used for urgency banner */
export function hoursUntilMidnight(): number {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  return Math.ceil((midnight.getTime() - now.getTime()) / (1000 * 60 * 60));
}

/**
 * Compute currentStreak and practicedToday from activity date strings.
 * activityDates must be an array of "YYYY-MM-DD" strings (UTC dates).
 */
export function computeStreak(activityDates: string[]): {
  currentStreak: number;
  practicedToday: boolean;
} {
  const dateSet = new Set(activityDates);
  const today = new Date().toISOString().slice(0, 10);
  const practicedToday = dateSet.has(today);

  const sorted = Array.from(dateSet).sort().reverse();
  let currentStreak = 0;
  for (let i = 0; i < sorted.length; i++) {
    const expected = new Date(Date.UTC(
      ...today.split("-").map(Number) as [number, number, number]
    ));
    expected.setUTCDate(expected.getUTCDate() - i);
    const expectedStr = expected.toISOString().slice(0, 10);
    if (sorted[i] === expectedStr) {
      currentStreak++;
    } else {
      break;
    }
  }

  return { currentStreak, practicedToday };
}
