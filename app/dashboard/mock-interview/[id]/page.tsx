"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import { usePyodide, type TestCase, type ExecutionResult } from "@/app/components/CodeExecutor";

export const dynamic_page = "force-dynamic";

const CodeEditor = dynamic(() => import("@/app/components/CodeEditor"), { ssr: false });

interface Problem {
  id: string;
  title: string;
  difficulty: string;
  description: string;
  examples?: string | null;
  constraints?: string | null;
  starterCode: string;
  testCases: Array<{ input: Record<string, unknown> | string; expectedOutput: unknown }>;
  pattern?: string | null;
}

interface InterviewSession {
  id: string;
  company: string;
  difficulty: string;
  timeLimitMins: number;
  status: string;
  remainingMs: number;
}

const DIFFICULTY_COLOR: Record<string, string> = {
  Easy: "#4ade80",
  Medium: "#E5A829",
  Hard: "#f87171",
};

function formatTime(ms: number): string {
  if (ms <= 0) return "0:00";
  const totalSecs = Math.floor(ms / 1000);
  const mins = Math.floor(totalSecs / 60);
  const secs = totalSecs % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function ActiveInterviewPage() {
  const params = useParams<{ id: string }>();
  const sessionId = params.id;
  const router = useRouter();

  const [session, setSession] = useState<InterviewSession | null>(null);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [activeProblemIdx, setActiveProblemIdx] = useState(0);
  const [codes, setCodes] = useState<Record<string, string>>({});
  const [results, setResults] = useState<Record<string, ExecutionResult | null>>({});
  const [remainingMs, setRemainingMs] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const autoSubmitFired = useRef(false);

  const { status: pyStatus, runCode } = usePyodide();

  // ── Load session ────────────────────────────────────────────────────────────
  useEffect(() => {
    fetch(`/api/mock-interview/${sessionId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) { setError(data.error); setLoading(false); return; }
        setSession(data.session);
        setProblems(data.problems ?? []);
        setRemainingMs(data.session.remainingMs);
        // Init code from localStorage or starterCode
        const initialCodes: Record<string, string> = {};
        for (const p of data.problems ?? []) {
          const saved = typeof window !== "undefined" ? localStorage.getItem(`mock-${sessionId}-${p.id}`) : null;
          initialCodes[p.id] = saved ?? p.starterCode;
        }
        setCodes(initialCodes);
        setLoading(false);
      })
      .catch(() => { setError("Failed to load session"); setLoading(false); });
  }, [sessionId]);

  // ── Countdown timer ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!session || submitted) return;
    const interval = setInterval(() => {
      setRemainingMs((prev) => {
        const next = prev - 1000;
        if (next <= 0 && !autoSubmitFired.current) {
          autoSubmitFired.current = true;
          handleSubmit(true);
        }
        return Math.max(0, next);
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [session, submitted]);

  // ── Save code to localStorage ─────────────────────────────────────────────
  const handleCodeChange = useCallback((problemId: string, code: string) => {
    setCodes((prev) => {
      const next = { ...prev, [problemId]: code };
      if (typeof window !== "undefined") localStorage.setItem(`mock-${sessionId}-${problemId}`, code);
      return next;
    });
  }, [sessionId]);

  // ── Run code ───────────────────────────────────────────────────────────────
  const handleRun = useCallback(async (problem: Problem) => {
    const code = codes[problem.id] ?? problem.starterCode;
    if (!code.trim() || pyStatus !== "ready") return;
    const testCases = problem.testCases.slice(0, 3) as TestCase[];
    const result = await runCode(code, testCases);
    setResults((prev) => ({ ...prev, [problem.id]: result }));
  }, [codes, pyStatus, runCode]);

  // ── Submit all ─────────────────────────────────────────────────────────────
  const handleSubmit = useCallback(async (autoSubmit = false) => {
    if (submitting || submitted) return;
    setSubmitting(true);
    setShowConfirmSubmit(false);

    const timeUsedMs = session ? (session.timeLimitMins * 60 * 1000 - remainingMs) : 0;
    const subs: Record<string, { code: string; passed: boolean; timeTakenMs: number }> = {};

    for (const p of problems) {
      const code = codes[p.id] ?? "";
      const result = results[p.id];
      const passed = result ? result.testResults?.every((t) => t.passed) ?? false : false;
      subs[p.id] = { code, passed, timeTakenMs: timeUsedMs };
    }

    try {
      const res = await fetch(`/api/mock-interview/${sessionId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissions: subs, timeUsedMs }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Submit failed");
      setSubmitted(true);
      // Clean up localStorage
      for (const p of problems) localStorage.removeItem(`mock-${sessionId}-${p.id}`);
      router.push(`/dashboard/mock-interview/result/${sessionId}`);
    } catch (e) {
      setError((e as Error).message);
      setSubmitting(false);
    }
  }, [submitting, submitted, session, remainingMs, problems, codes, results, sessionId, router]);

  // ── Warn before leaving ────────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (!submitted) { e.preventDefault(); e.returnValue = ""; }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [submitted]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#E5A829] border-t-transparent rounded-full animate-spin" />
          <p className="text-white/50 text-sm">Loading your interview...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] gap-4">
        <p className="text-red-400 text-sm">{error}</p>
        <Link href="/dashboard/mock-interview" className="text-[#E5A829] text-sm hover:underline">
          ← Back to setup
        </Link>
      </div>
    );
  }

  const activeProblem = problems[activeProblemIdx];
  const isRed = remainingMs < 5 * 60 * 1000;
  const isYellow = remainingMs < 10 * 60 * 1000 && !isRed;

  return (
    <div className="flex flex-col h-screen bg-[#060810] overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06] flex-shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold bg-[#E5A829]/10 text-[#E5A829] border border-[#E5A829]/20 px-2.5 py-1 rounded-full">
            {session?.company} Mock
          </span>
          {problems.map((p, i) => (
            <button
              key={p.id}
              onClick={() => setActiveProblemIdx(i)}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                i === activeProblemIdx
                  ? "border-[#E5A829]/40 bg-[#E5A829]/10 text-[#E5A829]"
                  : "border-white/[0.08] text-white/50 hover:text-white/80"
              }`}
            >
              P{i + 1}
              <span className="ml-1.5 text-[10px]" style={{ color: DIFFICULTY_COLOR[p.difficulty] ?? "#E5A829" }}>
                {p.difficulty}
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          {/* Timer */}
          <motion.div
            className="font-mono text-xl font-bold px-4 py-1.5 rounded-xl"
            style={{
              color: isRed ? "#f87171" : isYellow ? "#E5A829" : "#fff",
              background: isRed ? "#f8717120" : "transparent",
            }}
            animate={isRed ? { scale: [1, 1.04, 1] } : {}}
            transition={{ duration: 1, repeat: Infinity }}
          >
            ⏱ {formatTime(remainingMs)}
          </motion.div>

          <motion.button
            onClick={() => setShowConfirmSubmit(true)}
            disabled={submitting}
            whileTap={{ scale: 0.96 }}
            className="px-4 py-2 rounded-xl text-sm font-bold text-[#0a0f24] disabled:opacity-60"
            style={{ background: "linear-gradient(135deg, #FFD700, #E5A829)" }}
          >
            {submitting ? "Submitting..." : "Submit All →"}
          </motion.button>
        </div>
      </div>

      {/* Split view */}
      <div className="flex flex-1 min-h-0">
        {/* Left: Problem statement */}
        <div className="w-[42%] flex-shrink-0 overflow-y-auto border-r border-white/[0.06] p-6">
          {activeProblem && (
            <>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs px-2 py-0.5 rounded font-semibold" style={{ color: DIFFICULTY_COLOR[activeProblem.difficulty] }}>
                  {activeProblem.difficulty}
                </span>
                {activeProblem.pattern && (
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/[0.06] text-white/40">
                    {activeProblem.pattern}
                  </span>
                )}
              </div>
              <h2 className="text-lg font-bold text-white mb-4">{activeProblem.title}</h2>
              <div className="prose prose-invert prose-sm max-w-none">
                <p className="text-white/70 leading-relaxed text-sm">{activeProblem.description}</p>
                {activeProblem.examples && (
                  <div className="mt-4">
                    <h4 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Examples</h4>
                    <pre className="bg-white/[0.04] border border-white/[0.06] rounded-xl p-3 text-xs text-white/70 overflow-x-auto whitespace-pre-wrap">
                      {activeProblem.examples}
                    </pre>
                  </div>
                )}
                {activeProblem.constraints && (
                  <div className="mt-4">
                    <h4 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Constraints</h4>
                    <pre className="bg-white/[0.04] border border-white/[0.06] rounded-xl p-3 text-xs text-white/60 whitespace-pre-wrap">
                      {activeProblem.constraints}
                    </pre>
                  </div>
                )}
              </div>

              {/* Test result for this problem */}
              {results[activeProblem.id] && (
                <div className="mt-5">
                  <h4 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Run Result</h4>
                  <div className="space-y-1.5">
                    {results[activeProblem.id]!.testResults?.map((t, i) => (
                      <div
                        key={i}
                        className={`flex items-center gap-2 text-xs px-3 py-2 rounded-lg ${
                          t.passed ? "bg-emerald-500/10 text-emerald-300" : "bg-red-500/10 text-red-300"
                        }`}
                      >
                        <span>{t.passed ? "✓" : "✗"}</span>
                        <span>Test {i + 1}</span>
                        {!t.passed && t.actualOutput !== undefined && (
                          <span className="text-white/40">Got: {String(t.actualOutput)?.slice(0, 40)}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Right: Editor */}
        <div className="flex-1 flex flex-col min-h-0">
          {activeProblem && (
            <>
              <div className="flex-1 min-h-0">
                <CodeEditor
                  initialCode={codes[activeProblem.id] ?? activeProblem.starterCode}
                  onChange={(v: string) => handleCodeChange(activeProblem.id, v)}
                  language="python"
                  fontSize={14}
                />
              </div>
              <div className="flex items-center gap-3 px-4 py-3 border-t border-white/[0.06] flex-shrink-0">
                <button
                  onClick={() => handleRun(activeProblem)}
                  disabled={pyStatus !== "ready"}
                  className="px-4 py-2 rounded-xl text-sm font-medium border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 transition-all disabled:opacity-40"
                >
                  {pyStatus === "ready" ? "▶ Run Tests" : "Loading Python..."}
                </button>
                <span className="text-xs text-white/25">Zyra is hidden during the interview</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Confirm Submit Modal */}
      <AnimatePresence>
        {showConfirmSubmit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setShowConfirmSubmit(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0f1629] border border-white/10 rounded-2xl p-6 max-w-sm w-full"
            >
              <h3 className="text-lg font-bold text-white mb-2">Submit Interview?</h3>
              <p className="text-sm text-white/50 mb-5">
                You have {formatTime(remainingMs)} remaining. Once submitted, you can&apos;t go back.
                Zyra will give you a personalised debrief.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmSubmit(false)}
                  className="flex-1 py-2.5 rounded-xl border border-white/10 text-sm text-white/60 hover:bg-white/5 transition-all"
                >
                  Keep going
                </button>
                <button
                  onClick={() => handleSubmit(false)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold text-[#0a0f24]"
                  style={{ background: "linear-gradient(135deg, #FFD700, #E5A829)" }}
                >
                  Submit Now
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
