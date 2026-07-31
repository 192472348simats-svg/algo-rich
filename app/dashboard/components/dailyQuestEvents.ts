export type DailyQuestKind = "easy" | "session" | "review" | "streak" | "medium" | "zyra";

export const DAILY_QUEST_PROGRESS_EVENT = "algo-rich:quest-progress";

/** Notify the dashboard quest widget about a completed client-side action. */
export function recordDailyQuestProgress(kind: DailyQuestKind, amount = 1) {
  if (typeof window === "undefined" || amount <= 0) return;

  window.dispatchEvent(
    new CustomEvent(DAILY_QUEST_PROGRESS_EVENT, {
      detail: { kind, amount },
    }),
  );
}
