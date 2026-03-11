"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { PATTERN_FLOWCHART } from "@/lib/patternFlowchart";

export default function PatternFlowchart() {
  const [currentNodeId, setCurrentNodeId] = useState("start");
  const [history, setHistory] = useState<{ id: string; question: string; answer: "yes" | "no" }[]>([]);

  const isPatternResult = currentNodeId.startsWith("pattern:");
  const patternName = isPatternResult ? currentNodeId.replace("pattern:", "") : null;
  const currentNode = PATTERN_FLOWCHART.find((n) => n.id === currentNodeId);

  const handleAnswer = (answer: "yes" | "no") => {
    if (!currentNode) return;
    const next = answer === "yes" ? currentNode.yes : currentNode.no;
    setHistory((h) => [...h, { id: currentNode.id, question: currentNode.question, answer }]);
    setCurrentNodeId(next);
  };

  const handleReset = () => {
    setCurrentNodeId("start");
    setHistory([]);
  };

  const patternSlugMap: Record<string, string> = {
    "Two Pointers": "two-pointers",
    "Binary Search": "binary-search",
    "Sliding Window": "sliding-window",
    "Prefix Sum": "prefix-sum",
    "DFS": "dfs",
    "BFS": "bfs",
    "HashMap / HashSet": "hash-map",
    "Heap / Priority Queue": "heap",
    "Stack": "stack",
  };

  return (
    <div className="bg-card/50 border border-border rounded-xl p-5 mt-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-base">🤔</span>
          <h3 className="text-sm font-semibold text-foreground">Which pattern should I use?</h3>
        </div>
        {history.length > 0 && (
          <button
            onClick={handleReset}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Start over
          </button>
        )}
      </div>

      {/* Breadcrumb history */}
      {history.length > 0 && (
        <div className="space-y-1 mb-4 border-l-2 border-primary/20 pl-3">
          {history.map((h, i) => (
            <p key={i} className="text-[11px] text-muted-foreground/60">
              <span className="italic">{h.question}</span>
              <span className={`ml-2 font-medium ${h.answer === "yes" ? "text-emerald-400/70" : "text-red-400/70"}`}>
                {h.answer === "yes" ? "✅ Yes" : "❌ No"}
              </span>
            </p>
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        {isPatternResult ? (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
              <p className="text-xs text-muted-foreground mb-1">Suggested pattern:</p>
              <p className="text-lg font-bold text-primary">💡 {patternName}</p>
              <p className="text-xs text-muted-foreground mt-2">
                Based on your answers, this pattern fits best. Recognizing which pattern to apply is the core of DSA mastery.
              </p>
            </div>
            {patternName && patternSlugMap[patternName] && (
              <Link href={`/dashboard/patterns/${patternSlugMap[patternName]}`}>
                <div className="text-xs text-primary hover:underline text-center py-2 rounded-lg border border-primary/20 hover:bg-primary/5 transition-colors cursor-pointer">
                  Practice this pattern →
                </div>
              </Link>
            )}
            <button
              onClick={handleReset}
              className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors py-2"
            >
              ← Try another problem
            </button>
          </motion.div>
        ) : currentNode ? (
          <motion.div
            key={currentNodeId}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            <p className="text-sm font-medium text-foreground leading-relaxed">
              {currentNode.question}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleAnswer("yes")}
                className="flex-1 py-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-medium hover:bg-emerald-500/20 transition-colors"
              >
                ✅ Yes
              </button>
              <button
                onClick={() => handleAnswer("no")}
                className="flex-1 py-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-medium hover:bg-red-500/20 transition-colors"
              >
                ❌ No
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
