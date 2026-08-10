import posthog from 'posthog-js';

export type EventName =
  | 'problem_started'
  | 'problem_solved'
  | 'lesson_started'
  | 'lesson_completed'
  | 'walkthrough_started'
  | 'walkthrough_completed'
  | 'onboarding_completed'
  | 'profile_updated'
  | 'password_changed'
  | 'account_deleted'
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
  | 'streak_repaired'
  | 'feedback_submitted';

export interface AnalyticsProperties {
  [key: string]: unknown;
}

export const analytics = {
  track: (event: EventName, properties?: AnalyticsProperties): void => {
    posthog.capture(event, properties);
  },
};
