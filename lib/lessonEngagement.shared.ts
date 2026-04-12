export const MIN_LESSON_SECONDS = 30;
export const MIN_SCROLL_PERCENT = 80;

export function clampScrollPercent(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}
