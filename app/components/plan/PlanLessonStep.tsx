"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { PlanStep, LessonData } from "@/lib/planGenerator";
import MarkdownContent from "@/app/components/MarkdownContent";
import { useLessonEngagement } from "@/app/components/learning/useLessonEngagement";

interface Props {
  step: PlanStep;
  onComplete: (result: {
    score?: number;
    timeSpent?: number;
    skipped?: boolean;
  }) => void;
}

interface LessonResponse {
  id: string;
  title: string;
  content: string;
  codeExample: string | null;
  difficulty: string;
  estimatedTime: number;
}

export default function PlanLessonStep({ step, onComplete }: Props) {
  const data = step.data as LessonData;
  const [lesson, setLesson] = useState<LessonResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [startTime] = useState(() => Date.now());
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const {
    maxScrollPct,
    minSeconds,
    minScrollPct,
    secondsRemaining,
    scrollRemaining,
    engagementMet,
    syncError,
    syncEngagement,
  } = useLessonEngagement({
    lessonId: data.lessonId,
    scrollContainerRef: scrollRef,
  });

  useEffect(() => {
    fetch(`/api/lessons/${data.lessonId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((d) => {
        setLesson(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [data.lessonId]);

  async function handleComplete() {
    if (marking) return;

    setError(null);
    setMarking(true);

    try {
      const syncedProgress = await syncEngagement(maxScrollPct);
      if (!syncedProgress?.canComplete) {
        setError(
          `Finish reading first: ${secondsRemaining}s more and ${scrollRemaining}% more scroll needed.`
        );
        return;
      }

      const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId: data.lessonId }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        setError(body?.error ?? "Failed to mark lesson complete.");
        return;
      }

      onComplete({
        score: 15,
        timeSpent: Math.round((Date.now() - startTime) / 1000),
      });
    } catch (err) {
      console.error("Failed to mark lesson complete:", err);
      setError("Failed to mark lesson complete. Please try again.");
    } finally {
      setMarking(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-4 max-w-2xl mx-auto">
        <div className="animate-pulse rounded-xl bg-white/[0.03] h-6 w-1/3" />
        <div className="animate-pulse rounded-xl bg-white/[0.03] h-4 w-2/3" />
        <div className="animate-pulse rounded-xl bg-white/[0.03] h-64" />
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="text-center py-12">
        <p className="text-white/30 text-sm">Lesson not found</p>
        <button
          onClick={() => onComplete({ skipped: true })}
          className="mt-4 text-primary text-sm"
        >
          Skip -&gt;
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <p className="text-xs text-primary/40 mb-1">{data.courseName}</p>
        <h2 className="text-xl font-bold text-white">{lesson.title}</h2>
      </div>

      <div
        ref={scrollRef}
        className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 max-h-[55vh] overflow-y-auto"
      >
        <MarkdownContent content={lesson.content} />
      </div>

      <div className="rounded-xl border border-gold-primary/20 bg-white/[0.02] p-4">
        <p className="text-sm text-gray-light/70">
          Completion unlocks after {minSeconds}s reading and {minScrollPct}% scroll.
        </p>
        {!engagementMet && (
          <p className="text-xs text-gray-light/50 mt-1">
            Remaining: {secondsRemaining}s and {scrollRemaining}% scroll.
          </p>
        )}
        {(error || syncError) && <p className="text-xs text-red-300 mt-2">{error || syncError}</p>}
      </div>

      {lesson.codeExample && (
        <div className="rounded-xl border border-white/[0.06] bg-[#0d1117] p-4 overflow-x-auto">
          <p className="text-xs text-white/25 uppercase tracking-wider mb-2">Code Example</p>
          <pre className="text-sm text-primary font-mono whitespace-pre-wrap">{lesson.codeExample}</pre>
        </div>
      )}

      <div className="text-center">
        <motion.button
          onClick={handleComplete}
          disabled={marking || !engagementMet || Boolean(syncError)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="rounded-xl bg-gradient-to-r from-primary to-primary/60 px-8 py-3 text-sm font-semibold text-background hover:shadow-lg hover:shadow-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {marking
            ? "Marking..."
            : engagementMet
            ? "Got it - Continue ->"
            : "Finish Reading to Unlock"}
        </motion.button>
      </div>
    </div>
  );
}
