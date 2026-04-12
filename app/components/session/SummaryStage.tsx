"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import type { SummaryConfig, SessionDefinition } from "@/lib/sessionDefinitions";
import type { StageResult } from "@/app/dashboard/session/[sessionSlug]/SessionPlayer";

interface Props {
  config: SummaryConfig;
  onComplete: (result: StageResult) => void;
  stageResults: Record<string, StageResult>;
  definition: SessionDefinition;
  sessionStartTime: number;
}

export default function SummaryStage({
  onComplete,
  stageResults,
  definition,
  sessionStartTime,
}: Props) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sessionEndTime] = useState(() => Date.now());

  const stats = useMemo(() => {
    const totalTimeMinutes = Math.round(
      (sessionEndTime - sessionStartTime) / 60000
    );
    let totalXP = 0;
    let predictScore = 0;
    let predictTotal = 0;
    let reflectScore = 0;
    let reflectTotal = 0;
    let codeTimeSpent = 0;

    for (const stage of definition.stages) {
      const result = stageResults[stage.id];
      if (result) {
        totalXP += result.score || 0;
      }

      if (stage.type === "predict" && result) {
        predictScore += result.score || 0;
        // Estimate total from config
        const predictConfig = stage.config as { questions?: { xp: number }[] };
        predictTotal +=
          predictConfig.questions?.reduce((s, q) => s + q.xp, 0) || 0;
      }

      if (stage.type === "reflect" && result) {
        reflectScore += result.score || 0;
        const reflectConfig = stage.config as { questions?: unknown[] };
        reflectTotal += (reflectConfig.questions?.length || 0) * 10;
      }

      if (stage.type === "code" && result) {
        codeTimeSpent = result.timeSpent || 0;
      }
    }

    return {
      totalTimeMinutes,
      totalXP,
      predictScore,
      predictTotal,
      reflectScore,
      reflectTotal,
      codeTimeMinutes: Math.round(codeTimeSpent / 60),
    };
  }, [stageResults, definition, sessionStartTime, sessionEndTime]);

  const handleMarkComplete = async () => {
    setIsSubmitting(true);
    // Persist completion state
    await onComplete({
      score: stats.totalXP,
      timeSpent: stats.totalTimeMinutes * 60,
    });

    // Smart navigation
    if (definition.nextSessionSlug) {
      router.push(`/dashboard/session/${definition.nextSessionSlug}`);
    } else {
      router.push("/dashboard/sessions");
    }
  };

  const statItems = [
    {
      label: "Time spent",
      value: `${stats.totalTimeMinutes} minutes`,
      icon: "⏱️",
    },
    {
      label: "Predictions",
      value: `${stats.predictScore}/${stats.predictTotal} XP`,
      icon: "🎯",
    },
    ...(stats.codeTimeMinutes > 0
      ? [
          {
            label: "Code challenge",
            value: `solved in ${stats.codeTimeMinutes} min`,
            icon: "💻",
          },
        ]
      : []),
    {
      label: "Reflection",
      value: `${stats.reflectScore}/${stats.reflectTotal} XP`,
      icon: "🧠",
    },
    {
      label: "XP earned",
      value: `+${stats.totalXP}`,
      icon: "⭐",
      highlight: true,
    },
  ];

  return (
    <div className="max-w-lg mx-auto space-y-8">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="text-5xl mb-4"
        >
          🏆
        </motion.div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Session Complete!
        </h2>
        <p className="text-sm text-white/40">{definition.title}</p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-xl border border-white/[0.06] bg-white/[0.02] divide-y divide-white/[0.04]"
      >
        {statItems.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + i * 0.1 }}
            className="flex items-center justify-between px-5 py-3.5"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">{item.icon}</span>
              <span className="text-sm text-white/50">{item.label}</span>
            </div>
            <span
              className={`text-sm font-semibold ${
                item.highlight ? "text-[#E5A829]" : "text-white/70"
              }`}
            >
              {item.value}
            </span>
          </motion.div>
        ))}
      </motion.div>

      {/* Action CTA Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="flex flex-col gap-3"
      >
        {definition.nextSessionSlug ? (
          <button
            onClick={() =>
              router.push(`/dashboard/session/${definition.nextSessionSlug}`)
            }
            className="w-full py-4 bg-[#E5A829] text-[#0a0f24] font-bold rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2"
          >
            Start Next Session:{" "}
            {definition.nextSessionSlug
              .replace(/-/g, " ")
              .replace(/\b\w/g, (c) => c.toUpperCase())}
            <span>→</span>
          </button>
        ) : (
          <button
            onClick={() => router.push("/dashboard/sessions")}
            className="w-full py-4 bg-emerald-500 text-white font-bold rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2"
          >
            Browse All Sessions <span>→</span>
          </button>
        )}

        {definition.topic && (
          <button
            onClick={() =>
              router.push(`/dashboard/practice?topic=${definition.topic}`)
            }
            className="w-full py-3 bg-transparent border border-[#E5A829]/40 text-[#E5A829] font-medium rounded-xl hover:bg-[#E5A829]/5 transition-all flex items-center justify-center gap-2 text-sm"
          >
            Practice {definition.topic.replace(/-/g, " ")} Problems →
          </button>
        )}
      </motion.div>

      {/* Final Mark Complete Action */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="pt-4"
      >
        <button
          onClick={handleMarkComplete}
          disabled={isSubmitting}
          className="w-full py-3 bg-white/5 border border-white/10 text-white/50 font-medium rounded-xl hover:bg-white/10 transition-all text-xs"
        >
          {isSubmitting
            ? "Saving progress..."
            : "Mark Complete & Finish Session"}
        </button>
      </motion.div>
    </div>
  );
}
