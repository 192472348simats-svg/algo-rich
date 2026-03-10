/**
 * Review Engine — SM-2 Spaced Repetition for Problems
 *
 * Implements the SuperMemo SM-2 algorithm to schedule re-solve reviews.
 * When a user solves a problem, it's enrolled for future review.
 * The user rates their recall after each review and the engine adjusts
 * the interval accordingly.
 */

import prisma from "@/lib/prisma";

// ── Types ────────────────────────────────────────────────

export interface ReviewSchedule {
  easeFactor: number;
  interval: number; // days
  repetitions: number;
  nextReviewAt: Date;
}

export interface ReviewStats {
  totalEnrolled: number;
  dueNow: number;
  dueToday: number;
  averageEase: number;
  masteredCount: number; // interval >= 21 days
}

// ── SM-2 Core Algorithm ──────────────────────────────────

/**
 * Convert a self-rating (1-4 scale from UI) to SM-2 quality (0-5).
 *  1 = "Forgot" → quality 1
 *  2 = "Hard"   → quality 2
 *  3 = "Good"   → quality 4
 *  4 = "Easy"   → quality 5
 */
export function ratingToQuality(rating: number): number {
  const map: Record<number, number> = { 1: 1, 2: 2, 3: 4, 4: 5 };
  return map[rating] ?? 3;
}

/**
 * Calculate the next review schedule using the SM-2 algorithm.
 *
 * @param quality   0-5 quality of response
 * @param prevEase  Previous ease factor (≥ 1.3)
 * @param prevInterval  Previous interval in days
 * @param prevReps  Previous repetition count
 */
export function calculateNextReview(
  quality: number,
  prevEase: number,
  prevInterval: number,
  prevReps: number
): ReviewSchedule {
  let easeFactor = prevEase;
  let interval: number;
  let repetitions: number;

  if (quality < 3) {
    // Failed — reset to beginning but keep ease factor (with penalty)
    repetitions = 0;
    interval = 1;
    easeFactor = Math.max(1.3, easeFactor - 0.2);
  } else {
    // Passed — advance schedule
    repetitions = prevReps + 1;

    if (repetitions === 1) {
      interval = 1;
    } else if (repetitions === 2) {
      interval = 3;
    } else {
      interval = Math.round(prevInterval * easeFactor);
    }

    // Update ease factor using SM-2 formula
    easeFactor =
      easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    easeFactor = Math.max(1.3, easeFactor);
  }

  // Safety clamp: interval must be at least 1 day
  interval = Math.max(interval, 1);

  // Calculate next review date
  const nextReviewAt = new Date();
  nextReviewAt.setDate(nextReviewAt.getDate() + interval);
  nextReviewAt.setHours(0, 0, 0, 0); // normalize to start of day

  return { easeFactor, interval, repetitions, nextReviewAt };
}

// ── Database Operations ──────────────────────────────────

/**
 * Enroll a problem for spaced repetition review.
 * Called automatically when a problem is solved for the first time.
 * If already enrolled, this is a no-op.
 */
export async function enrollProblemForReview(
  userId: string,
  problemId: string
): Promise<void> {
  const existing = await prisma.problemReview.findUnique({
    where: { userId_problemId: { userId, problemId } },
  });

  if (existing) return; // already enrolled

  // First review in 1 day
  const nextReviewAt = new Date();
  nextReviewAt.setDate(nextReviewAt.getDate() + 1);
  nextReviewAt.setHours(0, 0, 0, 0);

  await prisma.problemReview.create({
    data: {
      userId,
      problemId,
      easeFactor: 2.5,
      interval: 1,
      repetitions: 0,
      nextReviewAt,
      enrolledAt: new Date(),
    },
  });
}

/**
 * Get all problems due for review for a user.
 */
export async function getDueReviews(userId: string) {
  const now = new Date();

  const reviews = await prisma.problemReview.findMany({
    where: {
      userId,
      nextReviewAt: { lte: now },
    },
    include: {
      problem: {
        select: {
          id: true,
          slug: true,
          title: true,
          difficulty: true,
          pattern: true,
          topics: true,
        },
      },
    },
    orderBy: { nextReviewAt: "asc" },
  });

  return reviews;
}

/**
 * Record a review result and update the schedule.
 *
 * @param userId    User ID
 * @param problemId Problem ID
 * @param rating    Self-rating 1-4
 */
export async function recordReview(
  userId: string,
  problemId: string,
  rating: number
): Promise<ReviewSchedule> {
  const review = await prisma.problemReview.findUnique({
    where: { userId_problemId: { userId, problemId } },
  });

  if (!review) {
    throw new Error("Problem not enrolled for review");
  }

  const quality = ratingToQuality(rating);
  const schedule = calculateNextReview(
    quality,
    review.easeFactor,
    review.interval,
    review.repetitions
  );

  await prisma.problemReview.update({
    where: { userId_problemId: { userId, problemId } },
    data: {
      easeFactor: schedule.easeFactor,
      interval: schedule.interval,
      repetitions: schedule.repetitions,
      nextReviewAt: schedule.nextReviewAt,
      lastRating: rating,
      totalReviews: { increment: 1 },
      lastReviewedAt: new Date(),
    },
  });

  return schedule;
}

/**
 * Get review statistics for a user.
 */
export async function getReviewStats(userId: string): Promise<ReviewStats> {
  const allReviews = await prisma.problemReview.findMany({
    where: { userId },
    select: {
      easeFactor: true,
      interval: true,
      nextReviewAt: true,
    },
  });

  const now = new Date();
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const totalEnrolled = allReviews.length;
  const dueNow = allReviews.filter((r) => r.nextReviewAt <= now).length;
  const dueToday = allReviews.filter((r) => r.nextReviewAt <= endOfDay).length;
  const masteredCount = allReviews.filter((r) => r.interval >= 21).length;
  const averageEase =
    totalEnrolled > 0
      ? allReviews.reduce((sum, r) => sum + r.easeFactor, 0) / totalEnrolled
      : 2.5;

  return {
    totalEnrolled,
    dueNow,
    dueToday,
    averageEase: Math.round(averageEase * 100) / 100,
    masteredCount,
  };
}
