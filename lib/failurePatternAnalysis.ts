export interface FailurePattern {
  pattern: string;
  label: string;
  count: number;
  suggestion: string;
}

export const FAILURE_IMPROVEMENT_MAP: Record<string, { label: string; suggestion: string }> = {
  "wrong_answer": {
    label: "Wrong Answer",
    suggestion: "Walk through your logic with a simple example on paper before coding. Check edge cases: empty input, single element, duplicates.",
  },
  "runtime_error": {
    label: "Runtime Error",
    suggestion: "Check for index-out-of-bounds, division by zero, or accessing .next on None. Add bounds checks before array/list access.",
  },
  "time_limit_exceeded": {
    label: "Time Limit Exceeded",
    suggestion: "Your solution may be O(n²) or worse. Consider if sorting first (O(n log n)) or using a hash map (O(n)) can speed things up.",
  },
  "error": {
    label: "Syntax/Logic Error",
    suggestion: "Read error messages carefully — they tell you exactly which line failed. Print intermediate values to debug step by step.",
  },
};

export function getImprovementSuggestion(status: string): string {
  return FAILURE_IMPROVEMENT_MAP[status]?.suggestion
    ?? "Review the problem constraints and think about which data structure best fits the problem.";
}

export interface FailureSummary {
  totalAttempts: number;
  failedAttempts: number;
  passRate: number;
  topFailures: FailurePattern[];
  mostFailedDifficulty: string | null;
  improvementTip: string;
}

export function buildFailureSummary(
  submissions: Array<{ status: string; problem?: { difficulty?: string } }>
): FailureSummary {
  const total = submissions.length;
  const failed = submissions.filter((s) => s.status !== "accepted");
  const passRate = total > 0 ? Math.round(((total - failed.length) / total) * 100) : 0;

  // Count by status
  const statusCounts: Record<string, number> = {};
  for (const s of failed) {
    statusCounts[s.status] = (statusCounts[s.status] ?? 0) + 1;
  }

  const topFailures: FailurePattern[] = Object.entries(statusCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([status, count]) => ({
      pattern: status,
      label: FAILURE_IMPROVEMENT_MAP[status]?.label ?? status,
      count,
      suggestion: getImprovementSuggestion(status),
    }));

  // Most failed difficulty
  const diffCounts: Record<string, number> = {};
  for (const s of failed) {
    const diff = s.problem?.difficulty ?? "Unknown";
    diffCounts[diff] = (diffCounts[diff] ?? 0) + 1;
  }
  const mostFailedDifficulty = Object.entries(diffCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

  const improvementTip = topFailures[0]?.suggestion
    ?? "Great job! Keep practicing to maintain your success rate.";

  return {
    totalAttempts: total,
    failedAttempts: failed.length,
    passRate,
    topFailures,
    mostFailedDifficulty,
    improvementTip,
  };
}
