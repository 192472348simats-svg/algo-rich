"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
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
  const completingStageRef = useRef(false);
  const router = useRouter();

  // Fetch session definition and progress
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/sessions/${sessionSlug}`);
        if (!res.ok) throw new Error("Failed to load session");
        const data = await res.json();
        const definition: SessionDefinition = data.definition;
        setDefinition(definition);

        // Resume from where user left off, but clamp to valid range
        if (data.progress && !data.progress.completed) {
          const persistedIndex = data.progress.currentStageIndex ?? 0;
          const clampedIndex = Math.min(
            Math.max(persistedIndex, 0),
            Math.max(definition.stages.length - 1, 0)
          );
          setCurrentStageIndex(clampedIndex);

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
      if (completingStageRef.current) return;
      completingStageRef.current = true;

      const stage = definition.stages[currentStageIndex];
      const timeSpent = Math.round((Date.now() - stageStartTime) / 1000);
      const finalResult = { ...result, timeSpent };

      const isLastStage =
        currentStageIndex >= definition.stages.length - 1;

      // Persist before advancing. The server validates stage order and awards XP, so
      // moving optimistically here could leave the UI ahead of saved progress.
      try {
        const response = await fetch(`/api/sessions/${sessionSlug}/progress`, {
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
        if (!response.ok) {
          throw new Error(`Progress save failed (${response.status})`);
        }
      } catch (err) {
        console.error("Failed to save progress:", err);
        completingStageRef.current = false;
        return;
      }

      const newResults = { ...stageResults, [stage.id]: finalResult };
      setStageResults(newResults);

      // Show guide star if reflect stage score < 70%
      if (stage.type === "reflect" && finalResult.score < 70) {
        setShowGuideStar(true);
      }

      // Advance to next stage or redirect on completion
      if (!isLastStage) {
        setCurrentStageIndex((prev) => prev + 1);
        setStageStartTime(Date.now());
      } else {
        // Session fully complete — go back to sessions list
        setTimeout(() => {
          router.push("/dashboard/sessions");
        }, 1800);
      }
      completingStageRef.current = false;
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
          className="text-sm hover:underline" style={{ color: "#E5A829" }}
        >
          ← Back to Dashboard
        </a>
      </div>
    );
  }

  const currentStage = definition.stages[currentStageIndex];
  const totalStages = definition.stages.length;
  const progressPercent = totalStages
    ? (currentStageIndex / totalStages) * 100
    : 0;

  // Fallback if progress pointed past the last stage
  if (!currentStage) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a0a0f] text-center">
        <p className="text-white/70 mb-3">
          Session progress was out of sync. Restarting this session.
        </p>
        <button
          className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
          style={{ background: "#E5A829", color: "#0a0f24" }}
          onClick={() => {
            setCurrentStageIndex(0);
            setStageResults({});
            setStageStartTime(Date.now());
          }}
        >
          Restart Session
        </button>
      </div>
    );
  }

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
      {/* Top bar — stage pills + exit */}
      <div className="sticky top-0 z-50 backdrop-blur-lg" style={{ background: "rgba(10,15,36,0.9)", borderBottom: "1px solid #1E3A5F" }}>
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <a href="/dashboard/sessions" className="text-sm flex-shrink-0 transition-colors" style={{ color: "#6b7a99" }}>✕</a>
          <div className="flex-1 flex items-center gap-1 overflow-x-auto scrollbar-none">
            {definition.stages.map((stage, i) => {
              const stageNames: Record<string, string> = { hook: "Hook", watch: "Watch", predict: "Predict", learn: "Learn", "guided-build": "Build", code: "Code", reflect: "Reflect", summary: "Done" };
              const isDone = i < currentStageIndex;
              const isCurrent = i === currentStageIndex;
              return (
                <div key={stage.id} className="flex items-center gap-1 flex-shrink-0">
                  <div className="px-2.5 py-1 rounded-full text-xs font-medium transition-all"
                    style={{
                      background: isDone ? "#051a12" : isCurrent ? "#1a1400" : "#0a0f24",
                      color: isDone ? "#10b981" : isCurrent ? "#E5A829" : "#6b7a99",
                      border: `1px solid ${isDone ? "#10b98140" : isCurrent ? "#E5A829" : "#1E3A5F"}`,
                    }}>
                    {isDone ? "✓" : stageNames[stage.type] ?? stage.type}
                  </div>
                  {i < definition.stages.length - 1 && (
                    <div className="w-3 h-px flex-shrink-0" style={{ background: "#1E3A5F" }} />
                  )}
                </div>
              );
            })}
          </div>
          <span className="text-xs flex-shrink-0" style={{ color: "#6b7a99" }}>{definition.title.split(" — ")[0].split(" ").slice(0,3).join(" ")}</span>
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
