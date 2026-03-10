"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Brain,
  Clock,
  CheckCircle2,
  Eye,
  EyeOff,
  Trophy,
} from "lucide-react";
import dynamic from "next/dynamic";
import PostSolveReflection from "@/app/components/practice/PostSolveReflection";

const EmbeddedProblemSolver = dynamic(
  () => import("@/app/components/plan/EmbeddedProblemSolver"),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
      </div>
    ),
  }
);

// ── Types ────────────────────────────────────────────────

interface ReviewProblem {
  id: string;
  userId: string;
  problemId: string;
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReviewAt: string;
  lastRating: number | null;
  totalReviews: number;
  lastReviewedAt: string | null;
  problem: {
    id: string;
    slug: string;
    title: string;
    difficulty: string;
    pattern: string | null;
    topics: string | null;
  };
}

interface ReviewResult {
  problemId: string;
  title: string;
  rating: number;
  nextInterval: number;
}

type SessionPhase = "intro" | "solving" | "reflecting" | "rating" | "result";

// Self-rating options
const RATINGS = [
  {
    value: 1,
    label: "Forgot",
    emoji: "😰",
    description: "Couldn't recall the approach",
    color: "from-red-500 to-red-600",
    border: "border-red-500/30",
  },
  {
    value: 2,
    label: "Hard",
    emoji: "😓",
    description: "Struggled but eventually solved",
    color: "from-orange-500 to-orange-600",
    border: "border-orange-500/30",
  },
  {
    value: 3,
    label: "Good",
    emoji: "😊",
    description: "Solved with some thought",
    color: "from-cyan-500 to-cyan-600",
    border: "border-primary/30",
  },
  {
    value: 4,
    label: "Easy",
    emoji: "😎",
    description: "Recalled immediately",
    color: "from-emerald-500 to-emerald-600",
    border: "border-emerald-500/30",
  },
];

// ── Component ────────────────────────────────────────────

export default function ReviewSession({
  reviews,
  userId,
  onComplete,
}: {
  reviews: ReviewProblem[];
  userId: string;
  onComplete: () => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<SessionPhase>("intro");
  const [results, setResults] = useState<ReviewResult[]>([]);
  const [submittingRating, setSubmittingRating] = useState(false);
  const [previousSolution, setPreviousSolution] = useState<string | null>(null);
  const [showPrevSolution, setShowPrevSolution] = useState(false);
  const [loadingPrevSolution, setLoadingPrevSolution] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const solveStartRef = useRef<number>(0);

  // Timer: runs while phase === "solving"
  useEffect(() => {
    if (phase === "solving") {
      solveStartRef.current = Date.now();
      setElapsed(0);
      timerRef.current = setInterval(() => {
        setElapsed(Math.floor((Date.now() - solveStartRef.current) / 1000));
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const current = reviews[currentIndex];
  const total = reviews.length;
  const isLast = currentIndex >= total - 1;

  // Fetch previous solution
  const fetchPreviousSolution = useCallback(async () => {
    if (!current) return;
    setLoadingPrevSolution(true);
    try {
      const res = await fetch(
        `/api/reviews/${current.problemId}/solution`
      );
      if (res.ok) {
        const data = await res.json();
        setPreviousSolution(data.code);
      }
    } catch {
      // ignore
    } finally {
      setLoadingPrevSolution(false);
    }
  }, [current]);

  // When problem is solved, move to reflection phase
  const handleProblemSolved = () => {
    setPhase("reflecting");
  };

  // Submit a self-rating
  const handleRate = async (rating: number) => {
    if (!current || submittingRating) return;
    setSubmittingRating(true);

    try {
      const res = await fetch(`/api/reviews/${current.problemId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, solveTimeSeconds: elapsed }),
      });

      let nextInterval = current.interval;
      if (res.ok) {
        const data = await res.json();
        nextInterval = data.interval;
      }

      setResults((prev) => [
        ...prev,
        {
          problemId: current.problemId,
          title: current.problem.title,
          rating,
          nextInterval,
        },
      ]);

      // Move to next problem or show final results
      if (isLast) {
        setPhase("result");
      } else {
        setCurrentIndex((i) => i + 1);
        setPhase("intro");
        setPreviousSolution(null);
        setShowPrevSolution(false);
      }
    } catch {
      // Allow retry
    } finally {
      setSubmittingRating(false);
    }
  };

  // Skip rating (treat as "Good")
  const handleSkipToNext = () => {
    handleRate(3);
  };

  // ── Render phases ──────────────────────────────────────

  // INTRO: Show problem info before solving
  if (phase === "intro") {
    return (
      <motion.div
        key={`intro-${currentIndex}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="max-w-3xl mx-auto"
      >
        {/* Progress bar */}
        <ProgressBar current={currentIndex} total={total} />

        <div className="card-pro p-8 text-center">
          <div className="text-5xl mb-4">🧠</div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Review #{currentIndex + 1} of {total}
          </h2>
          <p className="text-gray-light/50 mb-6">
            Try to re-solve this problem from memory
          </p>

          <div className="card-pro p-5 mb-6 text-left">
            <h3 className="text-lg font-bold text-white mb-2">
              {current.problem.title}
            </h3>
            <div className="flex items-center gap-3 text-sm">
              <DifficultyBadge difficulty={current.problem.difficulty} />
              {current.problem.pattern && (
                <span className="text-white/30">
                  Pattern: {current.problem.pattern}
                </span>
              )}
              <span className="text-white/20">
                Reviewed {current.totalReviews}×
              </span>
            </div>
          </div>

          {/* Show previous solution toggle */}
          <div className="mb-6">
            {!showPrevSolution ? (
              <button
                onClick={() => {
                  setShowPrevSolution(true);
                  if (!previousSolution) fetchPreviousSolution();
                }}
                className="text-sm text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-2 mx-auto"
              >
                <Eye size={14} />
                Peek at your previous solution
              </button>
            ) : (
              <div className="text-left">
                <button
                  onClick={() => setShowPrevSolution(false)}
                  className="text-sm text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-2 mb-3"
                >
                  <EyeOff size={14} />
                  Hide previous solution
                </button>
                {loadingPrevSolution ? (
                  <div className="bg-navy-dark rounded-lg p-4 text-white/30 text-sm animate-pulse">
                    Loading...
                  </div>
                ) : previousSolution ? (
                  <pre className="bg-navy-dark rounded-lg p-4 text-sm text-white/70 overflow-x-auto font-mono max-h-60 overflow-y-auto whitespace-pre-wrap">
                    {previousSolution}
                  </pre>
                ) : (
                  <p className="text-white/30 text-sm">No previous solution found</p>
                )}
              </div>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setPhase("solving")}
            className="w-full py-4 bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-bold rounded-xl text-lg hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300"
          >
            Start Solving →
          </motion.button>
        </div>
      </motion.div>
    );
  }

  // SOLVING: Full ProblemSolver view
  if (phase === "solving") {
    return (
      <motion.div
        key={`solving-${currentIndex}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPhase("intro")}
              className="p-2 rounded-lg bg-navy-light/30 text-white/50 hover:text-white transition-colors"
            >
              <ArrowLeft size={18} />
            </button>
            <span className="text-sm text-white/30">
              Review {currentIndex + 1}/{total}: {current.problem.title}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-white/50 font-mono flex items-center gap-1.5">
              <Clock size={14} className="text-purple-400" />
              {formatTime(elapsed)}
            </span>
            <button
              onClick={() => setPhase("rating")}
              className="text-sm text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1"
            >
              Skip to rating <ArrowRight size={14} />
            </button>
          </div>
        </div>

        <ProgressBar current={currentIndex} total={total} />

        <EmbeddedProblemSolver
          problemId={current.problemId}
          userId={userId}
          onSolved={handleProblemSolved}
        />
      </motion.div>
    );
  }

  // REFLECTING: Post-solve reflection before rating
  if (phase === "reflecting") {
    return (
      <motion.div
        key={`reflecting-${currentIndex}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <ProgressBar current={currentIndex} total={total} />

        <div className="card-pro p-6">
          <div className="text-center mb-2">
            <p className="text-sm text-white/40">
              {current.problem.title}
            </p>
          </div>

          <PostSolveReflection
            problemId={current.problemId}
            onComplete={() => setPhase("rating")}
            onSkip={() => setPhase("rating")}
          />
        </div>
      </motion.div>
    );
  }

  // RATING: Self-assessment after solving
  if (phase === "rating") {
    return (
      <motion.div
        key={`rating-${currentIndex}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <ProgressBar current={currentIndex} total={total} />

        <div className="card-pro p-8 text-center">
          <div className="text-5xl mb-4">🤔</div>
          <h2 className="text-xl font-bold text-white mb-2">
            How well did you recall?
          </h2>
          <p className="text-gray-light/50 text-sm mb-2">
            {current.problem.title}
          </p>
          <p className="text-white/20 text-xs mb-8">
            Your rating adjusts the spacing — honest ratings improve learning
          </p>

          <div className="grid grid-cols-2 gap-3">
            {RATINGS.map((r) => (
              <motion.button
                key={r.value}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                disabled={submittingRating}
                onClick={() => handleRate(r.value)}
                className={`p-5 rounded-xl border ${r.border} bg-navy-light/20 hover:bg-navy-light/40 transition-all duration-200 text-left disabled:opacity-50`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{r.emoji}</span>
                  <span className="text-white font-bold">{r.label}</span>
                </div>
                <p className="text-white/40 text-xs">{r.description}</p>
              </motion.button>
            ))}
          </div>

          <button
            onClick={handleSkipToNext}
            className="mt-4 text-xs text-white/20 hover:text-white/40 transition-colors"
          >
            Skip → rate as &quot;Good&quot;
          </button>
        </div>
      </motion.div>
    );
  }

  // RESULT: Final summary
  return (
    <motion.div
      key="result"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-2xl mx-auto"
    >
      <div className="card-pro p-8 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", bounce: 0.5 }}
          className="text-6xl mb-4"
        >
          🏆
        </motion.div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Review Session Complete!
        </h2>
        <p className="text-gray-light/50 text-sm mb-8">
          You reviewed {results.length} problem{results.length !== 1 ? "s" : ""}
        </p>

        {/* Results list */}
        <div className="space-y-3 mb-8 text-left">
          {results.map((r, idx) => {
            const ratingInfo = RATINGS.find((rt) => rt.value === r.rating);
            return (
              <motion.div
                key={r.problemId}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-center gap-3 p-3 rounded-lg bg-navy-light/20"
              >
                <CheckCircle2
                  size={16}
                  className="text-emerald-400 flex-shrink-0"
                />
                <span className="text-sm text-white flex-1 truncate">
                  {r.title}
                </span>
                <span className="text-lg flex-shrink-0">
                  {ratingInfo?.emoji}
                </span>
                <span className="text-xs text-white/30 flex-shrink-0 w-16 text-right">
                  <Clock size={10} className="inline mr-1" />
                  {intervalLabel(r.nextInterval)}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* Stats summary */}
        <div className="flex justify-center gap-6 mb-8">
          {[
            {
              label: "Avg Rating",
              value:
                results.length > 0
                  ? (
                      results.reduce((s, r) => s + r.rating, 0) /
                      results.length
                    ).toFixed(1)
                  : "—",
              icon: <Brain size={16} className="text-purple-400" />,
            },
            {
              label: "Reviewed",
              value: results.length,
              icon: <Trophy size={16} className="text-gold-primary" />,
            },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                {s.icon}
                <span className="text-xs text-white/30">{s.label}</span>
              </div>
              <span className="text-xl font-bold font-mono text-white">
                {s.value}
              </span>
            </div>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onComplete}
          className="w-full py-4 bg-gradient-to-r from-gold-primary to-gold-light text-navy-dark font-bold rounded-xl text-lg hover:shadow-lg hover:shadow-gold-primary/30 transition-all duration-300"
        >
          Back to Dashboard
        </motion.button>
      </div>
    </motion.div>
  );
}

// ── Helper Components ────────────────────────────────────

function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = total > 0 ? ((current) / total) * 100 : 0;
  return (
    <div className="mb-6">
      <div className="flex justify-between text-xs text-white/20 mb-1">
        <span>
          {current}/{total} reviewed
        </span>
        <span>{Math.round(pct)}%</span>
      </div>
      <div className="h-1.5 bg-navy-light/30 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5 }}
          className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"
        />
      </div>
    </div>
  );
}

function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const colors: Record<string, string> = {
    easy: "text-emerald-400 bg-emerald-400/10",
    medium: "text-yellow-400 bg-yellow-400/10",
    hard: "text-red-400 bg-red-400/10",
  };
  return (
    <span
      className={`text-xs px-2 py-0.5 rounded-full ${
        colors[difficulty] || "text-gray-400 bg-gray-400/10"
      }`}
    >
      {difficulty}
    </span>
  );
}

function intervalLabel(days: number): string {
  if (days < 1) return "< 1d";
  if (days === 1) return "1 day";
  if (days < 7) return `${days}d`;
  if (days < 30) return `${Math.round(days / 7)}w`;
  return `${Math.round(days / 30)}mo`;
}
