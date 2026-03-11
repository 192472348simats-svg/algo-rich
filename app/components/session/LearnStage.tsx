"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { LearnConfig } from "@/lib/sessionDefinitions";
import type { StageResult } from "@/app/dashboard/session/[sessionSlug]/SessionPlayer";
import MarkdownContent from "@/app/components/MarkdownContent";

interface Props {
  config: LearnConfig;
  onComplete: (result: StageResult) => void;
}

// ─── Multi-card format (Phase 1) ──────────────────────────────────────────────
function MultiCardLearn({ config, onComplete }: Props) {
  const cards = config.cards!;
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const card = cards[index];

  function goNext() {
    if (index < cards.length - 1) {
      setDirection(1);
      setIndex(index + 1);
    } else {
      onComplete({ score: 0, timeSpent: 0 });
    }
  }

  function goPrev() {
    if (index > 0) {
      setDirection(-1);
      setIndex(index - 1);
    }
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Stage label */}
      <div className="text-center">
        <p className="text-xs uppercase tracking-widest text-white/20 mb-1">Learn</p>
        <h2 className="text-xl font-bold text-white">{config.title}</h2>
      </div>

      {/* Progress dots */}
      <div className="flex justify-center gap-2">
        {cards.map((_, i) => (
          <button
            key={i}
            onClick={() => { setDirection(i > index ? 1 : -1); setIndex(i); }}
            className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
              i === index ? "bg-primary w-6" : i < index ? "bg-primary/40" : "bg-white/10"
            }`}
          />
        ))}
      </div>

      {/* Card */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={index}
          custom={direction}
          initial={{ opacity: 0, x: direction * 60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction * -60 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 space-y-4"
        >
          <h3 className="text-lg font-semibold text-primary">{card.title}</h3>
          <p className="text-sm text-white/70 leading-relaxed whitespace-pre-line">{card.content}</p>
          {card.example && (
            <div className="rounded-xl bg-[#0d1117] border border-white/[0.06] overflow-hidden">
              <div className="px-4 py-2 border-b border-white/[0.04]">
                <span className="text-[11px] text-white/30 uppercase">Example</span>
              </div>
              <pre className="p-4 text-sm text-emerald-300 font-mono overflow-x-auto">
                <code>{card.example}</code>
              </pre>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={goPrev}
          disabled={index === 0}
          className="px-4 py-2 rounded-xl border border-white/[0.06] text-sm text-white/40
                     hover:text-white/70 hover:bg-white/[0.04] disabled:opacity-20 disabled:cursor-not-allowed
                     transition-colors cursor-pointer"
        >
          ← Back
        </button>
        <span className="text-xs text-white/20">{index + 1} / {cards.length}</span>
        <button
          onClick={goNext}
          className="px-5 py-2 rounded-xl bg-primary/20 border border-primary/30 text-sm text-primary
                     hover:bg-primary/30 transition-colors cursor-pointer font-medium"
        >
          {index === cards.length - 1 ? "Got it ✓" : "Next →"}
        </button>
      </div>
    </div>
  );
}

export default function LearnStage({ config, onComplete }: Props) {
  // Always call hooks unconditionally (React rules of hooks)
  const [scrolledToBottom, setScrolledToBottom] = useState(false);

  // Route to multi-card format if Phase 1 cards are present
  if (config.cards && config.cards.length > 0) {
    return <MultiCardLearn config={config} onComplete={onComplete} />;
  }

  function handleScroll(e: React.UIEvent<HTMLDivElement>) {
    const el = e.currentTarget;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 50;
    if (atBottom) setScrolledToBottom(true);
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <p className="text-xs uppercase tracking-widest text-white/20 mb-1">
          Learn
        </p>
        <h2 className="text-xl font-bold text-white">{config.title}</h2>
      </div>

      {/* Key Rule — highlighted box */}
      {config.keyRule && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border border-primary/20 bg-primary/5 px-5 py-4 text-center"
        >
          <span className="text-2xl mr-2">{config.keyRule.emoji}</span>
          <span className="text-sm font-semibold text-primary">
            {config.keyRule.text}
          </span>
        </motion.div>
      )}

      {/* Content — uses existing MarkdownContent component */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        onScroll={handleScroll}
        className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 max-h-[50vh] overflow-y-auto"
      >
        <MarkdownContent content={config.content ?? ""} />
      </motion.div>

      {/* Code Snippet if provided */}
      {config.codeSnippet && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="rounded-xl border border-white/[0.06] bg-[#0d1117] overflow-hidden"
        >
          <div className="px-4 py-2 border-b border-white/[0.04] flex items-center justify-between">
            <span className="text-[11px] text-white/30">
              {config.codeSnippet.caption}
            </span>
            <span className="text-[10px] text-white/15 uppercase">
              {config.codeSnippet.language}
            </span>
          </div>
          <pre className="p-4 text-sm text-white/70 overflow-x-auto">
            <code>{config.codeSnippet.code}</code>
          </pre>
        </motion.div>
      )}

      {/* Continue button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-center"
      >
        <button
          onClick={() => onComplete({ score: 0, timeSpent: 0 })}
          className="rounded-xl bg-white/[0.06] border border-white/[0.06] px-6 py-2.5
                     text-sm text-white/60 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
        >
          Got it →
        </button>
        {!scrolledToBottom && (
          <p className="text-[10px] text-white/15 mt-2">
            Scroll to read the full lesson
          </p>
        )}
      </motion.div>
    </div>
  );
}
