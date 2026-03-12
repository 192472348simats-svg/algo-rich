"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Clock, Brain, RotateCcw, Zap, Trophy } from "lucide-react";
import ReviewSession from "@/app/components/review/ReviewSession";

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

interface ReviewStats {
  totalEnrolled: number;
  dueNow: number;
  dueToday: number;
  averageEase: number;
  masteredCount: number;
}

// ── Component ────────────────────────────────────────────

export default function ReviewQueue({ userId }: { userId: string }) {
  const [reviews, setReviews] = useState<ReviewProblem[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionActive, setSessionActive] = useState(false);

  const fetchReviews = useCallback(async () => {
    try {
      const res = await fetch("/api/reviews");
      if (res.ok) {
        const data = await res.json();
        setReviews(data.dueReviews);
        setStats(data.stats);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // After session ends, refresh the list
  const handleSessionComplete = () => {
    setSessionActive(false);
    setLoading(true);
    fetchReviews();
  };

  if (sessionActive && reviews.length > 0) {
    return (
      <ReviewSession
        reviews={reviews}
        userId={userId}
        onComplete={handleSessionComplete}
      />
    );
  }

  const difficultyColor = (d: string) => {
    switch (d) {
      case "easy":
        return "text-emerald-400 bg-emerald-400/10";
      case "medium":
        return "text-yellow-400 bg-yellow-400/10";
      case "hard":
        return "text-red-400 bg-red-400/10";
      default:
        return "text-gray-400 bg-gray-400/10";
    }
  };

  const intervalLabel = (days: number) => {
    if (days < 1) return "< 1 day";
    if (days === 1) return "1 day";
    if (days < 7) return `${days} days`;
    if (days < 30) return `${Math.round(days / 7)}w`;
    return `${Math.round(days / 30)}mo`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto"
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/dashboard"
          className="p-2 rounded-lg bg-navy-light/30 text-white/50 hover:text-white hover:bg-navy-light/50 transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Brain className="text-purple-400" size={24} />
            Re-Solve Review Queue
          </h1>
          <p className="text-gray-light/50 text-sm mt-1">
            Strengthen your memory by re-solving problems at optimal intervals
          </p>
        </div>
      </div>

      {/* Stats Row */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            {
              label: "Due Now",
              value: stats.dueNow,
              icon: <Clock size={16} className="text-orange-400" />,
              color: "text-orange-400",
            },
            {
              label: "Due Today",
              value: stats.dueToday,
              icon: <RotateCcw size={16} className="text-primary" />,
              color: "text-primary",
            },
            {
              label: "Enrolled",
              value: stats.totalEnrolled,
              icon: <Zap size={16} className="text-purple-400" />,
              color: "text-purple-400",
            },
            {
              label: "Mastered",
              value: stats.masteredCount,
              icon: <Trophy size={16} className="text-gold-primary" />,
              color: "text-gold-primary",
            },
          ].map((s) => (
            <div key={s.label} className="card-pro p-4">
              <div className="flex items-center gap-2 mb-2">
                {s.icon}
                <span className="text-xs text-white/40">{s.label}</span>
              </div>
              <p className={`text-2xl font-bold font-mono ${s.color}`}>
                {s.value}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Start Session Button */}
      {reviews.length > 0 && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setSessionActive(true)}
          className="w-full mb-8 py-4 bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-bold rounded-xl text-lg hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300"
        >
          Start Review Session — {reviews.length} problem
          {reviews.length !== 1 ? "s" : ""} due
        </motion.button>
      )}

      {/* Loading State */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-20 bg-navy-light/20 rounded-xl animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && reviews.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-pro p-12 text-center"
        >
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-xl font-bold text-white mb-2">
            {stats && stats.totalEnrolled > 0
              ? "All caught up!"
              : "No problems to review yet"}
          </h2>
          <p className="text-gray-light/50 text-sm max-w-md mx-auto">
            {stats && stats.totalEnrolled > 0
              ? "You've reviewed all due problems. Come back later when more are scheduled."
              : "Solve problems in the practice section — they'll automatically appear here for review."}
          </p>
          <Link href="/dashboard/practice">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-6 px-6 py-2.5 bg-gold-primary/15 border border-gold-primary/30 text-gold-primary font-semibold rounded-lg hover:bg-gold-primary/25 transition-all duration-300"
            >
              Go to Practice
            </motion.button>
          </Link>
        </motion.div>
      )}

      {/* Due Problems List */}
      <AnimatePresence>
        {!loading && reviews.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            <h3 className="text-sm font-medium text-white/30 uppercase tracking-wider mb-3">
              Due for Review
            </h3>
            {reviews.map((review, idx) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="card-pro p-4 flex items-center gap-4"
              >
                {/* Number */}
                <span className="text-sm text-white/20 font-mono w-6 text-center flex-shrink-0">
                  {idx + 1}
                </span>

                {/* Problem info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {review.problem?.title ?? "Untitled"}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${difficultyColor(
                        review.problem?.difficulty ?? ""
                      )}`}
                    >
                      {review.problem?.difficulty ?? ""}
                    </span>
                    {review.problem?.pattern && (
                      <span className="text-xs text-white/20">
                        {review.problem.pattern}
                      </span>
                    )}
                  </div>
                </div>

                {/* Review metadata */}
                <div className="flex items-center gap-4 text-xs text-white/30 flex-shrink-0">
                  <span title="Times reviewed">
                    ×{review.totalReviews}
                  </span>
                  <span title="Current interval">
                    {intervalLabel(review.interval)}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
