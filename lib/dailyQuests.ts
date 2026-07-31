export const DAILY_QUESTS = [
  { type: "SOLVE_EASY_2", title: "Solve 2 Easy problems", target: 2, xpReward: 50 },
  { type: "COMPLETE_STAGE", title: "Complete a session stage", target: 1, xpReward: 75 },
  { type: "REVIEW_3", title: "Review 3 due problems", target: 3, xpReward: 100 },
  { type: "MAINTAIN_STREAK", title: "Maintain your streak", target: 1, xpReward: 25 },
  { type: "TRY_MEDIUM", title: "Try a Medium problem", target: 1, xpReward: 80 },
  { type: "ASK_ZYRA", title: "Ask Zyra for a hint", target: 1, xpReward: 15 },
] as const;

export type DailyQuestType = (typeof DAILY_QUESTS)[number]["type"];

/** Date-only value for the user's requested IST quest boundary. */
export function getQuestDate(): Date {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return new Date(Date.UTC(Number(values.year), Number(values.month) - 1, Number(values.day)));
}

export function questDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function selectDailyQuestTypes(date: Date) {
  let seed = questDateKey(date).split("").reduce((value, char) => ((value * 31) + char.charCodeAt(0)) >>> 0, 7);
  const pool = [...DAILY_QUESTS];
  const selected = [];
  while (selected.length < 3 && pool.length > 0) {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    selected.push(pool.splice(seed % pool.length, 1)[0]);
  }
  return selected;
}
