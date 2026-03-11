"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { PlanStep, LessonData } from "@/lib/planGenerator";
import MarkdownContent from "@/app/components/MarkdownContent";

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
  const [startTime] = useState(() => Date.now());

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
    // Mark lesson as complete
    try {
      await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId: data.lessonId }),
      });
    } catch (err) {
      console.error("Failed to mark lesson complete:", err);
    }

    onComplete({
      score: 15,
      timeSpent: Math.round((Date.now() - startTime) / 1000),
    });
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
          Skip →
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <p className="text-xs text-primary/40 mb-1">
          {data.courseName}
        </p>
        <h2 className="text-xl font-bold text-white">{lesson.title}</h2>
      </div>

      {/* Lesson content */}
      <div
        className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 max-h-[55vh] overflow-y-auto"
      >
        <MarkdownContent content={lesson.content} />
      </div>

      {/* Code example */}
      {lesson.codeExample && (
        <div className="rounded-xl border border-white/[0.06] bg-[#0d1117] p-4 overflow-x-auto">
          <p className="text-xs text-white/25 uppercase tracking-wider mb-2">
            Code Example
          </p>
          <pre className="text-sm text-primary font-mono whitespace-pre-wrap">
            {lesson.codeExample}
          </pre>
        </div>
      )}

      {/* Complete button */}
      <div className="text-center">
        <motion.button
          onClick={handleComplete}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="rounded-xl bg-gradient-to-r from-primary to-primary/60 
                     px-8 py-3 text-sm font-semibold text-background
                     hover:shadow-lg hover:shadow-primary/20 transition-all"
        >
          Got it — Continue →
        </motion.button>
      </div>
    </div>
  );
}
