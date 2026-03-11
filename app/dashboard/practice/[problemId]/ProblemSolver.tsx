"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import dynamic from "next/dynamic";
import MarkdownContent from "@/app/components/MarkdownContent";
import { difficultyColor } from "@/lib/utils";
import {
  usePyodide,
  type TestCase,
  type ExecutionResult,
  type TestResult,
} from "@/app/components/CodeExecutor";
import { triggerSuccessConfetti } from "@/app/components/feedback/Confetti";
import PostSolveReflection from "@/app/components/practice/PostSolveReflection";
import FailureFeedback from "@/app/components/practice/FailureFeedback";
import StuckModal from "@/app/components/practice/StuckModal";
import {
  analyzeFailure,
  type FailureAnalysis,
  type TestResultInput,
} from "@/lib/failureAnalysis";

// Dynamic import Monaco to avoid SSR issues
const CodeEditor = dynamic(() => import("@/app/components/CodeEditor"), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center bg-[#0A1128]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-gold-primary border-t-transparent rounded-full animate-spin" />
        <span className="text-gray-light/60 text-sm">Loading editor...</span>
      </div>
    </div>
  ),
});

interface RelatedLesson {
  id: string;
  slug: string;
  title: string;
  difficulty: string;
  course: { title: string; category: string };
}

interface NextProblemData {
  id: string;
  slug: string;
  title: string;
  difficulty: string;
}

interface ProblemData {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  category: string;
  starterCode: string;
  testCases: Array<{ input: Record<string, unknown> | string; expectedOutput: unknown }>;
  hiddenTestCases?: Array<{ input: Record<string, unknown> | string; expectedOutput: unknown }>;
  correctPattern?: string;
  solutionApproach?: string;
}

interface Props {
  problem: ProblemData;
  isSolved: boolean;
  userId: string;
  relatedLessons?: RelatedLesson[];
  nextProblem?: NextProblemData | null;
  onSolved?: () => void;
  currentPhase?: number;
}

export default function ProblemSolver({ problem, isSolved, userId, relatedLessons = [], nextProblem, onSolved, currentPhase = 3 }: Props) {
  // Code state
  const storageKey = `algo-rich-code-${problem.id}`;
  const [code, setCode] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(storageKey);
      return saved || problem.starterCode;
    }
    return problem.starterCode;
  });
  const [fontSize, setFontSize] = useState(currentPhase === 1 ? 16 : 14);
  const [hintsOpen, setHintsOpen] = useState(false);
  const [stuckModalOpen, setStuckModalOpen] = useState(false);
  const isPhase1 = currentPhase === 1;

  // Execution state
  const { status: pyStatus, runCode } = usePyodide();
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [activeOutputTab, setActiveOutputTab] = useState<"output" | "tests">(
    "output"
  );
  const [submitting, setSubmitting] = useState(false);
  const [solved, setSolved] = useState(isSolved);
  const [showReflection, setShowReflection] = useState(false);
  const [solveTimeSeconds, setSolveTimeSeconds] = useState(0);
  const solveStartTime = useRef<number>(0);
  const problemOpenedAt = useRef<number>(0);
  useEffect(() => { solveStartTime.current = Date.now(); problemOpenedAt.current = Date.now(); }, []);
  // Failure feedback state
  const [failureAnalysis, setFailureAnalysis] = useState<FailureAnalysis | null>(null);
  const [attemptCount, setAttemptCount] = useState(0);
  const [showStuckHelper, setShowStuckHelper] = useState(false);
  const [hintLevel, setHintLevel] = useState(0);
  const [stuckMinutes, setStuckMinutes] = useState(0);

  // XP & pattern discovery state
  const [xpEarned, setXpEarned] = useState<number | null>(null);
  const [patternDiscovery, setPatternDiscovery] = useState<{
    patternSlug: string;
    title: string;
    description: string;
  } | null>(null);

  // Track time stuck (check every 30s)
  useEffect(() => {
    const interval = setInterval(() => {
      const minutes = Math.floor(
        (Date.now() - problemOpenedAt.current) / 60000,
      );
      setStuckMinutes(minutes);
      if (!solved && minutes >= 5 && attemptCount >= 2) {
        setShowStuckHelper(true);
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [solved, attemptCount]);

  // Panel resize
  const [leftWidth, setLeftWidth] = useState(30);
  const [rightWidth, setRightWidth] = useState(25);
  const containerRef = useRef<HTMLDivElement>(null);
  const resizingRef = useRef<"left" | "right" | null>(null);

  // Auto-save code every 5s
  useEffect(() => {
    const timer = setInterval(() => {
      if (typeof window !== "undefined") {
        localStorage.setItem(storageKey, code);
      }
    }, 5000);
    return () => clearInterval(timer);
  }, [code, storageKey]);

  // Save on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined") {
        localStorage.setItem(storageKey, code);
      }
    };
  }, [code, storageKey]);

  // Panel resize handlers
  const handleMouseDown = useCallback(
    (panel: "left" | "right") => (e: React.MouseEvent) => {
      e.preventDefault();
      resizingRef.current = panel;

      const handleMouseMove = (ev: MouseEvent) => {
        if (!containerRef.current || !resizingRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = ((ev.clientX - rect.left) / rect.width) * 100;

        if (resizingRef.current === "left") {
          const clamped = Math.max(20, Math.min(50, x));
          setLeftWidth(clamped);
        } else {
          const fromRight = 100 - ((ev.clientX - rect.left) / rect.width) * 100;
          const clamped = Math.max(15, Math.min(40, fromRight));
          setRightWidth(clamped);
        }
      };

      const handleMouseUp = () => {
        resizingRef.current = null;
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      };

      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    []
  );

  // Extract expected function name from starter code
  const expectedFuncName = (() => {
    const match = problem.starterCode.match(/def\s+(\w+)\s*\(/);
    return match ? match[1] : undefined;
  })();

  // Run code
  const handleRun = useCallback(async () => {
    if (pyStatus === "loading" || pyStatus === "running") return;
    setResult(null);
    setActiveOutputTab("output");

    const execResult = await runCode(code, undefined, expectedFuncName);
    setResult(execResult);
  }, [code, pyStatus, runCode, expectedFuncName]);

  // Run with tests
  const handleRunTests = useCallback(async () => {
    if (pyStatus === "loading" || pyStatus === "running") return;
    setResult(null);
    setActiveOutputTab("tests");

    const testCases: TestCase[] = problem.testCases.map((tc) => ({
      input: tc.input,
      expectedOutput: tc.expectedOutput,
    }));

    const execResult = await runCode(code, testCases, expectedFuncName);
    setResult(execResult);
  }, [code, pyStatus, runCode, problem.testCases, expectedFuncName]);

  // Submit solution
  const handleSubmit = useCallback(async () => {
    if (pyStatus === "loading" || pyStatus === "running" || submitting) return;
    setSubmitting(true);
    setActiveOutputTab("tests");
    setFailureAnalysis(null);

    // Include both visible and hidden test cases for server validation
    const visibleTests: TestCase[] = problem.testCases.map((tc) => ({
      input: tc.input,
      expectedOutput: tc.expectedOutput,
    }));
    const hiddenTests: TestCase[] = (problem.hiddenTestCases ?? []).map((tc: { input: Record<string, unknown> | string; expectedOutput: unknown }) => ({
      input: tc.input,
      expectedOutput: tc.expectedOutput,
    }));
    const allTestCases = [...visibleTests, ...hiddenTests];

    const execResult = await runCode(code, allTestCases, expectedFuncName);
    setResult(execResult);

    const allPassed =
      execResult.testResults !== null &&
      execResult.testResults.every((t) => t.passed);

    setAttemptCount((prev) => prev + 1);

    // Save submission — send full test results for server-side hidden test validation
    try {
      const subRes = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problemId: problem.id,
          code,
          testResults: execResult.testResults,
          executionTime: execResult.executionTime,
        }),
      });
      const subData = subRes.ok ? await subRes.json().catch(() => null) : null;
      if (allPassed) {
        setSolved(true);
        triggerSuccessConfetti();
        setFailureAnalysis(null);
        setShowStuckHelper(false);
        onSolved?.();
        // Show XP earned
        if (subData?.stats?.xpEarned) {
          setXpEarned(subData.stats.xpEarned);
        }
        // Show pattern discovery
        if (subData?.stats?.patternDiscovery) {
          setPatternDiscovery(subData.stats.patternDiscovery);
        }
        // Show reflection after a brief delay
        setTimeout(() => {
          setSolveTimeSeconds(Math.round((Date.now() - solveStartTime.current) / 1000));
          setShowReflection(true);
        }, 2000);
      } else if (execResult.testResults) {
        // Run failure analysis
        const analysis = analyzeFailure(
          execResult.testResults.map((t) => ({
            input: t.input
              ? typeof t.input === "object"
                ? JSON.stringify(t.input)
                : String(t.input)
              : "",
            expected: t.expectedOutput
              ? typeof t.expectedOutput === "object"
                ? JSON.stringify(t.expectedOutput)
                : String(t.expectedOutput)
              : "",
            actual: t.actualOutput
              ? typeof t.actualOutput === "object"
                ? JSON.stringify(t.actualOutput)
                : String(t.actualOutput)
              : "",
            passed: t.passed,
            error: undefined,
          })) as TestResultInput[],
          problem.difficulty,
          problem.category,
        );
        setFailureAnalysis(analysis);
      } else if (execResult.error) {
        // Error without test results — still analyze
        const analysis = analyzeFailure(
          [
            {
              input: "",
              expected: "",
              actual: "",
              passed: false,
              error: execResult.error,
            },
          ],
          problem.difficulty,
          problem.category,
        );
        setFailureAnalysis(analysis);
      }
    } catch {
      // silent
    }

    setSubmitting(false);
  }, [code, pyStatus, runCode, problem, submitting, expectedFuncName, onSolved, setSubmitting, setActiveOutputTab, setFailureAnalysis, setResult, setAttemptCount, setSolved, setShowStuckHelper, setXpEarned, setPatternDiscovery, setSolveTimeSeconds, setShowReflection]);

  // Reset code
  const handleReset = useCallback(() => {
    setCode(problem.starterCode);
    localStorage.removeItem(storageKey);
  }, [problem.starterCode, storageKey]);

  const centerWidth = 100 - leftWidth - rightWidth;

  return (
    <div className="fixed inset-0 lg:left-60 bg-navy-dark flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-navy-light/30 bg-navy-dark/95 backdrop-blur-sm z-10 flex-shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/dashboard/practice"
            className="text-gray-light/50 hover:text-gold-primary transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </Link>
          <h1 className="text-white font-semibold text-sm truncate max-w-xs">
            {problem.title}
          </h1>
          <span
            className={`text-xs px-2 py-0.5 rounded-full border ${difficultyColor(
              problem.difficulty
            )}`}
          >
            {problem.difficulty}
          </span>
          {solved && (
            <span className="text-gold-primary text-xs flex items-center gap-1">
              ✓ Solved
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {/* Pyodide status */}
          <span
            className={`text-xs px-2 py-1 rounded ${
              pyStatus === "ready"
                ? "text-green-400 bg-green-500/10"
                : pyStatus === "loading"
                ? "text-yellow-400 bg-yellow-500/10"
                : pyStatus === "running"
                ? "text-blue-400 bg-blue-500/10"
                : pyStatus === "error"
                ? "text-red-400 bg-red-500/10"
                : "text-gray-light/40"
            }`}
          >
            {pyStatus === "ready"
              ? "Python Ready"
              : pyStatus === "loading"
              ? "Loading Python..."
              : pyStatus === "running"
              ? "Running..."
              : pyStatus === "error"
              ? "Error"
              : "Idle"}
          </span>
          {/* I'm Stuck button */}
          <button
            onClick={() => setStuckModalOpen(true)}
            className={`text-xs px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
              isPhase1
                ? "border-amber-500/40 text-amber-400 bg-amber-500/10 hover:bg-amber-500/20"
                : "border-white/[0.08] text-white/30 hover:text-white/60"
            }`}
          >
            💡 I&apos;m Stuck
          </button>
        </div>
      </div>

      {/* Main 3-panel layout (desktop) / stacked (mobile) */}
      <AnimatePresence>
        {stuckModalOpen && (
          <StuckModal
            problemTitle={problem.title}
            onXPPenalty={(xp) => console.log(`-${xp} XP for hint`)}
            onClose={() => setStuckModalOpen(false)}
          />
        )}
      </AnimatePresence>
      <div
        ref={containerRef}
        className="flex-1 flex flex-col lg:flex-row overflow-hidden"
      >
        {/* LEFT: Problem Description */}
        <div
          className="lg:overflow-y-auto border-b lg:border-b-0 lg:border-r border-navy-light/30 flex-shrink-0 mobile-full-width max-h-[40vh] lg:max-h-none overflow-y-auto"
          style={{
            width: `${leftWidth}%`,
            minHeight: "200px",
          }}
        >
          <div className="p-5 h-full overflow-y-auto">
            {/* Category */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs text-gray-light/40 bg-navy-light/30 px-2 py-0.5 rounded-full">
                {problem.category}
              </span>
            </div>

            {/* Description */}
            <div className="prose-sm">
              <MarkdownContent content={problem.description} />
            </div>

            {/* Test Cases Preview */}
            <div className="mt-6">
              <h3 className="text-sm font-bold text-gold-primary mb-3">
                Example Test Cases
              </h3>
              <div className="space-y-3">
                {problem.testCases.slice(0, 3).map((tc, i) => (
                  <div
                    key={i}
                    className="bg-navy-dark/60 border border-navy-light/20 rounded-lg p-3"
                  >
                    <div className="text-xs text-gray-light/50 mb-1">
                      Test Case {i + 1}
                    </div>
                    {tc.input && (
                      <div className="flex gap-2 text-sm mb-1">
                        <span className="text-gray-light/40">Input:</span>
                        <code className="text-gold-light font-mono text-xs">
                          {typeof tc.input === 'object' ? JSON.stringify(tc.input) : tc.input}
                        </code>
                      </div>
                    )}
                    <div className="flex gap-2 text-sm">
                      <span className="text-gray-light/40">Expected:</span>
                      <code className="text-green-400 font-mono text-xs">
                        {typeof tc.expectedOutput === 'object' ? JSON.stringify(tc.expectedOutput) : String(tc.expectedOutput)}
                      </code>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hints */}
            <div className="mt-6">
              <button
                onClick={() => setHintsOpen(!hintsOpen)}
                className="flex items-center gap-2 text-sm text-gray-light/50 hover:text-gold-primary transition-colors"
              >
                <svg
                  className={`w-4 h-4 transition-transform ${
                    hintsOpen ? "rotate-90" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
                Hints
              </button>
              <AnimatePresence>
                {hintsOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-3 p-3 bg-gold-primary/5 border border-gold-primary/20 rounded-lg text-sm text-gray-light/70">
                      <p>
                        💡 Think about the problem step by step. What are the
                        inputs? What should the output be?
                      </p>
                      <p className="mt-2">
                        Try writing pseudocode first, then translate it to
                        Python.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Stuck Helper — Progressive Hints */}
            <AnimatePresence>
              {showStuckHelper && !solved && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 overflow-hidden"
                >
                  <div className="p-3 rounded-lg border border-amber-500/30 bg-amber-500/5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-amber-400 font-semibold">
                        <span>🤔</span>
                        <span>
                          Stuck for {stuckMinutes}+ min? Here&apos;s a nudge:
                        </span>
                      </div>
                      <button
                        onClick={() => setShowStuckHelper(false)}
                        className="text-gray-light/40 hover:text-gray-light/70 transition-colors text-xs"
                      >
                        ✕
                      </button>
                    </div>

                    {/* Level 1: Pattern name */}
                    {hintLevel >= 0 && problem.correctPattern && (
                      <div className="text-xs text-gray-light/70 bg-navy-dark/40 rounded p-2">
                        <span className="text-gold-primary font-medium">Pattern: </span>
                        {formatPatternName(problem.correctPattern)}
                      </div>
                    )}

                    {/* Level 2: Solution approach */}
                    {hintLevel >= 1 && problem.solutionApproach && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs text-gray-light/70 bg-navy-dark/40 rounded p-2"
                      >
                        <span className="text-gold-primary font-medium">Approach: </span>
                        {problem.solutionApproach}
                      </motion.div>
                    )}

                    {/* Level 3: Pseudocode */}
                    {hintLevel >= 2 && problem.correctPattern && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs bg-navy-dark/40 rounded p-2"
                      >
                        <span className="text-gold-primary font-medium block mb-1">Pseudocode:</span>
                        <pre className="text-gray-light/60 whitespace-pre-wrap leading-relaxed font-mono text-[11px]">
                          {generatePseudocode(problem.correctPattern, problem.category)}
                        </pre>
                      </motion.div>
                    )}

                    {/* Reveal next hint level button */}
                    {hintLevel < 2 && (
                      <button
                        onClick={() => setHintLevel((prev) => Math.min(prev + 1, 2))}
                        className="text-xs text-amber-400/80 hover:text-amber-400 transition-colors underline underline-offset-2"
                      >
                        {hintLevel === 0 ? "Show approach hint" : "Show pseudocode"}
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit button */}
            <div className="mt-6 pb-4">
              <button
                onClick={handleSubmit}
                disabled={
                  pyStatus !== "ready" || submitting
                }
                className={`w-full py-3 rounded-lg font-semibold text-sm transition-all duration-300 ${
                  submitting
                    ? "bg-navy-light/40 text-gray-light/50 cursor-wait"
                    : pyStatus !== "ready"
                    ? "bg-navy-light/40 text-gray-light/40 cursor-not-allowed"
                    : "bg-gradient-to-r from-gold-primary to-gold-light text-navy-dark hover:shadow-lg hover:shadow-gold-primary/30 cursor-pointer"
                }`}
              >
                {submitting
                  ? "Submitting..."
                  : pyStatus !== "ready"
                  ? "Waiting for Python..."
                  : "Submit Solution"}
              </button>
            </div>

            {/* Related Lessons — "Learn this concept" */}
            {relatedLessons.length > 0 && (
              <div className="mt-2 pb-4">
                <h3 className="text-sm font-bold text-gold-primary mb-2 flex items-center gap-2">
                  📚 Learn This Concept
                </h3>
                <div className="space-y-1.5">
                  {relatedLessons.map((lesson) => (
                    <Link
                      key={lesson.id}
                      href={`/dashboard/lesson/${lesson.id}`}
                      className="flex items-center gap-2 p-2.5 rounded-lg border border-navy-light/20 hover:border-gold-primary/30 hover:bg-navy-light/10 transition-all group text-sm"
                    >
                      <span className="text-gray-light/40 group-hover:text-gold-primary transition-colors">
                        📖
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-light/80 group-hover:text-gold-light truncate text-xs font-medium">
                          {lesson.title}
                        </p>
                        <p className="text-xs text-gray-light/40 truncate">
                          {lesson.course.title}
                        </p>
                      </div>
                      <svg
                        className="w-3.5 h-3.5 text-gray-light/20 group-hover:text-gold-primary/60 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* XP Earned Toast */}
            <AnimatePresence>
              {xpEarned !== null && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20 mb-3"
                >
                  <span className="text-lg">⚡</span>
                  <span className="text-sm font-bold text-yellow-400">+{xpEarned} XP</span>
                  <button
                    onClick={() => setXpEarned(null)}
                    className="ml-auto text-yellow-400/40 hover:text-yellow-400 text-xs"
                  >
                    ✕
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pattern Discovery Popup */}
            <AnimatePresence>
              {patternDiscovery && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-4 mb-3"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">🧩</span>
                    <span className="text-sm font-bold text-purple-300">Pattern Discovered!</span>
                    <button
                      onClick={() => setPatternDiscovery(null)}
                      className="ml-auto text-purple-400/40 hover:text-purple-400 text-xs"
                    >
                      ✕
                    </button>
                  </div>
                  <h4 className="text-white font-semibold text-sm mb-1">{patternDiscovery.title}</h4>
                  <p className="text-white/60 text-xs leading-relaxed">{patternDiscovery.description}</p>
                  <Link
                    href={`/dashboard/patterns/${patternDiscovery.patternSlug}`}
                    className="inline-block mt-2 text-xs text-purple-400 hover:text-purple-300 underline"
                  >
                    Explore this pattern →
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Post-Solve Reflection */}
            <AnimatePresence>
              {showReflection && (
                <PostSolveReflection
                  problemId={problem.id}
                  solveTimeSeconds={solveTimeSeconds}
                  onComplete={() => setShowReflection(false)}
                  onSkip={() => setShowReflection(false)}
                />
              )}
            </AnimatePresence>

            {/* Next Problem suggestion (shown after solving) */}
            {solved && nextProblem && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 pb-4"
              >
                <h3 className="text-sm font-bold text-emerald-400 mb-2 flex items-center gap-2">
                  🎯 Next Challenge
                </h3>
                <Link
                  href={`/dashboard/practice/${nextProblem.id}`}
                  className="flex items-center gap-3 p-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 hover:border-emerald-500/40 hover:bg-emerald-500/10 transition-all group"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
                    →
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white group-hover:text-emerald-300 truncate">
                      {nextProblem.title}
                    </p>
                    <span className={`text-xs px-1.5 py-0.5 rounded border ${difficultyColor(nextProblem.difficulty)}`}>
                      {nextProblem.difficulty}
                    </span>
                  </div>
                  <svg
                    className="w-4 h-4 text-emerald-400/40 group-hover:text-emerald-400 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </motion.div>
            )}
          </div>
        </div>

        {/* Left resize handle */}
        <div
          className="hidden lg:flex w-1.5 cursor-col-resize items-center justify-center hover:bg-gold-primary/20 transition-colors flex-shrink-0 group"
          onMouseDown={handleMouseDown("left")}
        >
          <div className="w-0.5 h-8 bg-navy-light/40 group-hover:bg-gold-primary/60 rounded-full transition-colors" />
        </div>

        {/* CENTER: Code Editor */}
        <div
          className="flex flex-col flex-shrink-0"
          style={{ width: `${centerWidth}%`, minHeight: "300px" }}
        >
          {/* Editor Toolbar */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-navy-light/30 bg-navy-dark/80 flex-shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-light/40 bg-navy-light/30 px-2 py-1 rounded">
                🐍 Python 3
              </span>
              <div className="flex items-center gap-1 ml-2">
                <button
                  onClick={() => setFontSize((s) => Math.max(10, s - 1))}
                  className="w-6 h-6 flex items-center justify-center text-gray-light/50 hover:text-white bg-navy-light/20 rounded text-xs transition-colors"
                >
                  −
                </button>
                <span className="text-xs text-gray-light/50 w-6 text-center">
                  {fontSize}
                </span>
                <button
                  onClick={() => setFontSize((s) => Math.min(24, s + 1))}
                  className="w-6 h-6 flex items-center justify-center text-gray-light/50 hover:text-white bg-navy-light/20 rounded text-xs transition-colors"
                >
                  +
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                className="px-3 py-1.5 text-xs text-gray-light/60 hover:text-white border border-navy-light/30 hover:border-gray-light/30 rounded transition-colors"
              >
                Reset
              </button>
              <button
                onClick={handleRun}
                disabled={pyStatus !== "ready"}
                className={`px-4 py-1.5 text-xs font-medium rounded transition-all duration-200 ${
                  pyStatus !== "ready"
                    ? "bg-navy-light/30 text-gray-light/40 cursor-not-allowed"
                    : "bg-gold-primary/15 text-gold-primary border border-gold-primary/30 hover:bg-gold-primary/25"
                }`}
              >
                ▶ Run
              </button>
              <button
                onClick={handleRunTests}
                disabled={pyStatus !== "ready"}
                className={`px-4 py-1.5 text-xs font-semibold rounded transition-all duration-200 ${
                  pyStatus !== "ready"
                    ? "bg-navy-light/30 text-gray-light/40 cursor-not-allowed"
                    : "bg-gradient-to-r from-gold-primary to-gold-light text-navy-dark hover:shadow-md hover:shadow-gold-primary/20"
                }`}
              >
                ▶ Run Tests
              </button>
            </div>
          </div>

          {/* Editor */}
          <div className="flex-1 min-h-0">
            <CodeEditor
              initialCode={code}
              onChange={setCode}
              fontSize={fontSize}
              language="python"
              showMinimap={!isPhase1}
            />
          </div>
        </div>

        {/* Right resize handle */}
        <div
          className="hidden lg:flex w-1.5 cursor-col-resize items-center justify-center hover:bg-gold-primary/20 transition-colors flex-shrink-0 group"
          onMouseDown={handleMouseDown("right")}
        >
          <div className="w-0.5 h-8 bg-navy-light/40 group-hover:bg-gold-primary/60 rounded-full transition-colors" />
        </div>

        {/* RIGHT: Output Console */}
        <div
          className="flex flex-col border-t lg:border-t-0 lg:border-l border-navy-light/30 flex-shrink-0 mobile-full-width"
          style={{ width: `${rightWidth}%`, minHeight: "200px" }}
        >
          {/* Output tabs */}
          <div className="flex border-b border-navy-light/30 flex-shrink-0">
            <button
              onClick={() => setActiveOutputTab("output")}
              className={`flex-1 py-2.5 text-xs font-medium transition-colors ${
                activeOutputTab === "output"
                  ? "text-gold-primary border-b-2 border-gold-primary"
                  : "text-gray-light/50 hover:text-gray-light/80"
              }`}
            >
              Output
            </button>
            <button
              onClick={() => setActiveOutputTab("tests")}
              className={`flex-1 py-2.5 text-xs font-medium transition-colors ${
                activeOutputTab === "tests"
                  ? "text-gold-primary border-b-2 border-gold-primary"
                  : "text-gray-light/50 hover:text-gray-light/80"
              }`}
            >
              Test Results
              {result?.testResults && (
                <span className="ml-1.5">
                  ({result.testResults.filter((t) => t.passed).length}/
                  {result.testResults.length})
                </span>
              )}
            </button>
          </div>

          {/* Output content */}
          <div className="flex-1 overflow-y-auto p-4 font-mono text-sm bg-[#0A1128]">
            {pyStatus === "running" ? (
              <div className="flex items-center gap-2 text-yellow-400">
                <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
                Running code...
              </div>
            ) : pyStatus === "loading" ? (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-light/50">
                <div className="w-8 h-8 border-2 border-gold-primary border-t-transparent rounded-full animate-spin" />
                <span className="text-xs">
                  Loading Python environment...
                </span>
                <span className="text-xs text-gray-light/30">
                  This may take a few seconds
                </span>
              </div>
            ) : !result ? (
              <div className="text-gray-light/30 text-xs">
                Click &quot;Run&quot; or &quot;Run Tests&quot; to execute your
                code.
              </div>
            ) : activeOutputTab === "output" ? (
              <OutputPanel result={result} />
            ) : (
              <TestResultsPanel
                testResults={result.testResults}
                error={result.error}
                failureAnalysis={failureAnalysis}
                attemptCount={attemptCount}
                solutionApproach={problem.solutionApproach}
                onRetry={() => {
                  setFailureAnalysis(null);
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper: format pattern slug to display name
function formatPatternName(pattern: string): string {
  const names: Record<string, string> = {
    "hash-map": "Hash Map Lookup",
    "two-pointers": "Two Pointers",
    "sliding-window": "Sliding Window",
    "binary-search": "Binary Search",
    "bfs": "Breadth-First Search",
    "dfs": "Depth-First Search",
    "bfs-dfs": "BFS / DFS Traversal",
    "dynamic-programming": "Dynamic Programming",
    "recursion": "Recursion",
    "backtracking": "Backtracking",
    "greedy": "Greedy Algorithm",
    "stack": "Stack",
    "queue": "Queue",
    "linked-list": "Linked List Traversal",
    "tree-traversal": "Tree Traversal",
    "divide-and-conquer": "Divide and Conquer",
    "sorting": "Sorting",
    "prefix-sum": "Prefix Sum",
    "monotonic-stack": "Monotonic Stack",
    "union-find": "Union Find",
    "topological-sort": "Topological Sort",
    "trie": "Trie",
    "heap": "Heap / Priority Queue",
    "bit-manipulation": "Bit Manipulation",
    "math": "Mathematical",
    "string-manipulation": "String Manipulation",
    "frequency-counter": "Frequency Counter",
    "fast-slow-pointers": "Fast & Slow Pointers",
    "merge-intervals": "Merge Intervals",
  };
  return names[pattern] || pattern.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

// Helper: generate generic pseudocode for a given pattern
function generatePseudocode(pattern: string, category: string): string {
  const templates: Record<string, string> = {
    "hash-map": `1. Create a hash map (dictionary)
2. Iterate through the input:
   a. Check if complement/target exists in map
   b. If yes → return result
   c. If no → store current element in map
3. Return default if nothing found`,
    "two-pointers": `1. Sort input if needed
2. Initialize left = 0, right = len - 1
3. While left < right:
   a. Calculate current value
   b. If match → return result
   c. If too small → move left pointer right
   d. If too large → move right pointer left
4. Return default`,
    "sliding-window": `1. Initialize window boundaries: left = 0
2. Initialize window state (sum, count, etc.)
3. For right in range(len):
   a. Expand window: add element at right
   b. While window is invalid:
      - Shrink: remove element at left
      - left += 1
   c. Update best answer
4. Return best answer`,
    "binary-search": `1. Set low = 0, high = len - 1
2. While low <= high:
   a. mid = (low + high) // 2
   b. If arr[mid] == target → return mid
   c. If arr[mid] < target → low = mid + 1
   d. Else → high = mid - 1
3. Return -1 (not found)`,
    "bfs": `1. Create a queue, add starting node
2. Create a visited set
3. While queue is not empty:
   a. node = queue.popleft()
   b. Process node
   c. For each neighbor of node:
      - If not visited → add to queue & visited
4. Return result`,
    "dfs": `1. Create a visited set
2. Define dfs(node):
   a. Mark node as visited
   b. Process node
   c. For each neighbor of node:
      - If not visited → dfs(neighbor)
3. Call dfs(start)
4. Return result`,
    "bfs-dfs": `1. Choose BFS (shortest path) or DFS (explore all)
2. Initialize data structure (queue or stack)
3. Track visited nodes
4. Process each node:
   a. Check if goal reached
   b. Add unvisited neighbors
5. Return result`,
    "dynamic-programming": `1. Define subproblem: dp[i] = ...
2. Find base case(s): dp[0] = ...
3. Find recurrence relation:
   dp[i] = f(dp[i-1], dp[i-2], ...)
4. Decide iteration order (bottom-up)
5. Fill the DP table
6. Return dp[n] (or dp[n-1])`,
    "recursion": `1. Define base case(s):
   - If simplest input → return known answer
2. Define recursive case:
   - Break problem into smaller subproblem
   - Call function recursively on subproblem
   - Combine results
3. Return combined result`,
    "backtracking": `1. Define choices at each step
2. Define backtrack(state, choices):
   a. If goal reached → save solution
   b. For each choice:
      - Make choice (modify state)
      - backtrack(new_state, remaining)
      - Undo choice (restore state)
3. Call backtrack(initial_state, all_choices)`,
    "greedy": `1. Sort input by optimal criteria
2. Initialize result
3. For each element (in sorted order):
   a. If element fits constraint:
      - Add to result
      - Update constraint
4. Return result`,
    "stack": `1. Initialize an empty stack
2. Iterate through elements:
   a. While stack not empty and condition:
      - Pop and process
   b. Push current element
3. Process remaining stack items
4. Return result`,
    "frequency-counter": `1. Count frequency of each element (use dict)
2. Analyze frequencies:
   - Find most/least common
   - Compare frequency distributions
   - Filter by frequency threshold
3. Return result based on frequencies`,
    "prefix-sum": `1. Build prefix sum array:
   prefix[0] = 0
   prefix[i] = prefix[i-1] + arr[i-1]
2. For range sum query [l, r]:
   sum = prefix[r+1] - prefix[l]
3. Return result`,
    "fast-slow-pointers": `1. Initialize slow = head, fast = head
2. While fast and fast.next:
   a. slow = slow.next
   b. fast = fast.next.next
   c. If slow == fast → cycle detected
3. Return result based on pointer positions`,
    "linked-list": `1. Initialize pointer(s) at head
2. Traverse while pointer is not None:
   a. Process current node
   b. Move pointer(s) forward
3. Handle edge cases (empty list, single node)
4. Return result`,
  };

  if (templates[pattern]) return templates[pattern];

  // Fallback: generic approach based on category
  const categoryTemplates: Record<string, string> = {
    "Arrays": `1. Consider the key insight about the data
2. Choose appropriate technique for the pattern
3. Iterate and apply the pattern
4. Track & return the result`,
    "Strings": `1. Consider character-by-character processing
2. Use appropriate data structure (map, set, stack)
3. Handle edge cases (empty, single char)
4. Build and return result`,
    "Trees": `1. Choose traversal order (pre/in/post/level)
2. Handle base case: if node is None → return
3. Process current node
4. Recurse on children
5. Return result`,
  };

  return categoryTemplates[category] || `1. Identify the core pattern\n2. Handle edge cases\n3. Implement the main logic\n4. Return the result`;
}

// Output panel sub-component
function OutputPanel({ result }: { result: ExecutionResult }) {
  return (
    <div className="space-y-3">
      {result.output && (
        <div>
          <div className="text-xs text-gray-light/40 mb-1">stdout</div>
          <pre className="text-gray-light/90 whitespace-pre-wrap text-xs leading-relaxed">
            {result.output}
          </pre>
        </div>
      )}

      {result.error && (
        <div>
          <div className="text-xs text-red-400/70 mb-1">Error</div>
          <pre className="text-red-400 whitespace-pre-wrap text-xs leading-relaxed">
            {result.error}
          </pre>
        </div>
      )}

      {!result.output && !result.error && (
        <div className="text-gray-light/30 text-xs">
          No output. Try adding a print() statement.
        </div>
      )}

      <div className="pt-2 border-t border-navy-light/20 text-xs text-gray-light/30">
        Execution time: {result.executionTime}ms
      </div>
    </div>
  );
}

// Test results panel sub-component
function TestResultsPanel({
  testResults,
  error,
  failureAnalysis,
  attemptCount,
  solutionApproach,
  onRetry,
}: {
  testResults: TestResult[] | null;
  error: string | null;
  failureAnalysis: FailureAnalysis | null;
  attemptCount: number;
  solutionApproach?: string;
  onRetry: () => void;
}) {
  if (error && !testResults) {
    return (
      <div>
        <div className="text-xs text-red-400/70 mb-1">Error</div>
        <pre className="text-red-400 whitespace-pre-wrap text-xs">
          {error}
        </pre>
      </div>
    );
  }

  if (!testResults) {
    return (
      <div className="text-gray-light/30 text-xs">
        Click &quot;Run Tests&quot; to validate your solution.
      </div>
    );
  }

  const passed = testResults.filter((t) => t.passed).length;
  const total = testResults.length;
  const allPassed = passed === total;

  return (
    <div className="space-y-3">
      {/* Overall status */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`p-3 rounded-lg border text-sm font-medium ${
          allPassed
            ? "bg-green-500/10 border-green-500/30 text-green-400"
            : "bg-red-500/10 border-red-500/30 text-red-400"
        }`}
      >
        {allPassed ? "✓ All tests passed!" : `✗ ${passed}/${total} tests passed`}
      </motion.div>

      {/* Failure Feedback (replaces old inline analysis) */}
      {failureAnalysis && !allPassed && (
        <FailureFeedback
          analysis={failureAnalysis}
          passedCount={passed}
          totalCount={total}
          attemptNumber={attemptCount}
          solutionApproach={solutionApproach}
          onRetry={onRetry}
        />
      )}

      {/* Collapsible test case details */}
      <details className="group">
        <summary className="text-xs text-gray-light/50 cursor-pointer hover:text-gray-light/70 transition-colors select-none flex items-center gap-1.5">
          <svg
            className="w-3 h-3 transition-transform group-open:rotate-90"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          View test case details ({passed}/{total} passed)
        </summary>
        <div className="mt-2 space-y-2">
          {testResults.map((tr) => (
            <motion.div
              key={tr.index}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: tr.index * 0.08,
                ease: "easeOut" as const,
              }}
              className={`p-3 rounded-lg border text-xs ${
                tr.passed
                  ? "bg-green-500/5 border-green-500/20"
                  : "bg-red-500/5 border-red-500/20"
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span
                  className={
                    tr.passed ? "text-green-400" : "text-red-400"
                  }
                >
                  {tr.passed ? "✓" : "✗"}
                </span>
                <span className="text-gray-light/80 font-medium">
                  Test Case {tr.index}
                </span>
              </div>
              {tr.input && (
                <div className="flex gap-2 text-gray-light/50 mb-0.5">
                  <span>Input:</span>
                  <code className="text-gray-light/70">{typeof tr.input === 'object' ? JSON.stringify(tr.input) : tr.input}</code>
                </div>
              )}
              <div className="flex gap-2 text-gray-light/50 mb-0.5">
                <span>Expected:</span>
                <code className="text-green-400/80">{typeof tr.expectedOutput === 'object' ? JSON.stringify(tr.expectedOutput) : String(tr.expectedOutput)}</code>
              </div>
              {!tr.passed && (
                <div className="flex gap-2 text-gray-light/50">
                  <span>Got:</span>
                  <code className="text-red-400/80">{typeof tr.actualOutput === 'object' ? JSON.stringify(tr.actualOutput) : String(tr.actualOutput ?? '')}</code>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </details>
    </div>
  );
}
