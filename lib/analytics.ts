/**
 * Centralized Analytics Wrapper for Algo Rich
 *
 * Thin wrapper around PostHog. All event tracking goes through here so that
 * swapping providers later requires changing only this file.
 *
 * IMPORTANT: This file is imported by both client and server components.
 * PostHog calls are gated behind `typeof window !== 'undefined'` so they
 * are safely skipped during SSR.
 */

// Extend event names here as analytics grows
export type EventName =
  | 'problem_started'
  | 'problem_solved'
  | 'lesson_started'
  | 'lesson_completed'
  | 'walkthrough_started'
  | 'walkthrough_completed'
  | 'onboarding_completed'
  | 'hint_used'
  | 'zyra_hint_requested'
  | 'zyra_dismissed'
  | 'review_session_started'
  | 'review_completed'
  | 'xp_earned'
  | 'subscription_started'
  | 'subscription_cancelled'
  | 'piston_failure'
  | 'pattern_unlocked'
  | 'boss_challenge_started'
  | 'boss_challenge_won'
  | 'streak_broken'
  | 'streak_repaired';

export interface AnalyticsProperties {
  userId?: string;
  [key: string]: unknown;
}

function getPostHog() {
  if (typeof window === 'undefined') return null;
  // Dynamic import avoids SSR issues; posthog is initialized by PostHogProvider
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return (require('posthog-js') as { default: typeof import('posthog-js').default }).default;
}

export const analytics = {
  /**
   * Track a user action event.
   * Safe to call anywhere — no-ops during SSR and when PostHog key is missing.
   */
  track: (event: EventName, properties?: AnalyticsProperties): void => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[Analytics] ${event}`, properties);
      return;
    }
    try {
      getPostHog()?.capture(event, properties);
    } catch {
      // Never crash due to analytics
    }
  },

  /**
   * Identify the current user. Call after sign-in.
   * PostHogProvider also calls this automatically via useSession.
   */
  identify: (userId: string, traits?: Record<string, unknown>): void => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[Analytics] identify ${userId}`, traits);
      return;
    }
    try {
      getPostHog()?.identify(userId, traits);
    } catch {
      // Never crash due to analytics
    }
  },

  /**
   * Reset analytics identity — call on sign-out.
   */
  reset: (): void => {
    try {
      getPostHog()?.reset();
    } catch {
      // Never crash due to analytics
    }
  },

  /**
   * Manually track a page view (PostHog auto-captures these, but useful for SPAs).
   */
  pageView: (url: string): void => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[Analytics] pageview ${url}`);
      return;
    }
    try {
      getPostHog()?.capture('$pageview', { $current_url: url });
    } catch {
      // Never crash due to analytics
    }
  },
};
