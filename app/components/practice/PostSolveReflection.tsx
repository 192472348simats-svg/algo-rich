"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── Types ──────────────────────────────────────────────

interface PostSolveReflectionProps {
  problemId: string;
  submissionId?: string;
  solveTimeSeconds?: number;
  onComplete: () => void;
  onSkip: () => void;
}

interface FeedbackResult {
  patternCorrect: boolean | null;
  timeCorrect: boolean | null;
  spaceCorrect: boolean | null;
  optimizeCorrect: boolean | null;
  correctPattern: string | null;
  correctTimeComplexity: string | null;
  correctSpaceComplexity: string | null;
  isOptimal: boolean | null;
}

type Phase = "input" | "feedback";

// ── Constants ──────────────────────────────────────────

const PATTERNS = [
  "Two Pointers",
  "Sliding Window",
  "Hash Map",
  "Binary Search",
  "BFS/DFS",
  "Dynamic Programming",
  "Greedy",
  "Stack",
  "Queue",
  "Recursion",
  "Linked List",
  "Tree Traversal",
  "Divide & Conquer",
  "Backtracking",
  "Sorting",
  "Math",
];

const TIME_COMPLEXITIES = [
  "O(1)",
  "O(log n)",
  "O(n)",
  "O(n log n)",
  "O(n²)",
  "O(n³)",
  "O(2ⁿ)",
  "O(n!)",
  "O(n·k)",
  "O(n·m)",
  "O(m+n)",
  "O(n·log k)",
];

const SPACE_COMPLEXITIES = [
  "O(1)",
  "O(log n)",
  "O(n)",
  "O(n²)",
  "O(n·m)",
  "O(m+n)",
  "O(k)",
];

// ── Component ──────────────────────────────────────────

export default function PostSolveReflection({
  problemId,
  submissionId,
  solveTimeSeconds,
  onComplete,
  onSkip,
}: PostSolveReflectionProps) {
  const [phase, setPhase] = useState<Phase>("input");
  const [selectedPattern, setSelectedPattern] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedSpace, setSelectedSpace] = useState<string>("");
  const [canOptimize, setCanOptimize] = useState<string>("");
  const [explanation, setExplanation] = useState<string>("");
  const [feedback, setFeedback] = useState<FeedbackResult | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!selectedPattern || !selectedTime || !selectedSpace) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/reflections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problemId,
          submissionId,
          patternUsed: selectedPattern,
          timeComplexity: selectedTime,
          spaceComplexity: selectedSpace,
          canOptimize: canOptimize || null,
          approachExplanation: explanation || null,
          solveTimeSeconds,
          skipped: false,
        }),
      });
      const data = await res.json();
      if (data.reflection) {
        setFeedback(data.reflection);
        setPhase("feedback");
      }
    } catch (err) {
      console.error("Reflection submit error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSkip = async () => {
    try {
      await fetch("/api/reflections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problemId,
          submissionId,
          solveTimeSeconds,
          skipped: true,
        }),
      });
    } catch {
      // silent fail on skip
    }
    onSkip();
  };

  const isComplete = selectedPattern && selectedTime && selectedSpace;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-4 rounded-xl border border-primary/30 bg-card/80 backdrop-blur-md overflow-hidden"
    >
      {/* Header */}
      <div className="px-5 py-3 bg-primary/10 border-b border-primary/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">🧠</span>
          <h3 className="text-sm font-semibold text-primary">
            Post-Solve Reflection
          </h3>
        </div>
        {phase === "input" && (
          <button
            onClick={handleSkip}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Skip →
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {phase === "input" ? (
          <InputPhase
            key="input"
            selectedPattern={selectedPattern}
            setSelectedPattern={setSelectedPattern}
            selectedTime={selectedTime}
            setSelectedTime={setSelectedTime}
            selectedSpace={selectedSpace}
            setSelectedSpace={setSelectedSpace}
            canOptimize={canOptimize}
            setCanOptimize={setCanOptimize}
            explanation={explanation}
            setExplanation={setExplanation}
            isComplete={!!isComplete}
            submitting={submitting}
            onSubmit={handleSubmit}
            onSkip={handleSkip}
          />
        ) : (
          <FeedbackPhase
            key="feedback"
            feedback={feedback!}
            userPattern={selectedPattern}
            userTime={selectedTime}
            userSpace={selectedSpace}
            userOptimize={canOptimize}
            onDone={onComplete}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Input Phase ────────────────────────────────────────

function InputPhase({
  selectedPattern,
  setSelectedPattern,
  selectedTime,
  setSelectedTime,
  selectedSpace,
  setSelectedSpace,
  canOptimize,
  setCanOptimize,
  explanation,
  setExplanation,
  isComplete,
  submitting,
  onSubmit,
  onSkip,
}: {
  selectedPattern: string;
  setSelectedPattern: (v: string) => void;
  selectedTime: string;
  setSelectedTime: (v: string) => void;
  selectedSpace: string;
  setSelectedSpace: (v: string) => void;
  canOptimize: string;
  setCanOptimize: (v: string) => void;
  explanation: string;
  setExplanation: (v: string) => void;
  isComplete: boolean;
  submitting: boolean;
  onSubmit: () => void;
  onSkip: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-5 space-y-5 max-h-[65vh] overflow-y-auto"
    >
      {/* Pattern Selection */}
      <div>
        <label className="text-xs font-medium text-[var(--gold-light)] mb-2 block">
          Which pattern did you use? <span className="text-red-400">*</span>
        </label>
        <div className="flex flex-wrap gap-1.5">
          {PATTERNS.map((p) => (
            <button
              key={p}
              onClick={() => setSelectedPattern(p)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all duration-200 border ${
                selectedPattern === p
                  ? "bg-primary text-background border-primary"
                  : "bg-background/50 text-foreground/80 border-border/20 hover:border-primary/50"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Time Complexity */}
      <div>
        <label className="text-xs font-medium text-[var(--gold-light)] mb-2 block">
          Time Complexity <span className="text-red-400">*</span>
        </label>
        <div className="flex flex-wrap gap-1.5">
          {TIME_COMPLEXITIES.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTime(t)}
              className={`px-2.5 py-1 rounded-md text-xs font-mono font-medium transition-all duration-200 border ${
                selectedTime === t
                  ? "bg-primary text-background border-primary"
                  : "bg-background/50 text-foreground/80 border-border/20 hover:border-primary/50"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Space Complexity */}
      <div>
        <label className="text-xs font-medium text-[var(--gold-light)] mb-2 block">
          Space Complexity <span className="text-red-400">*</span>
        </label>
        <div className="flex flex-wrap gap-1.5">
          {SPACE_COMPLEXITIES.map((s) => (
            <button
              key={s}
              onClick={() => setSelectedSpace(s)}
              className={`px-2.5 py-1 rounded-md text-xs font-mono font-medium transition-all duration-200 border ${
                selectedSpace === s
                  ? "bg-primary text-background border-primary"
                  : "bg-background/50 text-foreground/80 border-border/20 hover:border-primary/50"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Can Optimize? */}
      <div>
        <label className="text-xs font-medium text-[var(--gold-light)] mb-2 block">
          Can this be optimized further?
        </label>
        <div className="flex gap-2">
          {[
            { value: "yes", label: "Yes, there's a better approach" },
            { value: "no", label: "This is optimal" },
            { value: "unsure", label: "Not sure" },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => setCanOptimize(opt.value)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 border ${
                canOptimize === opt.value
                  ? "bg-primary text-background border-primary"
                  : "bg-background/50 text-foreground/80 border-border/20 hover:border-primary/50"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Explanation */}
      <div>
        <label className="text-xs font-medium text-[var(--gold-light)] mb-2 block">
          Explain your approach{" "}
          <span className="text-muted-foreground">(optional, +5 XP)</span>
        </label>
        <textarea
          value={explanation}
          onChange={(e) => setExplanation(e.target.value)}
          placeholder="Briefly explain how your solution works and why you chose this approach..."
          rows={3}
          className="w-full bg-background/60 border border-border/20 rounded-lg px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/50 resize-none"
        />
        {explanation.length > 0 && (
          <p className="text-[10px] mt-1 text-muted-foreground/70">
            {explanation.length}/20 chars{" "}
            {explanation.length >= 20 ? "✓ +5 XP" : "— needs 20+ for bonus"}
          </p>
        )}
      </div>

      {/* Submit or Skip */}
      <div className="flex gap-3">
        <button
          onClick={onSkip}
          className="flex-1 py-2.5 rounded-lg text-sm font-semibold bg-[var(--gray-light)]/10 text-muted-foreground/80 hover:bg-[var(--gray-light)]/20 hover:text-foreground transition-all duration-200"
        >
          Skip & Continue
        </button>
        <motion.button
          whileHover={isComplete ? { scale: 1.02 } : {}}
          whileTap={isComplete ? { scale: 0.98 } : {}}
          onClick={onSubmit}
          disabled={!isComplete || submitting}
          className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
            isComplete
              ? "bg-primary text-background hover:brightness-110 cursor-pointer"
              : "bg-[var(--gray-light)]/10 text-muted-foreground/60 cursor-not-allowed"
          }`}
        >
          {submitting ? "Analyzing..." : "Submit Reflection"}
        </motion.button>
      </div>
    </motion.div>
  );
}

// ── Feedback Phase ─────────────────────────────────────

function FeedbackPhase({
  feedback,
  userPattern,
  userTime,
  userSpace,
  userOptimize,
  onDone,
}: {
  feedback: FeedbackResult;
  userPattern: string;
  userTime: string;
  userSpace: string;
  userOptimize: string;
  onDone: () => void;
}) {
  const rows = [
    {
      label: "Pattern",
      correct: feedback.patternCorrect,
      userVal: userPattern,
      correctVal: feedback.correctPattern,
    },
    {
      label: "Time Complexity",
      correct: feedback.timeCorrect,
      userVal: userTime,
      correctVal: feedback.correctTimeComplexity,
    },
    {
      label: "Space Complexity",
      correct: feedback.spaceCorrect,
      userVal: userSpace,
      correctVal: feedback.correctSpaceComplexity,
    },
    {
      label: "Optimality",
      correct: feedback.optimizeCorrect,
      userVal:
        userOptimize === "yes"
          ? "Can be optimized"
          : userOptimize === "no"
            ? "Already optimal"
            : "Unsure",
      correctVal: feedback.isOptimal
        ? "Already optimal"
        : "Can be optimized further",
    },
  ];

  const correctCount = rows.filter((r) => r.correct === true).length;
  const answeredCount = rows.filter((r) => r.correct !== null).length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-5 space-y-4"
    >
      {/* Score */}
      <div className="text-center">
        <p className="text-2xl font-bold text-primary">
          {correctCount}/{answeredCount} Correct
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {correctCount === answeredCount
            ? "Perfect analysis! 🎯"
            : correctCount >= answeredCount / 2
              ? "Good analysis — keep refining!"
              : "Keep practicing your analysis skills"}
        </p>
      </div>

      {/* Results Table */}
      <div className="space-y-2">
        {rows.map((row, i) => (
          <motion.div
            key={row.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`flex items-start gap-3 p-3 rounded-lg border ${
              row.correct === true
                ? "border-green-500/30 bg-green-500/5"
                : row.correct === false
                  ? "border-red-500/30 bg-red-500/5"
                  : "border-border/10 bg-background/30"
            }`}
          >
            <span className="text-sm mt-0.5">
              {row.correct === true
                ? "✅"
                : row.correct === false
                  ? "❌"
                  : "⚪"}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground/70">
                {row.label}
              </p>
              <p className="text-sm text-foreground">
                {row.userVal}
              </p>
              {row.correct === false && row.correctVal && (
                <p className="text-xs text-[var(--gold-light)] mt-1">
                  Correct: {row.correctVal}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Done Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onDone}
        className="w-full py-2.5 rounded-lg text-sm font-semibold bg-primary text-background hover:brightness-110 transition-all duration-300"
      >
        Continue
      </motion.button>
    </motion.div>
  );
}
