import prisma from "@/lib/prisma";

export interface SubscriptionStatus {
  isSubscribed: boolean;
  razorpayCustomerId: string | null;
  razorpaySubscriptionId: string | null;
  razorpayPlanId: string | null;
  currentPeriodEnd: Date | null;
}

/**
 * Check whether a user has an active (paid) subscription.
 *
 * A subscription is considered active when:
 *   1. `razorpayCurrentPeriodEnd` exists AND
 *   2. It is in the future (with a 1-day grace period for webhook delays)
 */
export async function checkSubscription(userId: string): Promise<SubscriptionStatus> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      razorpayCustomerId: true,
      razorpaySubscriptionId: true,
      razorpayPlanId: true,
      razorpayCurrentPeriodEnd: true,
    },
  });

  if (!user) {
    return {
      isSubscribed: false,
      razorpayCustomerId: null,
      razorpaySubscriptionId: null,
      razorpayPlanId: null,
      currentPeriodEnd: null,
    };
  }

  // 1-day grace period so webhook delays don't immediately lock users out
  const GRACE_MS = 24 * 60 * 60 * 1000;
  const isSubscribed =
    !!user.razorpaySubscriptionId &&
    !!user.razorpayCurrentPeriodEnd &&
    user.razorpayCurrentPeriodEnd.getTime() + GRACE_MS > Date.now();

  return {
    isSubscribed,
    razorpayCustomerId: user.razorpayCustomerId,
    razorpaySubscriptionId: user.razorpaySubscriptionId,
    razorpayPlanId: user.razorpayPlanId,
    currentPeriodEnd: user.razorpayCurrentPeriodEnd,
  };
}

/**
 * Guard function for API routes. Throws a descriptive error if the user
 * does not have an active subscription.
 *
 * Usage:
 * ```ts
 * await requireSubscription(session.user.id);
 * // ... premium logic
 * ```
 */
export async function requireSubscription(userId: string): Promise<SubscriptionStatus> {
  const status = await checkSubscription(userId);
  if (!status.isSubscribed) {
    const error = new Error("This feature requires an active subscription.");
    (error as Error & { status: number }).status = 403;
    throw error;
  }
  return status;
}
