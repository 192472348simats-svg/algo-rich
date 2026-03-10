/**
 * Neo — Contextual placement-focused tips by dashboard path.
 * Minimal, no fluff. One-liners that actually help.
 */

export interface NeoTip {
  text: string;
  /** Optional link to relevant page */
  link?: string;
}

const tipsByPath: Record<string, NeoTip[]> = {
  "/dashboard": [
    { text: "Consistency > intensity. Even 30 min/day compounds fast." },
    { text: "Review yesterday's problem before starting a new one." },
    { text: "Stuck? Explain the problem out loud — rubber duck debugging works." },
    { text: "Track your weak patterns. Interviewers notice gaps." },
    { text: "Top candidates solve 2-3 mediums daily for 6 weeks." },
    { text: "Don't just solve — understand WHY the pattern fits." },
  ],
  "/dashboard/courses": [
    { text: "Master fundamentals first — shortcuts backfire in interviews." },
    { text: "Read the code examples, then close them and re-write from memory." },
    { text: "Understanding > memorization. Can you explain it to someone else?" },
    { text: "One lesson fully absorbed beats three skimmed." },
  ],
  "/dashboard/practice": [
    { text: "Always think out loud. Interviewers evaluate your process." },
    { text: "Time yourself — 25 min for medium, 40 min for hard." },
    { text: "After solving, ask: can I do this in less space? Less time?" },
    { text: "Write test cases before coding. It impresses interviewers." },
    { text: "If brute force works, say it — then optimize." },
  ],
  "/dashboard/patterns": [
    { text: "Patterns are your cheat codes. Learn to spot them instantly." },
    { text: "Two Pointers and Sliding Window cover ~30% of array questions." },
    { text: "When you see 'subarray' or 'substring' — think Sliding Window." },
    { text: "Sorted input? Binary Search or Two Pointers. Always." },
  ],
  "/dashboard/cards": [
    { text: "Spaced repetition is the fastest path to long-term recall." },
    { text: "Review cards for 10 min before your practice session." },
    { text: "If a card feels easy, that means the spacing is working." },
  ],
  "/dashboard/progress": [
    { text: "Track patterns solved, not just problem count." },
    { text: "Aim for 80%+ accuracy before moving to the next pattern." },
    { text: "Your weakest pattern is your biggest interview risk." },
  ],
  "/dashboard/achievements": [
    { text: "Badges are milestones, not the goal. Keep pushing." },
    { text: "Real achievement: explaining a solution without looking at code." },
  ],
  "/dashboard/visualize": [
    { text: "Visualizing data structures builds intuition you can't get from text." },
    { text: "Try predicting the next step before clicking." },
  ],
  "/dashboard/settings": [
    { text: "Adjust your daily goal to stay consistent, not burned out." },
  ],
};

/** Get a random tip for the current path. Falls back to dashboard tips. */
export function getNeoTip(pathname: string): NeoTip {
  // Try exact match first, then prefix match
  const tips =
    tipsByPath[pathname] ||
    Object.entries(tipsByPath).find(([key]) =>
      pathname.startsWith(key) && key !== "/dashboard"
    )?.[1] ||
    tipsByPath["/dashboard"];

  return tips[Math.floor(Math.random() * tips.length)];
}
