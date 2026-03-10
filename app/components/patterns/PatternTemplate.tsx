"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PatternTemplateProps {
  patternName: string;
  patternIcon: string;
  template: string;
  whenToUse: string[];
  complexity: string;
  relatedProblems?: { name: string; difficulty: "Easy" | "Medium" | "Hard" }[];
  onDoneStudying?: () => void;
  className?: string;
}

export default function PatternTemplate({
  patternName,
  patternIcon,
  template,
  whenToUse,
  complexity,
  relatedProblems = [],
  onDoneStudying,
  className = "",
}: PatternTemplateProps) {
  const [activeTab, setActiveTab] = useState<"template" | "when" | "problems">(
    "template"
  );
  const [showAnnotations, setShowAnnotations] = useState(true);

  const codeLines = template.split("\n");

  // Simple annotation detection (lines with # comments)
  const annotations = codeLines.reduce<Record<number, string>>((acc, line, i) => {
    const match = line.match(/#\s*(.+)$/);
    if (match) {
      acc[i] = match[1];
    }
    return acc;
  }, {});

  return (
    <div className={`card-shiny overflow-hidden ${className}`}>
      {/* Header */}
      <div className="p-5 flex items-center justify-between border-b border-border">
        <div className="flex items-center gap-3">
          <div>
            <h3 className="font-bold text-foreground">
              {patternIcon} {patternName} Template
            </h3>
            <p className="text-xs text-muted-foreground">
              Complexity: {complexity}
            </p>
          </div>
        </div>
        {onDoneStudying && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onDoneStudying}
            className="px-4 py-2 rounded-xl text-sm font-semibold"
            style={{
              background: "var(--gradient-gold)",
              color: "hsl(228 100% 7%)",
            }}
          >
            Mark Studied ✓
          </motion.button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        {(
          [
            { key: "template", label: "Code Template" },
            { key: "when", label: "When to Use" },
            { key: "problems", label: `Problems (${relatedProblems.length})` },
          ] as const
        ).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 px-4 py-2.5 text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground/70"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-5">
        <AnimatePresence mode="wait">
          {activeTab === "template" && (
            <motion.div
              key="template"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {/* Toggle annotations */}
              <div className="flex justify-end mb-2">
                <button
                  onClick={() => setShowAnnotations(!showAnnotations)}
                  className="text-xs text-muted-foreground/70 hover:text-muted-foreground transition-colors"
                >
                  {showAnnotations ? "Hide" : "Show"} annotations
                </button>
              </div>

              {/* Code */}
              <div className="rounded-xl bg-background/80 border border-border p-4 overflow-x-auto">
                <pre className="text-sm font-mono leading-relaxed">
                  {codeLines.map((line, i) => {
                    const hasAnnotation = annotations[i];
                    const cleanLine = hasAnnotation
                      ? line.replace(/#\s*.+$/, "")
                      : line;

                    return (
                      <div key={i} className="flex group">
                        <span className="text-muted-foreground/40 mr-3 w-5 text-right select-none flex-shrink-0">
                          {i + 1}
                        </span>
                        <span className="text-foreground/80 flex-1">
                          {cleanLine}
                          {hasAnnotation && showAnnotations && (
                            <span className="text-primary/60 ml-2">
                              # {annotations[i]}
                            </span>
                          )}
                        </span>
                      </div>
                    );
                  })}
                </pre>
              </div>
            </motion.div>
          )}

          {activeTab === "when" && (
            <motion.div
              key="when"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              <p className="text-sm text-muted-foreground mb-3">
                Use {patternName} when you encounter these patterns:
              </p>
              {whenToUse.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-3 p-3 rounded-lg bg-card border border-border"
                >
                  <span className="text-primary mt-0.5">✦</span>
                  <span className="text-sm text-foreground/80">
                    {item}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === "problems" && (
            <motion.div
              key="problems"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-2"
            >
              {relatedProblems.length === 0 ? (
                <p className="text-sm text-muted-foreground/70 text-center py-8 italic">
                  No problems linked yet
                </p>
              ) : (
                relatedProblems.map((prob, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-lg bg-card border border-border"
                  >
                    <span className="text-sm text-foreground">
                      {prob.name}
                    </span>
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        prob.difficulty === "Easy"
                          ? "text-emerald-400 bg-emerald-500/20"
                          : prob.difficulty === "Medium"
                          ? "text-primary bg-primary/20"
                          : "text-red-400 bg-red-500/20"
                      }`}
                    >
                      {prob.difficulty}
                    </span>
                  </div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
