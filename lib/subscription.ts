import prisma from "@/lib/prisma";

export interface SubscriptionStatus {
  isSubscribed: boolean;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  stripePriceId: string | null;
  currentPeriodEnd: Date | null;
}

/**
 * Check whether a user has an active (paid) subscription.
 *
 * A subscription is considered active when:
 *   1. `stripeCurrentPeriodEnd` exists AND
 *   2. It is in the future (with a 1-day grace period for webhook delays)
 */
export async function checkSubscription(userId: string): Promise<SubscriptionStatus> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      stripeCustomerId: true,
      stripeSubscriptionId: true,
      stripePriceId: true,
      stripeCurrentPeriodEnd: true,
    },
  });

  if (!user) {
    return {
      isSubscribed: false,
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      stripePriceId: null,
      currentPeriodEnd: null,
    };
  }

  // 1-day grace period so Stripe webhook delays don't immediately lock users out
  const GRACE_MS = 24 * 60 * 60 * 1000;
  const isSubscribed =
    !!user.stripeSubscriptionId &&
    !!user.stripeCurrentPeriodEnd &&
    user.stripeCurrentPeriodEnd.getTime() + GRACE_MS > Date.now();

  return {
    isSubscribed,
    stripeCustomerId: user.stripeCustomerId,
    stripeSubscriptionId: user.stripeSubscriptionId,
    stripePriceId: user.stripePriceId,
    currentPeriodEnd: user.stripeCurrentPeriodEnd,
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
