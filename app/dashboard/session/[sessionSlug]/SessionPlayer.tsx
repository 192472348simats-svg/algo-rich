"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type {
  SessionDefinition,
  SessionStage,
  HookConfig,
  WatchConfig,
  PredictConfig,
  LearnConfig,
  GuidedBuildConfig,
  CodeConfig,
  ReflectConfig,
  SummaryConfig,
} from "@/lib/sessionDefinitions";

import HookStage from "@/app/components/session/HookStage";
import WatchStage from "@/app/components/session/WatchStage";
import PredictStage from "@/app/components/session/PredictStage";
import LearnStage from "@/app/components/session/LearnStage";
import GuidedBuildStage from "@/app/components/session/GuidedBuildStage";
import CodeStage from "@/app/components/session/CodeStage";
import ReflectStage from "@/app/components/session/ReflectStage";
import SummaryStage from "@/app/components/session/SummaryStage";

interface SessionPlayerProps {
  sessionSlug: string;
}

export interface StageResult {
  score: number;
  timeSpent: number;
  details?: Record<string, unknown>;
}

// Guide Star component — appears after failed reflect
function GuideStar({ topic, onDismiss }: { topic: string; onDismiss: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      className="fixed bottom-24 right-6 z-50 max-w-xs w-72 rounded-2xl p-4 shadow-2xl"
      style={{ background: '#0f1629', border: '1px solid #E5A82950' }}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: '#1a1400', border: '1px solid #E5A829' }}>
          <span className="text-lg">⭐</span>
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-white mb-1">Need a review?</p>
          <p className="text-xs leading-relaxed mb-3" style={{ color: '#6b7a99' }}>
            You missed some questions. Go back to the course lesson to reinforce the concept.
          </p>
          <div className="flex gap-2">
            <a href="/dashboard/courses"
              className="flex-1 py-2 rounded-lg text-xs font-semibold text-center transition-all hover:opacity-90"
              style={{ background: '#E5A829', color: '#0a0f24' }}>
              Review Lesson →
            </a>
            <button onClick={onDismiss}
              className="px-3 py-2 rounded-lg text-xs transition-all"
              style={{ background: '#1E3A5F', color: '#6b7a99' }}>
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function SessionPlayer({ sessionSlug }: SessionPlayerProps) {
  const [definition, setDefinition] = useState<SessionDefinition | null>(null);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [stageResults, setStageResults] = useState<
    Record<string, StageResult>
  >({});
  const [stageStartTime, setStageStartTime] = useState(Date.now());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionStartTime] = useState(Date.now());
  const [showGuideStar, setShowGuideStar] = useState(false);

  // Fetch session definition and progress
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/sessions/${sessionSlug}`);
        if (!res.ok) throw new Error("Failed to load session");
        const data = await res.json();
        setDefinition(data.definition);

        // Resume from where user left off
        if (data.progress && !data.progress.completed) {
          setCurrentStageIndex(data.progress.currentStageIndex || 0);
          if (
            data.progress.stageResults &&
            data.progress.stageResults !== "{}"
          ) {
            setStageResults(
              typeof data.progress.stageResults === "string"
                ? JSON.parse(data.progress.stageResults)
                : data.progress.stageResults
            );
          }
        }
        setLoading(false);
      } catch {
        setError("Failed to load session");
        setLoading(false);
      }
    }
    load();
  }, [sessionSlug]);

  // Save progress after each stage
  const completeStage = useCallback(
    async (result: StageResult) => {
      if (!definition) return;

      const stage = definition.stages[currentStageIndex];
      const timeSpent = Math.round((Date.now() - stageStartTime) / 1000);
      const finalResult = { ...result, timeSpent };

      // Save locally
      const newResults = { ...stageResults, [stage.id]: finalResult };
      setStageResults(newResults);

      const isLastStage =
        currentStageIndex >= definition.stages.length - 1;

      // Save to server
      try {
        await fetch(`/api/sessions/${sessionSlug}/progress`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            stageId: stage.id,
            stageIndex: currentStageIndex,
            score: finalResult.score,
            timeSpent: finalResult.timeSpent,
            completed: isLastStage,
          }),
        });
      } catch (err) {
        console.error("Failed to save progress:", err);
      }

      // Show guide star if reflect stage score < 70%
      if (stage.type === "reflect" && finalResult.score < 70) {
        setShowGuideStar(true);
      }

      // Advance to next stage
      if (!isLastStage) {
        setCurrentStageIndex((prev) => prev + 1);
        setStageStartTime(Date.now());
      }
    },
    [definition, currentStageIndex, stageResults, stageStartTime, sessionSlug]
  );

  // ─── Render ───────────────────────────────────────────────
  const currentTopic = definition?.topic ?? "this topic";

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0a0a0f]">
        <motion.div
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="text-white/40 text-sm"
        >
          Loading session...
        </motion.div>
      </div>
    );
  }

  if (error || !definition) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a0a0f] text-center">
        <p className="text-white/60 mb-4">{error || "Session not found"}</p>
        <a
          href="/dashboard"
          className="text-cyan-400 hover:underline text-sm"
        >
          ← Back to Dashboard
        </a>
      </div>
    );
  }

  const currentStage = definition.stages[currentStageIndex];
  const totalStages = definition.stages.length;
  const progressPercent = (currentStageIndex / totalStages) * 100;

  function renderStage(stage: SessionStage) {
    switch (stage.type) {
      case "hook":
        return (
          <HookStage
            config={stage.config as HookConfig}
            onComplete={completeStage}
          />
        );
      case "watch":
        return (
          <WatchStage
            config={stage.config as WatchConfig}
            onComplete={completeStage}
          />
        );
      case "predict":
        return (
          <PredictStage
            config={stage.config as PredictConfig}
            onComplete={completeStage}
          />
        );
      case "learn":
        return (
          <LearnStage
            config={stage.config as LearnConfig}
            onComplete={completeStage}
          />
        );
      case "guided-build":
        return (
          <GuidedBuildStage
            config={stage.config as GuidedBuildConfig}
            onComplete={completeStage}
          />
        );
      case "code":
        return (
          <CodeStage
            config={stage.config as CodeConfig}
            onComplete={completeStage}
          />
        );
      case "reflect":
        return (
          <ReflectStage
            config={stage.config as ReflectConfig}
            onComplete={completeStage}
          />
        );
      case "summary":
        return (
          <SummaryStage
            config={stage.config as SummaryConfig}
            onComplete={completeStage}
            stageResults={stageResults}
            definition={definition!}
            sessionStartTime={sessionStartTime}
          />
        );
      default:
        return <div className="text-white">Unknown stage type</div>;
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col">
      {/* Guide Star */}
      <AnimatePresence>
        {showGuideStar && (
          <GuideStar topic={currentTopic} onDismiss={() => setShowGuideStar(false)} />
        )}
      </AnimatePresence>
      {/* Top bar — progress + exit */}
      <div className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-lg border-b border-white/[0.04]">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-4">
          <a
            href="/dashboard"
            className="text-white/20 hover:text-white/50 transition-colors text-sm flex-shrink-0"
          >
            ✕
          </a>

          <div className="flex-1 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-cyan-400"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>

          <span className="text-[11px] text-white/20 flex-shrink-0 tabular-nums">
            {currentStageIndex + 1}/{totalStages}
          </span>
        </div>
      </div>

      {/* Stage content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-4xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStage.id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{
                duration: 0.35,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              {renderStage(currentStage)}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
