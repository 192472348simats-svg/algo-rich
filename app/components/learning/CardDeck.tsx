"use client";

import { useState, useMemo, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  buildTree,
  computeLayout,
  collectNodes,
} from "@/lib/treeEngine";
import { triggerSuccessConfetti } from "@/app/components/feedback/Confetti";
import { getStreakBonus, XP_REWARDS } from "@/lib/xpSystem";

/* ── Types ─────────────────────────────────── */
export interface DeckCard {
  id: string;
  challengeId?: string;
  type: string;
  topic?: string;
  difficulty: string;
  treeValues?: number[] | null;
  question: string;
  options?: string[] | null;
  visualData?: Record<string, unknown> | null;
  correctAnswer: string | number | number[] | boolean;
  explanation: string;
  xpReward: number;
  reviewId: string | null;
  repetitions: number;
}

interface CardDeckProps {
  cards: DeckCard[];
  onComplete?: (stats: DeckStats) => void;
}

export interface DeckStats {
  total: number;
  correct: number;
  xpEarned: number;
  accuracy: number;
  cardsForTomorrow: number;
}

/* ── Constants ─────────────────────────────── */
const CANVAS_W = 420;
const R = 16;

/* ── Difficulty colours ────────────────────── */
const diffStyles: Record<string, { badge: string; accent: string }> = {
  beginner: { badge: "bg-emerald-900/40 text-emerald-300 ring-emerald-500/30", accent: "text-emerald-400" },
  intermediate: { badge: "bg-amber-900/40 text-amber-300 ring-amber-500/30", accent: "text-amber-400" },
  advanced: { badge: "bg-rose-900/40 text-rose-300 ring-rose-500/30", accent: "text-rose-400" },
};

/* ──────────────────────────────────────────── */
/*  CardDeck                                     */
/* ──────────────────────────────────────────── */
export default function CardDeck({ cards, onComplete }: CardDeckProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [input, setInput] = useState("");
  const [verdict, setVerdict] = useState<"correct" | "wrong" | null>(null);
  const [stats, setStats] = useState({ correct: 0, xp: 0, streak: 0 });
  const [submitting, setSubmitting] = useState(false);
  const [finished, setFinished] = useState(false);
  const [cardsForTomorrow, setCardsForTomorrow] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const startTimeRef = useRef(Date.now());

  const card = cards[currentIdx];
  const total = cards.length;
  const progress = total > 0 ? (currentIdx + (verdict ? 1 : 0)) / total : 0;

  /* ── Tree visual for current card ────────── */
  const isTreeCard = card?.treeValues && card.treeValues.length > 0;
  const isMultipleChoice = card?.options && card.options.length > 0;

  const { nodes, edges } = useMemo(() => {
    if (!card || !isTreeCard) return { nodes: [], edges: [] };
    const tree = buildTree(card.treeValues!);
    if (!tree) return { nodes: [], edges: [] };
    computeLayout(tree, CANVAS_W);
    const allNodes = collectNodes(tree);
    const edgeList: { x1: number; y1: number; x2: number; y2: number }[] = [];
    function walk(n: typeof tree) {
      if (!n) return;
      if (n.left) { edgeList.push({ x1: n.x, y1: n.y, x2: n.left.x, y2: n.left.y }); walk(n.left); }
      if (n.right) { edgeList.push({ x1: n.x, y1: n.y, x2: n.right.x, y2: n.right.y }); walk(n.right); }
    }
    walk(tree);
    return { nodes: allNodes, edges: edgeList };
  }, [card]);

  /* ── Hint text ───────────────────────────── */
  const hintText = useMemo(() => {
    if (!card) return "";
    if (isMultipleChoice) return "Select an option above";
    if (card.type === "traversal-order") return "Comma-separated (e.g. 5,10,15)";
    if (card.type === "valid-bst") return "true or false";
    if (card.type === "predict-output") return "Type the output";
    if (card.type === "deletion-result" && card.correctAnswer === -1) return "Number or 'none'";
    return "Enter your answer";
  }, [card, isMultipleChoice]);

  /* ── Select MC option ────────────────────── */
  const selectOption = useCallback((opt: string) => {
    if (flipped || !card) return;
    setInput(opt);
    // Auto-check on select
    const raw = opt.trim().toLowerCase();
    const answer = String(card.correctAnswer).trim().toLowerCase();
    const correct = raw === answer;

    const newStreak = correct ? stats.streak + 1 : 0;
    const baseXP = correct ? card.xpReward : 0;
    const streakBonus = correct ? getStreakBonus(newStreak) : 0;
    const earnedXP = baseXP + streakBonus;

    setVerdict(correct ? "correct" : "wrong");
    setStats((s) => ({
      correct: s.correct + (correct ? 1 : 0),
      xp: s.xp + earnedXP,
      streak: newStreak,
    }));
    if (correct) triggerSuccessConfetti();
    setFlipped(true);
  }, [card, flipped, stats.streak]);

  /* ── Check answer ────────────────────────── */
  const checkAnswer = useCallback(() => {
    if (!input.trim() || !card) return;
    const raw = input.trim().toLowerCase();
    let correct = false;

    if (Array.isArray(card.correctAnswer)) {
      const parsed = raw.split(",").map((s) => Number(s.trim())).filter((n) => !isNaN(n));
      correct =
        parsed.length === card.correctAnswer.length &&
        parsed.every((v, i) => v === (card.correctAnswer as number[])[i]);
    } else if (typeof card.correctAnswer === "boolean") {
      correct =
        (raw === "true" || raw === "yes") === card.correctAnswer ||
        (raw === "false" || raw === "no") === !card.correctAnswer;
    } else if (typeof card.correctAnswer === "string") {
      correct = raw === card.correctAnswer.trim().toLowerCase();
    } else if (typeof card.correctAnswer === "number") {
      correct = card.correctAnswer === -1
        ? (raw === "none" || raw === "nothing" || raw === "empty" || raw === "-1")
        : Number(raw) === card.correctAnswer;
    }

    const newStreak = correct ? stats.streak + 1 : 0;
    const baseXP = correct ? card.xpReward : 0;
    const streakBonus = correct ? getStreakBonus(newStreak) : 0;
    const earnedXP = baseXP + streakBonus;

    setVerdict(correct ? "correct" : "wrong");
    setStats((s) => ({
      correct: s.correct + (correct ? 1 : 0),
      xp: s.xp + earnedXP,
      streak: newStreak,
    }));

    if (correct) triggerSuccessConfetti();

    // Flip to show answer
    setFlipped(true);
  }, [input, card, stats.streak]);

  /* ── Rate & submit review to API ─────────── */
  const handleRate = useCallback(
    async (quality: 1 | 3 | 5) => {
      if (!card || submitting) return;
      setSubmitting(true);
      const responseTimeMs = Date.now() - startTimeRef.current;

      try {
        await fetch("/api/cards/review", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cardId: card.id,
            correct: verdict === "correct",
            quality,
            responseTimeMs,
          }),
        });
      } catch {
        // silently continue — offline-resilient
      }

      // Move to next card or finish
      const nextIdx = currentIdx + 1;
      if (nextIdx >= total) {
        const accuracy = total > 0 ? Math.round((stats.correct + (verdict === "correct" ? 0 : 0)) / total * 100) : 0;
        setCardsForTomorrow(total); // approximate
        setFinished(true);
        onComplete?.({
          total,
          correct: stats.correct,
          xpEarned: stats.xp,
          accuracy,
          cardsForTomorrow: total,
        });
      } else {
        setCurrentIdx(nextIdx);
        setFlipped(false);
        setVerdict(null);
        setInput("");
        setSubmitting(false);
        startTimeRef.current = Date.now();
        setTimeout(() => inputRef.current?.focus(), 200);
      }
    },
    [card, currentIdx, total, verdict, stats, submitting, onComplete]
  );

  /* ── Key shortcut ────────────────────────── */
  const handleKey = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !flipped) checkAnswer();
    },
    [flipped, checkAnswer]
  );

  /* ── End of deck screen ──────────────────── */
  if (finished || cards.length === 0) {
    const accuracy = total > 0 ? Math.round((stats.correct / total) * 100) : 0;

    if (cards.length === 0) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16"
        >
          <span className="text-5xl block mb-4">🌟</span>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            All Done for Today!
          </h2>
          <p className="text-sm text-muted-foreground">
            No cards due for review. Come back tomorrow!
          </p>
        </motion.div>
      );
    }

    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="text-center max-w-md mx-auto"
      >
        <span className="text-5xl block mb-3">🎉</span>
        <h2 className="text-2xl font-bold text-foreground mb-6">
          Daily Review Complete!
        </h2>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <StatBox label="Reviewed" value={total} icon="📋" />
          <StatBox label="Correct" value={stats.correct} icon="✅" />
          <StatBox label="XP Earned" value={stats.xp} icon="⭐" />
        </div>

        <div className="rounded-xl bg-white/5 border border-white/10 p-4 mb-4">
          <p className="text-sm text-foreground">
            Accuracy:{" "}
            <span className={accuracy >= 80 ? "text-emerald-400" : accuracy >= 50 ? "text-amber-400" : "text-rose-400"}>
              {accuracy}%
            </span>
          </p>
        </div>

        <p className="text-sm text-white/40">
          {cardsForTomorrow} cards scheduled for tomorrow
        </p>
      </motion.div>
    );
  }

  /* ── Card rendering ──────────────────────── */
  const ds = diffStyles[card.difficulty] ?? diffStyles.beginner;

  return (
    <div className="flex flex-col gap-4 w-full max-w-lg mx-auto">
      {/* Progress bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs text-white/50">
          <span>Card {currentIdx + 1} of {total}</span>
          <span className="text-primary">⭐ {stats.xp} XP</span>
        </div>
        <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-primary to-primary/60"
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
        {/* Dots */}
        <div className="flex gap-0.5 justify-center mt-1">
          {cards.map((_, i) => (
            <span
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                i < currentIdx
                  ? "bg-primary"
                  : i === currentIdx
                  ? "bg-white"
                  : "bg-white/15"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Streak indicator */}
      {stats.streak >= 3 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-xs"
        >
          <span className="bg-amber-900/30 border border-amber-500/20 text-amber-300 px-3 py-1 rounded-full">
            🔥 {stats.streak} in a row!
          </span>
        </motion.div>
      )}

      {/* Flippable Card */}
      <div style={{ perspective: 1000 }} className="relative w-full">
        <motion.div
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          style={{ transformStyle: "preserve-3d" }}
          className="relative"
        >
          {/* ─── Front ─── */}
          <div
            style={{ backfaceVisibility: "hidden" }}
            className={`rounded-2xl border border-white/10 bg-gradient-to-b from-[var(--navy-light)] to-[var(--navy-dark)] p-5 ${
              flipped ? "invisible" : ""
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-lg">{isTreeCard ? "🌳" : card.topic === "arrays" ? "📊" : card.topic === "linked-lists" ? "🔗" : card.topic === "stacks" ? "📚" : card.topic === "hash-maps" ? "🗂️" : "💡"}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ring-1 ${ds.badge}`}>
                  {card.difficulty}
                </span>
                {card.topic && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/40">
                    {card.topic}
                  </span>
                )}
              </div>
              <span className="text-xs text-primary">{card.xpReward} XP</span>
            </div>

            {/* Tree SVG — only for tree cards */}
            {isTreeCard && (
              <div className="rounded-xl bg-background border border-white/5 overflow-hidden mb-4">
                <svg viewBox={`0 0 ${CANVAS_W} 220`} className="w-full h-auto">
                  {edges.map((e, i) => (
                    <line key={i} x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} stroke="rgba(255,255,255,0.15)" strokeWidth={1.2} />
                  ))}
                  {nodes.map((n) => (
                    <g key={n.id}>
                      <circle cx={n.x} cy={n.y} r={R} fill="rgba(30,58,95,0.8)" stroke="rgba(212,175,55,0.4)" strokeWidth={1.2} />
                      <text x={n.x} y={n.y + 4} textAnchor="middle" fill="white" fontSize={11} fontWeight={600}>{n.value}</text>
                    </g>
                  ))}
                </svg>
              </div>
            )}

            {/* Question */}
            <p className="text-sm text-foreground font-medium leading-relaxed mb-4 whitespace-pre-line">
              {card.question}
            </p>

            {/* Multiple choice options */}
            {isMultipleChoice ? (
              <div className="grid grid-cols-2 gap-2">
                {card.options!.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => selectOption(opt)}
                    disabled={flipped}
                    className={`p-3 text-sm font-mono rounded-lg border transition-all text-left ${
                      flipped && input === opt
                        ? verdict === "correct"
                          ? "bg-emerald-900/30 border-emerald-500/40 text-emerald-300"
                          : "bg-rose-900/30 border-rose-500/40 text-rose-300"
                        : "bg-white/5 border-white/10 text-white/80 hover:bg-white/10 hover:border-white/20"
                    } disabled:cursor-not-allowed`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            ) : (
              /* Free text input */
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  disabled={flipped}
                  placeholder={hintText}
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 disabled:opacity-50 transition-colors"
                />
                <button
                  onClick={checkAnswer}
                  disabled={flipped || !input.trim()}
                  className="px-4 py-2 text-sm font-medium rounded-lg bg-primary text-background hover:bg-primary/80 transition-colors disabled:opacity-40"
                >
                  Check
                </button>
              </div>
            )}
          </div>

          {/* ─── Back ─── */}
          <div
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
            className={`absolute inset-0 rounded-2xl border border-white/10 bg-gradient-to-b from-[var(--navy-light)] to-[var(--navy-dark)] p-5 overflow-y-auto ${
              !flipped ? "invisible" : ""
            }`}
          >
            {/* Verdict header */}
            <div className="flex items-center justify-between mb-4">
              {verdict === "correct" ? (
                <span className="text-emerald-400 font-bold text-lg">✅ Correct!</span>
              ) : (
                <span className="text-rose-400 font-bold text-lg">❌ Not quite</span>
              )}
              {verdict === "correct" && (
                <span className="text-sm text-primary">+{card.xpReward} XP</span>
              )}
            </div>

            {/* Explanation */}
            <div className={`rounded-lg p-3 mb-4 text-sm ${
              verdict === "correct"
                ? "bg-emerald-900/20 border border-emerald-500/20 text-emerald-200"
                : "bg-rose-900/20 border border-rose-500/20 text-rose-200"
            }`}>
              <p className="opacity-80 leading-relaxed">{card.explanation}</p>
              {verdict === "wrong" && (
                <p className="mt-2 text-xs opacity-60">
                  Correct answer:{" "}
                  <span className="font-mono text-white/70">
                    {Array.isArray(card.correctAnswer)
                      ? card.correctAnswer.join(", ")
                      : card.correctAnswer === -1
                      ? "none"
                      : String(card.correctAnswer)}
                  </span>
                </p>
              )}
            </div>

            {/* Self-rating */}
            <div className="mb-4">
              <p className="text-xs text-white/50 mb-2 text-center">How did you find this?</p>
              <div className="flex gap-2 justify-center">
                <RateBtn label="Easy 😊" quality={5} color="emerald" onClick={handleRate} disabled={submitting} />
                <RateBtn label="Medium 😐" quality={3} color="amber" onClick={handleRate} disabled={submitting} />
                <RateBtn label="Hard 😰" quality={1} color="rose" onClick={handleRate} disabled={submitting} />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ── Sub-components ────────────────────────── */

function RateBtn({
  label,
  quality,
  color,
  onClick,
  disabled,
}: {
  label: string;
  quality: 1 | 3 | 5;
  color: string;
  onClick: (q: 1 | 3 | 5) => void;
  disabled: boolean;
}) {
  const cls: Record<string, string> = {
    emerald: "bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/40 border-emerald-500/20",
    amber: "bg-amber-600/20 text-amber-300 hover:bg-amber-600/40 border-amber-500/20",
    rose: "bg-rose-600/20 text-rose-300 hover:bg-rose-600/40 border-rose-500/20",
  };
  return (
    <button
      onClick={() => onClick(quality)}
      disabled={disabled}
      className={`px-4 py-2 text-xs font-medium rounded-lg border transition-colors disabled:opacity-40 ${cls[color]}`}
    >
      {label}
    </button>
  );
}

function StatBox({ label, value, icon }: { label: string; value: number; icon: string }) {
  return (
    <div className="rounded-xl bg-white/5 border border-white/10 p-3 text-center">
      <span className="text-xl block mb-1">{icon}</span>
      <p className="text-lg font-bold text-foreground">{value}</p>
      <p className="text-[10px] text-white/40 uppercase tracking-wider">{label}</p>
    </div>
  );
}
