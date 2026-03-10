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

      // Advance to next stage
      if (!isLastStage) {
        setCurrentStageIndex((prev) => prev + 1);
        setStageStartTime(Date.now());
      }
    },
    [definition, currentStageIndex, stageResults, stageStartTime, sessionSlug]
  );

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
