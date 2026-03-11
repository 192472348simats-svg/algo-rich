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
                item.highlight
                  ? "text-primary"
                  : "text-white/70"
              }`}
            >
              {item.value}
            </span>
          </motion.div>
        ))}
      </motion.div>

      {/* Next session teaser */}
      {definition.nextSessionSlug && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="rounded-xl border border-white/[0.04] bg-white/[0.01] p-4 text-center"
        >
          <p className="text-xs text-white/25 mb-1">Up next</p>
          <p className="text-sm text-white/50">
            {definition.nextSessionSlug
              .replace(/-/g, " ")
              .replace(/\b\w/g, (c) => c.toUpperCase())}
          </p>
        </motion.div>
      )}

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="flex flex-col items-center gap-3"
      >
        <button
          onClick={() => onComplete({ score: 0, timeSpent: 0 })}
          className="rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 px-8 py-3
                     text-sm font-semibold text-black shadow-lg shadow-cyan-500/20
                     hover:shadow-cyan-500/30 transition-shadow cursor-pointer"
        >
          Mark Complete
        </button>
        <Link
          href="/dashboard"
          className="text-xs text-white/25 hover:text-white/40 transition-colors"
        >
          Return to Dashboard
        </Link>
      </motion.div>
    </div>
  );
}
