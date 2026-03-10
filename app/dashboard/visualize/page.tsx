"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { getAllWalkthroughs } from "@/lib/guidedWalkthroughs";

const visualizers = [
  {
    type: "tree",
    title: "Binary Search Tree",
    desc: "Insert, delete, search and traverse a BST. Watch operations step by step with animated highlights.",
    icon: "🌳",
    color: "from-emerald-600/20 to-emerald-800/10",
    border: "border-emerald-500/20 hover:border-emerald-400/40",
  },
  {
    type: "array",
    title: "Array & Sorting",
    desc: "Visualize insert, delete, search, and classic sorting algorithms — bubble, selection, insertion sort.",
    icon: "📊",
    color: "from-primary/60/20 to-primary/80/10",
    border: "border-primary/20 hover:border-primary/40",
  },
  {
    type: "linked-list",
    title: "Linked List",
    desc: "Insert at head/tail/index, delete, search with pointer hops, and reverse the list with animations.",
    icon: "🔗",
    color: "from-purple-600/20 to-purple-800/10",
    border: "border-purple-500/20 hover:border-purple-400/40",
  },
  {
    type: "stack-queue",
    title: "Stack & Queue",
    desc: "Push/pop a stack (LIFO) or enqueue/dequeue a queue (FIFO). Includes balanced-parentheses challenge.",
    icon: "📚",
    color: "from-amber-600/20 to-amber-800/10",
    border: "border-amber-500/20 hover:border-amber-400/40",
  },
];

const diffColors: Record<string, string> = {
  beginner: "bg-emerald-500/10 text-emerald-400",
  intermediate: "bg-yellow-500/10 text-yellow-400",
  advanced: "bg-red-500/10 text-red-400",
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const card = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function VisualizePage() {
  const walkthroughs = getAllWalkthroughs();
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch("/api/walkthroughs/progress")
      .then((r) => (r.ok ? r.json() : { completed: [] }))
      .then((data) => setCompleted(new Set(data.completed ?? [])))
      .catch(() => {});
  }, []);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">
          🔬 Interactive Visualizers
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          See how data structures work step by step. Build real intuition before
          writing code.
        </p>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-5"
      >
        {visualizers.map((v) => (
          <motion.div key={v.type} variants={card}>
            <Link href={`/dashboard/visualize/${v.type}`}>
              <div
                className={`group rounded-2xl border bg-gradient-to-br p-6 transition-all duration-300 cursor-pointer ${v.color} ${v.border}`}
              >
                <div className="flex items-start gap-4">
                  <span className="text-4xl">{v.icon}</span>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-bold text-lg text-foreground group-hover:text-white transition-colors">
                      {v.title}
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                      {v.desc}
                    </p>
                  </div>
                  <span className="text-muted-foreground/60 group-hover:text-foreground/60 transition-colors text-xl">
                    →
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Guided Walkthroughs Section */}
      {walkthroughs.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-bold text-foreground mb-1">
            📖 Guided Walkthroughs
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Step-by-step interactive lessons — predict, observe, and build
            intuition.
          </p>
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {walkthroughs.map((wt) => {
              const isDone = completed.has(wt.slug);
              const vizType = visualizers.find(
                (v) =>
                  v.type === wt.visualizerType ||
                  (wt.visualizerType === "stack" && v.type === "stack-queue")
              );
              return (
                <motion.div key={wt.slug} variants={card}>
                  <Link
                    href={`/dashboard/visualize/${vizType?.type ?? wt.visualizerType}?guided=${wt.slug}`}
                  >
                    <div
                      className={`rounded-xl border p-4 transition-all duration-300 cursor-pointer hover:bg-white/[0.04] ${
                        isDone
                          ? "border-emerald-500/20 bg-emerald-500/5"
                          : "border-white/[0.06] bg-white/[0.02]"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-foreground">
                          {isDone && (
                            <span className="text-emerald-400 mr-1.5">✓</span>
                          )}
                          {wt.title}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full ${diffColors[wt.difficulty] || "bg-white/10 text-white/40"}`}
                        >
                          {wt.difficulty}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground/60">
                        {wt.description}
                      </p>
                      <span className="text-[10px] text-muted-foreground/40 mt-2 inline-block">
                        ~{wt.estimatedMinutes} min · {wt.steps.length} steps
                      </span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      )}

      {/* Prediction challenges card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-6"
      >
        <Link href="/dashboard/visualize/tree?tab=challenges">
          <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent p-6 hover:border-primary/40 transition-all duration-300 cursor-pointer">
            <div className="flex items-center gap-4">
              <span className="text-4xl">🧠</span>
              <div>
                <h2 className="font-bold text-lg text-primary">
                  Tree Prediction Challenges
                </h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  30 challenges across 3 difficulty tiers — predict insertions,
                  traversals, deletions, heights, and BST validity.
                </p>
              </div>
              <span className="text-primary/40 text-xl ml-auto">
                →
              </span>
            </div>
          </div>
        </Link>
      </motion.div>
    </div>
  );
}
