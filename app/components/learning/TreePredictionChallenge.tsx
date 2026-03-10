"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  buildTree,
  computeLayout,
  collectNodes,
  getHeight,
  countNodes,
} from "@/lib/treeEngine";
import {
  type TreeChallenge,
  treeChallenges,
  getChallengesByDifficulty,
} from "@/lib/treeChallenges";
import { triggerSuccessConfetti } from "@/app/components/feedback/Confetti";

/* ── Layout constants ─────────────────────── */
const CANVAS_W = 460;
const CANVAS_H = 260;
const R = 18;

/* ── Colour utilities ─────────────────────── */
const diffColour = {
  beginner: { bg: "bg-emerald-900/40", text: "text-emerald-300", ring: "ring-emerald-500/30" },
  intermediate: { bg: "bg-amber-900/40", text: "text-amber-300", ring: "ring-amber-500/30" },
  advanced: { bg: "bg-rose-900/40", text: "text-rose-300", ring: "ring-rose-500/30" },
};

/* ──────────────────────────────────────────── */
/*  Component                                   */
/* ──────────────────────────────────────────── */

interface Props {
  /** Optional filter — show only one difficulty tier */
  difficulty?: "beginner" | "intermediate" | "advanced";
  /** Called when a challenge is answered (for external tracking) */
  onAnswer?: (challengeId: string, correct: boolean, xp: number) => void;
}

export default function TreePredictionChallenge({ difficulty, onAnswer }: Props) {
  /* ---------- state ---------- */
  const pool = useMemo(() => getChallengesByDifficulty(difficulty), [difficulty]);
  const [idx, setIdx] = useState(0);
  const challenge = pool[idx % pool.length];
  const [input, setInput] = useState("");
  const [verdict, setVerdict] = useState<"correct" | "wrong" | null>(null);
  const [stats, setStats] = useState({ correct: 0, total: 0, xp: 0 });
  const inputRef = useRef<HTMLInputElement>(null);

  /* ---------- tree visual ---------- */
  const { root, nodes, edges, h, n } = useMemo(() => {
    const tree = buildTree(challenge.treeValues);
    if (!tree) return { root: null, nodes: [], edges: [], h: 0, n: 0 };
    computeLayout(tree, CANVAS_W);
    const allNodes = collectNodes(tree);
    const edgeList: { x1: number; y1: number; x2: number; y2: number }[] = [];
    function walk(node: typeof tree) {
      if (!node) return;
      if (node.left) {
        edgeList.push({ x1: node.x, y1: node.y, x2: node.left.x, y2: node.left.y });
        walk(node.left);
      }
      if (node.right) {
        edgeList.push({ x1: node.x, y1: node.y, x2: node.right.x, y2: node.right.y });
        walk(node.right);
      }
    }
    walk(tree);
    return { root: tree, nodes: allNodes, edges: edgeList, h: getHeight(tree), n: countNodes(tree) };
  }, [challenge]);

  /* ---------- answer logic ---------- */
  const checkAnswer = useCallback(() => {
    if (!input.trim()) return;
    const raw = input.trim().toLowerCase();
    let correct = false;

    if (Array.isArray(challenge.correctAnswer)) {
      // parse comma-separated
      const parsed = raw.split(",").map((s) => Number(s.trim())).filter((n) => !isNaN(n));
      correct =
        parsed.length === challenge.correctAnswer.length &&
        parsed.every((v, i) => v === (challenge.correctAnswer as number[])[i]);
    } else if (typeof challenge.correctAnswer === "boolean") {
      correct =
        (raw === "true" || raw === "yes") === challenge.correctAnswer ||
        (raw === "false" || raw === "no") === !challenge.correctAnswer;
    } else if (typeof challenge.correctAnswer === "number") {
      if (challenge.correctAnswer === -1) {
        correct = raw === "none" || raw === "nothing" || raw === "empty" || raw === "-1";
      } else {
        correct = Number(raw) === challenge.correctAnswer;
      }
    }

    setVerdict(correct ? "correct" : "wrong");
    setStats((s) => ({
      correct: s.correct + (correct ? 1 : 0),
      total: s.total + 1,
      xp: s.xp + (correct ? challenge.xpReward : 0),
    }));
    if (correct) triggerSuccessConfetti();
    onAnswer?.(challenge.id, correct, correct ? challenge.xpReward : 0);
  }, [input, challenge, onAnswer]);

  const nextChallenge = useCallback(() => {
    setIdx((i) => i + 1);
    setInput("");
    setVerdict(null);
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  /* key shortcut */
  const handleKey = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        if (verdict) nextChallenge();
        else checkAnswer();
      }
    },
    [verdict, checkAnswer, nextChallenge]
  );

  /* ---------- hint text ---------- */
  const hintText = useMemo(() => {
    if (challenge.type === "traversal-order") return "Enter comma-separated values (e.g. 5,10,15)";
    if (challenge.type === "valid-bst") return "Enter true or false";
    if (challenge.type === "deletion-result" && challenge.correctAnswer === -1) return "Enter the replacement node value, or 'none'";
    return "Enter a number";
  }, [challenge]);

  /* ---------- render ---------- */
  const dc = diffColour[challenge.difficulty];
  const progress = pool.length > 0 ? ((idx % pool.length) + 1) : 0;

  return (
    <div className="flex flex-col gap-4 w-full max-w-xl mx-auto">
      {/* header bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-0.5 rounded-full ${dc.bg} ${dc.text} ring-1 ${dc.ring}`}>
            {challenge.difficulty}
          </span>
          <span className="text-xs text-muted-foreground">
            {progress} / {pool.length}
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span>✅ {stats.correct}/{stats.total}</span>
          <span className="text-primary">⭐ {stats.xp} XP</span>
        </div>
      </div>

      {/* tree SVG */}
      <div className="rounded-xl bg-background border border-white/10 overflow-hidden">
        <svg viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`} className="w-full h-auto">
          {/* edges */}
          {edges.map((e, i) => (
            <line
              key={i}
              x1={e.x1}
              y1={e.y1}
              x2={e.x2}
              y2={e.y2}
              stroke="rgba(255,255,255,0.18)"
              strokeWidth={1.5}
            />
          ))}
          {/* nodes */}
          {nodes.map((node) => (
            <g key={node.id}>
              <circle cx={node.x} cy={node.y} r={R} fill="rgba(30, 58, 95, 0.8)" stroke="rgba(212,175,55,0.5)" strokeWidth={1.5} />
              <text x={node.x} y={node.y + 4} textAnchor="middle" fill="white" fontSize={12} fontWeight={600}>
                {node.value}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* question */}
      <p className="text-sm text-foreground font-medium leading-relaxed">
        {challenge.question}
      </p>

      {/* input */}
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          disabled={verdict !== null}
          placeholder={hintText}
          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 disabled:opacity-50 transition-colors"
        />
        {verdict === null ? (
          <button
            onClick={checkAnswer}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-primary text-background hover:bg-primary/80 transition-colors"
          >
            Check
          </button>
        ) : (
          <button
            onClick={nextChallenge}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            Next →
          </button>
        )}
      </div>

      {/* verdict */}
      <AnimatePresence mode="wait">
        {verdict && (
          <motion.div
            key={verdict}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className={`rounded-lg p-3 text-sm ${
              verdict === "correct"
                ? "bg-emerald-900/30 border border-emerald-500/30 text-emerald-300"
                : "bg-rose-900/30 border border-rose-500/30 text-rose-300"
            }`}
          >
            <div className="font-semibold mb-1">
              {verdict === "correct" ? "🎉 Correct!" : "❌ Not quite"}
              {verdict === "correct" && (
                <span className="ml-2 text-primary">+{challenge.xpReward} XP</span>
              )}
            </div>
            <p className="text-xs opacity-80">{challenge.explanation}</p>
            {verdict === "wrong" && (
              <p className="text-xs mt-1 opacity-60">
                Answer:{" "}
                <span className="font-mono text-white/70">
                  {Array.isArray(challenge.correctAnswer)
                    ? challenge.correctAnswer.join(", ")
                    : challenge.correctAnswer === -1
                    ? "none"
                    : String(challenge.correctAnswer)}
                </span>
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
