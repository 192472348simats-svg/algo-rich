export interface TimelineEvent {
  patternSlug: string;
  patternTitle: string;
  problemsSolved: number;
  status: string;
  recognitionAccuracy: number;
  unlockedAt: Date;
}

const PATTERN_DISPLAY_NAMES: Record<string, string> = {
  "two-pointers": "Two Pointers",
  "sliding-window": "Sliding Window",
  "binary-search": "Binary Search",
  "fast-slow-pointers": "Fast & Slow Pointers",
  "merge-intervals": "Merge Intervals",
  "cyclic-sort": "Cyclic Sort",
  "in-place-reversal": "In-Place Reversal",
  "tree-bfs": "Tree BFS",
  "tree-dfs": "Tree DFS",
  "two-heaps": "Two Heaps",
  "subsets": "Subsets",
  "modified-binary-search": "Modified Binary Search",
  "bitwise-xor": "Bitwise XOR",
  "top-k-elements": "Top K Elements",
  "k-way-merge": "K-way Merge",
  "dynamic-programming": "Dynamic Programming",
  "topological-sort": "Topological Sort",
  "backtracking": "Backtracking",
  "greedy": "Greedy",
  "graphs": "Graphs",
};

export function buildTimeline(
  patterns: Array<{
    patternSlug: string;
    problemsSolved: number;
    status: string;
    recognitionAccuracy: number;
    updatedAt: Date;
  }>
): TimelineEvent[] {
  return patterns
    .filter((p) => p.problemsSolved > 0)
    .sort((a, b) => a.updatedAt.getTime() - b.updatedAt.getTime())
    .map((p) => ({
      patternSlug: p.patternSlug,
      patternTitle: PATTERN_DISPLAY_NAMES[p.patternSlug] ?? p.patternSlug,
      problemsSolved: p.problemsSolved,
      status: p.status,
      recognitionAccuracy: p.recognitionAccuracy,
      unlockedAt: p.updatedAt,
    }));
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "mastered": return "#10b981";
    case "proficient": return "#E5A829";
    case "learning": return "#60a5fa";
    default: return "#6b7280";
  }
}
