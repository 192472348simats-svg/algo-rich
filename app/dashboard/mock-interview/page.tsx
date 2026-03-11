"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface MockProblem {
  id: string;
  title: string;
  difficulty: string;
  description: string;
  examples: string;
  constraints: string;
  patternTags: string;
  slug: string;
}

type Phase = "setup" | "in-progress" | "result";

const INTERVIEW_MINUTES = 45;

export default function MockInterviewPage() {
  const [phase, setPhase] = useState<Phase>("setup");
  const [problem, setProblem] = useState<MockProblem | null>(null);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(INTERVIEW_MINUTES * 60);
  const [passed, setPassed] = useState<boolean | null>(null);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  async function startInterview() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/mock-interview");
      if (!res.ok) throw new Error("Failed to load problem");
      const data = await res.json();
      if (!data.problem) throw new Error("No problems available");
      setProblem(data.problem);
      setTimeLeft(INTERVIEW_MINUTES * 60);
      startTimeRef.current = Date.now();
      setPhase("in-progress");
      timerRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            clearInterval(timerRef.current!);
            setPhase("result");
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to start");
    } finally {
      setLoading(false);
    }
  }

  function endInterview(didPass: boolean) {
    if (timerRef.current) clearInterval(timerRef.current);
    setPassed(didPass);
    setPhase("result");
  }

  async function submitResult() {
    if (!problem || passed === null) return;
    setSubmitting(true);
    const timeTaken = Math.round((Date.now() - startTimeRef.current) / 1000);
    await fetch("/api/mock-interview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ problemId: problem.id, passed, timeTakenSeconds: timeTaken, notes }),
    });
    setSubmitting(false);
    // Reset for another attempt
    setProblem(null);
    setPassed(null);
    setNotes("");
    setPhase("setup");
  }

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isUrgent = timeLeft <= 300; // 5 min warning

  const difficultyColor = problem?.difficulty === "Hard"
    ? "text-red-400 border-red-400/30 bg-red-400/10"
    : "text-yellow-400 border-yellow-400/30 bg-yellow-400/10";

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/dashboard" className="text-sm text-white/50 hover:text-white/80 transition-colors">
          ← Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-white mt-2">🎯 Mock Interview</h1>
        <p className="text-white/50 text-sm mt-1">Simulate a real coding interview — {INTERVIEW_MINUTES} minutes, no hints.</p>
      </div>

      <AnimatePresence mode="wait">
        {phase === "setup" && (
          <motion.div
            key="setup"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center"
          >
            <div className="text-6xl mb-4">🧠</div>
            <h2 className="text-xl font-bold text-white mb-2">Ready to Test Yourself?</h2>
            <p className="text-white/50 mb-8 max-w-md mx-auto">
              You&apos;ll receive a random Medium or Hard problem and have {INTERVIEW_MINUTES} minutes to solve it — no hints, no solutions.
            </p>
            <div className="grid grid-cols-3 gap-4 mb-8 max-w-sm mx-auto text-sm">
              <div className="bg-white/5 rounded-xl p-3">
                <div className="text-2xl mb-1">⏱️</div>
                <div className="text-white font-semibold">{INTERVIEW_MINUTES} min</div>
                <div className="text-white/40 text-xs">Time limit</div>
              </div>
              <div className="bg-white/5 rounded-xl p-3">
                <div className="text-2xl mb-1">🚫</div>
                <div className="text-white font-semibold">No hints</div>
                <div className="text-white/40 text-xs">Pure skill</div>
              </div>
              <div className="bg-white/5 rounded-xl p-3">
                <div className="text-2xl mb-1">📊</div>
                <div className="text-white font-semibold">Tracked</div>
                <div className="text-white/40 text-xs">Saved result</div>
              </div>
            </div>
            {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
            <button
              onClick={startInterview}
              disabled={loading}
              className="px-8 py-3 bg-[#E5A829] text-[#0A0F24] font-bold rounded-xl hover:bg-[#E5A829]/90 transition-all disabled:opacity-50"
            >
              {loading ? "Loading..." : "Start Interview →"}
            </button>
          </motion.div>
        )}

        {phase === "in-progress" && problem && (
          <motion.div
            key="in-progress"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="space-y-4"
          >
            {/* Timer bar */}
            <div className={`flex items-center justify-between p-4 rounded-xl border ${isUrgent ? "bg-red-500/10 border-red-500/30" : "bg-white/5 border-white/10"}`}>
              <span className="text-white/60 text-sm">Time Remaining</span>
              <span className={`font-mono text-2xl font-bold ${isUrgent ? "text-red-400" : "text-[#E5A829]"}`}>
                {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => endInterview(true)}
                  className="px-3 py-1.5 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-lg text-sm font-medium hover:bg-emerald-500/30 transition-all"
                >
                  ✓ Solved it
                </button>
                <button
                  onClick={() => endInterview(false)}
                  className="px-3 py-1.5 bg-white/5 border border-white/10 text-white/50 rounded-lg text-sm hover:bg-white/10 transition-all"
                >
                  Give up
                </button>
              </div>
            </div>

            {/* Problem */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <h2 className="text-xl font-bold text-white">{problem.title}</h2>
                <span className={`text-xs px-2 py-1 rounded-lg border flex-shrink-0 ${difficultyColor}`}>
                  {problem.difficulty}
                </span>
              </div>
              <div className="prose prose-invert prose-sm max-w-none">
                <p className="text-white/80 whitespace-pre-wrap text-sm leading-relaxed">{problem.description}</p>
                {problem.examples && (
                  <div className="mt-4">
                    <h3 className="text-white font-semibold text-sm mb-2">Examples</h3>
                    <pre className="bg-black/30 rounded-lg p-3 text-xs text-white/70 overflow-x-auto whitespace-pre-wrap">{problem.examples}</pre>
                  </div>
                )}
                {problem.constraints && (
                  <div className="mt-4">
                    <h3 className="text-white font-semibold text-sm mb-2">Constraints</h3>
                    <pre className="bg-black/30 rounded-lg p-3 text-xs text-white/70 overflow-x-auto whitespace-pre-wrap">{problem.constraints}</pre>
                  </div>
                )}
              </div>
              <div className="mt-4 pt-4 border-t border-white/5">
                <p className="text-xs text-white/30">
                  Open the problem in the practice editor:{" "}
                  <Link href={`/dashboard/practice/${problem.id}`} target="_blank" className="text-[#E5A829]/70 hover:text-[#E5A829] underline">
                    {problem.title} ↗
                  </Link>
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {phase === "result" && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-8"
          >
            <div className="text-center mb-6">
              <div className="text-6xl mb-3">{passed ? "🎉" : timeLeft === 0 ? "⏰" : "💪"}</div>
              <h2 className="text-xl font-bold text-white">
                {passed ? "Interview Passed!" : timeLeft === 0 ? "Time's Up!" : "Interview Complete"}
              </h2>
              <p className="text-white/50 text-sm mt-1">
                {passed
                  ? "Great work — you solved it within the time limit."
                  : timeLeft === 0
                  ? "The timer ran out. Review the solution and try again."
                  : "Keep practicing — every attempt builds your skill."}
              </p>
            </div>

            {problem && (
              <div className="bg-white/5 rounded-xl p-4 mb-4">
                <p className="text-white font-medium text-sm">{problem.title}</p>
                <p className="text-white/40 text-xs mt-1">{problem.difficulty}</p>
              </div>
            )}

            <div className="mb-4">
              <label className="text-sm text-white/60 block mb-2">Notes / Reflection (optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="What approach did you try? What would you do differently?"
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white placeholder-white/20 resize-none focus:outline-none focus:border-[#E5A829]/40"
                rows={3}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={submitResult}
                disabled={submitting}
                className="flex-1 py-3 bg-[#E5A829] text-[#0A0F24] font-bold rounded-xl hover:bg-[#E5A829]/90 transition-all disabled:opacity-50"
              >
                {submitting ? "Saving..." : "Save & Try Again"}
              </button>
              {problem && (
                <Link
                  href={`/dashboard/practice/${problem.id}`}
                  className="px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl hover:bg-white/10 transition-all text-sm font-medium flex items-center"
                >
                  Practice this →
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
