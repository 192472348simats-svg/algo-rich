export interface AhaMoment {
  pattern: string
  problemsSolved: number
  message: string
}

export function buildAhaMessage(pattern: string, count: number): AhaMoment {
  return {
    pattern,
    problemsSolved: count,
    message: `You've now solved ${count} ${pattern} problems. Your brain is starting to recognize this pattern automatically. This is what engineers mean by "thinking in patterns".`,
  }
}

/** Returns an aha moment if the user has just hit a milestone for a pattern */
export function checkAhaMoment(patternSlug: string, problemsSolved: number): AhaMoment | null {
  const milestones = [3, 5, 10]
  if (!milestones.includes(problemsSolved)) return null
  return buildAhaMessage(patternSlug, problemsSolved)
}
