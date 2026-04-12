import { createHmac, timingSafeEqual } from "node:crypto";
import {
  clampScrollPercent,
  MIN_LESSON_SECONDS,
  MIN_SCROLL_PERCENT,
} from "@/lib/lessonEngagement.shared";

const COOKIE_PREFIX = "lesson_engagement_";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 12;

export interface LessonEngagementState {
  version: 1;
  lessonId: string;
  userId: string;
  startedAt: number;
  maxScrollPct: number;
  lastSyncedAt: number;
}

export interface LessonEngagementProgress {
  elapsedSeconds: number;
  maxScrollPct: number;
  canComplete: boolean;
}

function getSigningSecret() {
  return process.env.AUTH_SECRET || "dev-lesson-engagement-secret";
}

function getSignature(value: string) {
  return createHmac("sha256", getSigningSecret()).update(value).digest("base64url");
}

function parseSignedValue(token: string | undefined | null) {
  if (!token) return null;

  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;

  const expectedSignature = getSignature(payload);
  const providedBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (providedBuffer.length !== expectedBuffer.length) {
    return null;
  }

  if (!timingSafeEqual(providedBuffer, expectedBuffer)) {
    return null;
  }

  try {
    return JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as LessonEngagementState;
  } catch {
    return null;
  }
}

export function createLessonEngagementState(params: {
  lessonId: string;
  userId: string;
  startedAt?: number;
  maxScrollPct?: number;
}) {
  const now = Date.now();

  return {
    version: 1 as const,
    lessonId: params.lessonId,
    userId: params.userId,
    startedAt: params.startedAt ?? now,
    maxScrollPct: clampScrollPercent(params.maxScrollPct ?? 0),
    lastSyncedAt: now,
  };
}

export function getLessonEngagementCookieName(lessonId: string) {
  return `${COOKIE_PREFIX}${lessonId}`;
}

export function getLessonEngagementCookieConfig() {
  return {
    httpOnly: true,
    maxAge: COOKIE_MAX_AGE_SECONDS,
    path: "/",
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
  };
}

export function serializeLessonEngagement(state: LessonEngagementState) {
  const payload = Buffer.from(JSON.stringify(state), "utf8").toString("base64url");
  const signature = getSignature(payload);
  return `${payload}.${signature}`;
}

export function parseLessonEngagement(token: string | undefined | null) {
  return parseSignedValue(token);
}

export function getLessonEngagementProgress(
  state: LessonEngagementState,
  now = Date.now()
): LessonEngagementProgress {
  const elapsedSeconds = Math.max(0, Math.floor((now - state.startedAt) / 1000));
  const maxScrollPct = clampScrollPercent(state.maxScrollPct);

  return {
    elapsedSeconds,
    maxScrollPct,
    canComplete:
      elapsedSeconds >= MIN_LESSON_SECONDS && maxScrollPct >= MIN_SCROLL_PERCENT,
  };
}

export function mergeLessonEngagementState(
  current: LessonEngagementState,
  nextMaxScrollPct: number
) {
  return {
    ...current,
    maxScrollPct: Math.max(current.maxScrollPct, clampScrollPercent(nextMaxScrollPct)),
    lastSyncedAt: Date.now(),
  };
}
