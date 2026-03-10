/**
 * SM-2 Spaced Repetition Algorithm
 * Used for flashcard scheduling.
 */
export function calculateSM2(
  quality: number, // 0-5 rating
  repetitions: number,
  ease: number,
  interval: number
): { repetitions: number; ease: number; interval: number; nextReview: Date } {
  let newEase = ease;
  let newInterval = interval;
  let newReps = repetitions;

  if (quality >= 3) {
    // Correct response
    if (newReps === 0) {
      newInterval = 1;
    } else if (newReps === 1) {
      newInterval = 6;
    } else {
      newInterval = Math.round(interval * ease);
    }
    newReps++;
    newEase = ease + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  } else {
    // Incorrect
    newReps = 0;
    newInterval = 1;
  }

  // Ease factor minimum
  if (newEase < 1.3) newEase = 1.3;

  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + newInterval);

  return {
    repetitions: newReps,
    ease: newEase,
    interval: newInterval,
    nextReview,
  };
}

/**
 * Quality mapping for our UI labels.
 */
export function qualityToSM2(
  quality: "again" | "hard" | "good" | "easy"
): number {
  switch (quality) {
    case "again":
      return 1;
    case "hard":
      return 3;
    case "good":
      return 4;
    case "easy":
      return 5;
  }
}
