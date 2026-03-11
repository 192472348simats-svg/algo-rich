// Progressive hint system utilities

/** XP deducted per hint level (level 1 = free) */
export function getHintXPCost(level: number): number {
  const costs: Record<number, number> = { 1: 0, 2: 2, 3: 5, 4: 10, 5: 15 };
  return costs[level] ?? 15;
}

/** Parse the JSON hints array from the DB column */
export function parseHints(hintsJson: string | null | undefined): string[] {
  if (!hintsJson) return [];
  try {
    const parsed = JSON.parse(hintsJson);
    if (Array.isArray(parsed)) return parsed.map(String);
    return [];
  } catch {
    return [];
  }
}

/** Return a single hint by 1-based level (null if unavailable) */
export function getHint(
  hintsJson: string | null | undefined,
  level: number
): string | null {
  const hints = parseHints(hintsJson);
  return hints[level - 1] ?? null;
}
