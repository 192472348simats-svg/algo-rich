"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import { type Pattern } from "@/lib/patterns/patternDefinitions";
import PatternTemplate from "@/app/components/patterns/PatternTemplate";
import PatternRecognition from "@/app/components/patterns/PatternRecognition";

/* ── Dynamic playground imports (avoid SSR issues) ── */
const TreePlayground = dynamic(
  () => import("@/app/components/visualizations/interactive/TreePlayground"),
  { ssr: false }
);
const ArrayPlayground = dynamic(
  () => import("@/app/components/visualizations/interactive/ArrayPlayground"),
  { ssr: false }
);
const LinkedListPlayground = dynamic(
  () => import("@/app/components/visualizations/interactive/LinkedListPlayground"),
  { ssr: false }
);
const StackQueuePlayground = dynamic(
  () => import("@/app/components/visualizations/interactive/StackQueuePlayground"),
  { ssr: false }
);

/** Map pattern IDs → the interactive playground component to render */
const patternVisualizerMap: Record<string, React.ComponentType> = {
  "two-pointers": ArrayPlayground,
  "sliding-window": ArrayPlayground,
  "fast-slow-pointers": LinkedListPlayground,
  "merge-intervals": ArrayPlayground,
  "cyclic-sort": ArrayPlayground,
  "linked-list-reversal": LinkedListPlayground,
  "tree-bfs": TreePlayground,
  "tree-dfs": TreePlayground,
  "two-heaps": ArrayPlayground,
  "subsets": ArrayPlayground,
  "modified-binary-search": ArrayPlayground,
  "top-k-elements": ArrayPlayground,
  "k-way-merge": ArrayPlayground,
  "topological-sort": TreePlayground,
  "dp-fibonacci": ArrayPlayground,
};

type Tab = "overview" | "template" | "visualize" | "quiz" | "practice";

interface PracticeProblem {
  id: string;
  slug: string;
  title: string;
  difficulty: string;
  solved: boolean;
}

interface PatternDetailContentProps {
  pattern: Pattern;
  progress: {
    status: string;
    visualizationWatched: boolean;
    templateStudied: boolean;
    quizPassed: boolean;
    problemsSolved: number;
  } | null;
  userId: string;
}

const sampleRecognitionProblems: Record<string, { description: string; hints: string[] }> = {
  "two-pointers": {
    description:
      "Given a sorted array of integers and a target, find two numbers that add up to the target. Return their indices.",
    hints: [
      "The array is sorted — you can leverage order",
      "Think about starting from both ends",
    ],
  },
  "sliding-window": {
    description:
      "Given an array of positive integers and a target sum, find the smallest contiguous subarray whose sum is >= target.",
    hints: [
      "You need a contiguous subarray",
      "Expand/contract a range as needed",
    ],
  },
};

export default function PatternDetailContent({
  pattern,
  progress,
  userId,
}: PatternDetailContentProps) {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [practiceProblems, setPracticeProblems] = useState<PracticeProblem[]>([]);
  const [loadingProblems, setLoadingProblems] = useState(false);

  // Load practice problems for this pattern
  useEffect(() => {
    setLoadingProblems(true);
    fetch(`/api/problems?pattern=${pattern.id}`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        const problems = Array.isArray(data) ? data : data.problems ?? [];
        setPracticeProblems(problems);
      })
      .catch(() => {})
      .finally(() => setLoadingProblems(false));
  }, [pattern.id]);

  const tabs: { key: Tab; label: string; done: boolean }[] = [
    { key: "overview", label: "Overview", done: false },
    { key: "visualize", label: "Visualize", done: progress?.visualizationWatched || false },
    { key: "template", label: "Template", done: progress?.templateStudied || false },
    { key: "quiz", label: "Quiz", done: progress?.quizPassed || false },
    { key: "practice", label: "Practice", done: (progress?.problemsSolved || 0) > 0 },
  ];

  const recognitionProblem = sampleRecognitionProblems[pattern.id] || {
    description: `Apply ${pattern.name} to solve a problem efficiently.`,
    hints: ["Think about the key characteristics of this pattern"],
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <span className="text-5xl">{pattern.icon}</span>
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {pattern.name}
          </h1>
          <p className="text-sm text-muted-foreground">
            {pattern.description}
          </p>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-xs text-muted-foreground/70">
              Difficulty:
            </span>
            {Array.from({ length: 5 }, (_, i) => (
              <span
                key={i}
                className={`text-xs ${
                  i < pattern.difficulty ? "text-primary" : "text-background/60"
                }`}
              >
                ●
              </span>
            ))}
            <span className="text-xs text-muted-foreground/60 mx-2">•</span>
            <span className="text-xs text-muted-foreground/70">
              {pattern.complexity.time} / {pattern.complexity.space}
            </span>
          </div>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="flex gap-1 overflow-x-auto pb-1 mb-6 border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors relative ${
              activeTab === tab.key
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground/70"
            }`}
          >
            <span className="flex items-center gap-1.5">
              {tab.done && <span className="text-emerald-400 text-xs">✓</span>}
              {tab.label}
            </span>
            {activeTab === tab.key && (
              <motion.div
                layoutId="patternTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        {activeTab === "overview" && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <div className="card-shiny p-6">
              <div className="mb-4">
                <h2 className="font-bold text-foreground">
                  What is {pattern.name}?
                </h2>
              </div>
              <p className="text-sm text-foreground/70 leading-relaxed mb-4">
                {pattern.description}
              </p>
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-primary">
                  When to Use
                </h3>
                {pattern.whenToUse.map((use, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <span className="text-primary mt-0.5">✦</span>
                    {use}
                  </div>
                ))}
              </div>
            </div>

            {/* Learning path for this pattern */}
            <div className="card-shiny p-6">
              <h2 className="font-bold text-foreground mb-4">
                Learning Path
              </h2>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { step: 1, label: "Watch", tab: "visualize" as Tab, done: progress?.visualizationWatched },
                  { step: 2, label: "Study", tab: "template" as Tab, done: progress?.templateStudied },
                  { step: 3, label: "Quiz", tab: "quiz" as Tab, done: progress?.quizPassed },
                ].map((item) => (
                  <motion.button
                    key={item.step}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setActiveTab(item.tab)}
                    className={`p-4 rounded-xl border text-center transition-colors ${
                      item.done
                        ? "border-emerald-500/40 bg-emerald-500/5"
                        : "border-border bg-card hover:border-primary/40"
                    }`}
                  >
                    <span className="text-2xl block mb-1">
                      {item.done ? "✅" : `${item.step}️⃣`}
                    </span>
                    <span
                      className={`text-sm ${
                        item.done ? "text-emerald-400" : "text-foreground"
                      }`}
                    >
                      {item.label}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "template" && (
          <motion.div
            key="template"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <PatternTemplate
              patternName={pattern.name}
              patternIcon={pattern.icon}
              template={pattern.template}
              whenToUse={pattern.whenToUse}
              complexity={`Time: ${pattern.complexity.time}, Space: ${pattern.complexity.space}`}
              onDoneStudying={() => {
                // Would call API to update progress
              }}
            />
          </motion.div>
        )}

        {activeTab === "visualize" && (
          <motion.div
            key="visualize"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div className="card-shiny p-6">
              <div className="flex items-center gap-3 mb-4">
                <div>
                  <h2 className="font-bold text-foreground">
                    {pattern.name} Visualization
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Watch the algorithm in action
                  </p>
                </div>
              </div>
              {(() => {
                const Playground = patternVisualizerMap[pattern.id];
                if (Playground) return <Playground />;
                return (
                  <div className="space-y-4">
                    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
                      <h3 className="font-semibold text-foreground mb-3">
                        How {pattern.name} Works
                      </h3>
                      <div className="space-y-3">
                        {pattern.whenToUse.map((step, i) => (
                          <div key={i} className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500/10 text-cyan-400 text-xs flex items-center justify-center font-bold">
                              {i + 1}
                            </span>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {step}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
                      <h3 className="text-sm font-semibold text-foreground mb-2">
                        Complexity
                      </h3>
                      <div className="flex gap-4">
                        <div>
                          <span className="text-[10px] text-white/30 uppercase">Time</span>
                          <p className="text-sm text-cyan-400 font-mono">{pattern.complexity.time}</p>
                        </div>
                        <div>
                          <span className="text-[10px] text-white/30 uppercase">Space</span>
                          <p className="text-sm text-cyan-400 font-mono">{pattern.complexity.space}</p>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-center text-white/20">
                      Use the Visualize hub for a full interactive playground
                    </p>
                  </div>
                );
              })()}
            </div>
          </motion.div>
        )}

        {activeTab === "quiz" && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <PatternRecognition
              problemDescription={recognitionProblem.description}
              correctPatternId={pattern.id}
              hints={recognitionProblem.hints}
              onResult={(correct, time) => {
                // Save quiz result to server
                fetch(`/api/patterns/${pattern.id}/quiz`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ correct, timeSpent: Math.round(time / 1000) }),
                }).catch(() => {});
                // Also update pattern progress
                if (correct) {
                  fetch(`/api/patterns/${pattern.id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ quizPassed: true }),
                  }).catch(() => {});
                }
              }}
            />
          </motion.div>
        )}

        {activeTab === "practice" && (
          <motion.div
            key="practice"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div className="card-shiny p-6">
              <div className="flex items-center gap-3 mb-4">
                <div>
                  <h2 className="font-bold text-foreground">
                    Practice Problems
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Apply {pattern.name} to real problems
                  </p>
                </div>
              </div>
              {loadingProblems ? (
                <p className="text-sm text-white/30 text-center py-8">Loading problems...</p>
              ) : practiceProblems.length > 0 ? (
                <div className="space-y-2">
                  {practiceProblems.map((prob) => (
                    <Link
                      key={prob.id}
                      href={`/dashboard/practice/${prob.slug}`}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] transition-colors group"
                    >
                      <span className={`text-xs ${prob.solved ? 'text-emerald-400' : 'text-white/20'}`}>
                        {prob.solved ? '✓' : '○'}
                      </span>
                      <span className={`flex-1 text-sm ${prob.solved ? 'text-white/40 line-through' : 'text-white/70 group-hover:text-white'}`}>
                        {prob.title}
                      </span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
                        prob.difficulty === 'easy' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                        : prob.difficulty === 'medium' ? 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
                        : 'text-red-400 bg-red-500/10 border-red-500/20'
                      }`}>
                        {prob.difficulty}
                      </span>
                    </Link>
                  ))}
                  <p className="text-xs text-white/20 text-center mt-3">
                    {practiceProblems.filter(p => p.solved).length}/{practiceProblems.length} solved
                  </p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground/70 text-center py-8">
                  No practice problems linked to this pattern yet.
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
