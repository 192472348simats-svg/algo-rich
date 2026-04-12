"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import {
  clampScrollPercent,
  MIN_LESSON_SECONDS,
  MIN_SCROLL_PERCENT,
} from "@/lib/lessonEngagement.shared";

interface LessonEngagementResponse {
  progress?: {
    elapsedSeconds: number;
    maxScrollPct: number;
    canComplete: boolean;
  };
}

interface UseLessonEngagementOptions {
  lessonId: string;
  enabled?: boolean;
  scrollContainerRef?: RefObject<HTMLElement | null>;
}

function getScrollPercent(container: HTMLElement | null | undefined) {
  if (container) {
    const maxScrollable = container.scrollHeight - container.clientHeight;
    if (maxScrollable <= 0) return 100;
    return clampScrollPercent((container.scrollTop / maxScrollable) * 100);
  }

  const doc = document.documentElement;
  const maxScrollable = doc.scrollHeight - doc.clientHeight;
  if (maxScrollable <= 0) return 100;
  return clampScrollPercent((window.scrollY / maxScrollable) * 100);
}

export function useLessonEngagement({
  lessonId,
  enabled = true,
  scrollContainerRef,
}: UseLessonEngagementOptions) {
  const [timeOnPage, setTimeOnPage] = useState(0);
  const [maxScrollPct, setMaxScrollPct] = useState(0);
  const [syncError, setSyncError] = useState<string | null>(null);
  const lastSyncedScrollRef = useRef(0);

  const syncEngagement = useCallback(
    async (scrollPct: number) => {
      if (!enabled) return null;

      const response = await fetch(`/api/lessons/${lessonId}/engagement`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          maxScrollPct: clampScrollPercent(scrollPct),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to sync lesson engagement");
      }

      const data = (await response.json()) as LessonEngagementResponse;
      if (typeof data.progress?.maxScrollPct === "number") {
        setMaxScrollPct((prev) => Math.max(prev, data.progress?.maxScrollPct ?? 0));
      }

      return data.progress ?? null;
    },
    [enabled, lessonId]
  );

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;
    syncEngagement(getScrollPercent(scrollContainerRef?.current))
      .then(() => {
        if (!cancelled) {
          setSyncError(null);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setSyncError("We could not verify lesson progress right now.");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [enabled, lessonId, scrollContainerRef, syncEngagement]);

  useEffect(() => {
    if (!enabled) return;

    const startedAt = Date.now();
    const interval = window.setInterval(() => {
      setTimeOnPage(Math.floor((Date.now() - startedAt) / 1000));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [enabled, lessonId]);

  useEffect(() => {
    if (!enabled) return;

    const handleScroll = () => {
      const nextPct = getScrollPercent(scrollContainerRef?.current);
      setMaxScrollPct((prev) => Math.max(prev, nextPct));
    };

    handleScroll();

    const scrollTarget = scrollContainerRef?.current;
    if (scrollTarget) {
      scrollTarget.addEventListener("scroll", handleScroll, { passive: true });
      window.addEventListener("resize", handleScroll, { passive: true });

      return () => {
        scrollTarget.removeEventListener("scroll", handleScroll);
        window.removeEventListener("resize", handleScroll);
      };
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [enabled, lessonId, scrollContainerRef]);

  useEffect(() => {
    if (!enabled) return;

    const nextSyncThreshold = lastSyncedScrollRef.current + 5;
    const shouldSync = maxScrollPct >= nextSyncThreshold || maxScrollPct === 100;

    if (!shouldSync) return;

    lastSyncedScrollRef.current = maxScrollPct;

    const timeout = window.setTimeout(() => {
      syncEngagement(maxScrollPct)
        .then(() => setSyncError(null))
        .catch(() => {
          setSyncError("We could not verify lesson progress right now.");
        });
    }, 150);

    return () => window.clearTimeout(timeout);
  }, [enabled, maxScrollPct, syncEngagement]);

  return {
    timeOnPage,
    maxScrollPct,
    minSeconds: MIN_LESSON_SECONDS,
    minScrollPct: MIN_SCROLL_PERCENT,
    secondsRemaining: Math.max(0, MIN_LESSON_SECONDS - timeOnPage),
    scrollRemaining: Math.max(0, MIN_SCROLL_PERCENT - maxScrollPct),
    engagementMet:
      !enabled ||
      (timeOnPage >= MIN_LESSON_SECONDS && maxScrollPct >= MIN_SCROLL_PERCENT),
    syncError,
    syncEngagement,
  };
}
