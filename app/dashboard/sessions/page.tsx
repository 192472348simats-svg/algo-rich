"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  getAllSessionDefinitions,
  type SessionDefinition,
} from "@/lib/sessionDefinitions";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const card = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const topicIcons: Record<string, string> = {
  trees: "🌳",
  arrays: "📊",
  "linked-lists": "🔗",
  stacks: "📚",
  sorting: "🔢",
  graphs: "🌐",
};

export default function SessionsPage() {
  const definitions = getAllSessionDefinitions();
  const [progressMap, setProgressMap] = useState<
    Record<string, { completed: boolean; currentStage: number; totalXP: number }>
  >({});

  useEffect(() => {
    fetch("/api/sessions")
      .then((r) => (r.ok ? r.json() : { progress: {} }))
      .then((data) => setProgressMap(data.progress ?? {}))
      .catch(() => {});
  }, []);

  // Group by topic
  const byTopic = definitions.reduce<Record<string, SessionDefinition[]>>(
    (acc, s) => {
      (acc[s.topic] ??= []).push(s);
      return acc;
    },
    {}
  );

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          🎯 Learning Sessions
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Guided, multi-stage lessons — watch, predict, learn, code, and
          reflect.
        </p>
      </div>

      {Object.entries(byTopic).map(([topic, sessions]) => (
        <div key={topic} className="mb-10">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <span>{topicIcons[topic] ?? "📘"}</span>
            {topic.charAt(0).toUpperCase() + topic.slice(1)}
          </h2>

          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {sessions.map((sess) => {
              const prog = progressMap[sess.slug];
              const isDone = prog?.completed ?? false;
              const stagesDone = prog?.currentStage ?? 0;
              const progressPct = Math.round(
                (stagesDone / sess.stages.length) * 100
              );

              return (
                <motion.div key={sess.slug} variants={card}>
                  <Link href={`/dashboard/session/${sess.slug}`}>
                    <div
                      className={`group rounded-2xl border p-5 transition-all duration-300 cursor-pointer hover:bg-white/[0.04] ${
                        isDone
                          ? "border-emerald-500/20 bg-emerald-500/5"
                          : prog
                            ? "border-primary/20 bg-primary/5"
                            : "border-white/[0.06] bg-white/[0.02]"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold text-foreground group-hover:text-white transition-colors">
                          {isDone && (
                            <span className="text-emerald-400 mr-1.5">✓</span>
                          )}
                          {sess.title}
                        </h3>
                        <span className="text-xs text-muted-foreground/60 whitespace-nowrap">
                          ~{sess.estimatedMinutes} min
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                        {sess.description}
                      </p>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              isDone
                                ? "bg-emerald-400"
                                : "bg-primary"
                            }`}
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-muted-foreground/60">
                          {stagesDone}/{sess.stages.length} stages
                        </span>
                        <span className="text-[10px] text-purple-400/50">
                          {sess.xpTotal} XP
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      ))}

      {definitions.length === 0 && (
        <div className="text-center py-16">
          <p className="text-4xl mb-4">🎯</p>
          <p className="text-sm text-muted-foreground/60">
            No sessions available yet. Check back soon!
          </p>
        </div>
      )}
    </div>
  );
}
