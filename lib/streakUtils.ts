/** Streak utility functions shared by API routes and server components */

/**
 * Get today's date string (YYYY-MM-DD) in the given timezone.
 * Falls back to UTC if the timezone is invalid or not provided.
 */
function todayInZone(timeZone?: string): string {
  if (!timeZone || timeZone === "UTC") {
    return new Date().toISOString().slice(0, 10);
  }
  try {
    // Intl gives us the date parts in the target timezone
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(new Date());

    const y = parts.find((p) => p.type === "year")!.value;
    const m = parts.find((p) => p.type === "month")!.value;
    const d = parts.find((p) => p.type === "day")!.value;
    return `${y}-${m}-${d}`;
  } catch {
    // Invalid timezone — fall back to UTC
    return new Date().toISOString().slice(0, 10);
  }
}

/**
 * Subtract one calendar day from a "YYYY-MM-DD" string.
 * Uses UTC arithmetic to avoid DST surprises.
 */
function prevDay(dateStr: string): string {
  const d = new Date(`${dateStr}T00:00:00.000Z`);
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}

/**
 * Returns true if the given "YYYY-MM-DD" string represents today's date.
 * @param isoDate  Date string in "YYYY-MM-DD" format
 * @param timeZone Optional IANA timezone (e.g. "America/New_York"). Defaults to UTC.
 */
export function isToday(isoDate: string, timeZone?: string): boolean {
  return isoDate === todayInZone(timeZone);
}

/**
 * How many hours remain until midnight — used for urgency banner.
 * @param timeZone Optional IANA timezone. Defaults to UTC.
 */
export function hoursUntilMidnight(timeZone?: string): number {
  const now = new Date();

  if (!timeZone || timeZone === "UTC") {
    const midnight = new Date(now);
    midnight.setUTCHours(24, 0, 0, 0);
    return Math.ceil((midnight.getTime() - now.getTime()) / (1000 * 60 * 60));
  }

  try {
    // Calculate current hour in target timezone to derive hours until midnight
    const hourStr = new Intl.DateTimeFormat("en-US", {
      timeZone,
      hour: "numeric",
      hour12: false,
      minute: "numeric",
    }).format(now);

    const [h, m] = hourStr.split(":").map(Number);
    const hoursLeft = 24 - h - (m > 0 ? m / 60 : 0);
    return Math.ceil(hoursLeft);
  } catch {
    // Invalid timezone — fall back to UTC
    const midnight = new Date(now);
    midnight.setUTCHours(24, 0, 0, 0);
    return Math.ceil((midnight.getTime() - now.getTime()) / (1000 * 60 * 60));
  }
}

/**
 * Compute currentStreak and practicedToday from activity date strings.
 * activityDates must be an array of "YYYY-MM-DD" strings. A streak
 * remains visible on the following day until that day is missed.
 *
 * @param activityDates Array of "YYYY-MM-DD" strings
 * @param timeZone      Optional IANA timezone (e.g. "Asia/Kolkata"). Defaults to UTC.
 */
export function computeStreak(
  activityDates: string[],
  timeZone?: string
): {
  currentStreak: number;
  practicedToday: boolean;
} {
  const dateSet = new Set(activityDates);
  const today = todayInZone(timeZone);
  const practicedToday = dateSet.has(today);

  let currentStreak = 0;
  let cursor = practicedToday ? today : prevDay(today);

  while (dateSet.has(cursor)) {
    currentStreak++;
    cursor = prevDay(cursor);
  }

  return { currentStreak, practicedToday };
}
