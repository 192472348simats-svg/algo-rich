"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import type { CodeConfig } from "@/lib/sessionDefinitions";
import type { StageResult } from "@/app/dashboard/session/[sessionSlug]/SessionPlayer";
import {
  usePyodide,
  type TestCase,
  type ExecutionResult,
} from "@/app/components/CodeExecutor";

const CodeEditor = dynamic(() => import("@/app/components/CodeEditor"), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center bg-[#0d1117]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="text-white/30 text-sm">Loading editor...</span>
      </div>
    </div>
  ),
});

interface Props {
  config: CodeConfig;
  onComplete: (result: StageResult) => void;
}

interface ProblemData {
  id: string;
  title: string;
  description: string;
  starterCode: string;
  solutionApproach?: string | null;
  solutionCode?: string | null;
  hints?: string | null;
  testCases: Array<{
    input: Record<string, unknown> | string;
    expectedOutput: unknown;
  }>;
}

export default function CodeStage({ config, onComplete }: Props) {
  const [problem, setProblem] = useState<ProblemData | null>(null);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState("");
  const [solved, setSolved] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showApproach, setShowApproach] = useState(false);
  const [hintText, setHintText] = useState<string | null>(null);
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const startTimeRef = useRef(0);
  useEffect(() => { startTimeRef.current = Date.now(); }, []);

  const { status: pyStatus, runCode } = usePyodide();

  // Fetch the problem by slug
  useEffect(() => {
    async function loadProblem() {
      try {
        const res = await fetch(
          `/api/problems/${config.problemSlug}?bySlug=true`
        );
        if (res.ok) {
          const data = await res.json();
          setProblem(data);
          setCode(data.starterCode || "");
        } else {
          // Fallback: try fetching all problems and find by slug
          const allRes = await fetch("/api/problems");
          if (allRes.ok) {
            const allData = await allRes.json();
            const found = Array.isArray(allData)
              ? allData.find(
                  (p: { slug?: string }) => p.slug === config.problemSlug
                )
              : null;
            if (found) {
              // Fetch the full problem by ID
              const fullRes = await fetch(`/api/problems/${found.id}`);
              if (fullRes.ok) {
                const fullData = await fullRes.json();
                setProblem(fullData);
                setCode(fullData.starterCode || "");
              }
            }
          }
        }
      } catch (err) {
        console.error("Failed to load problem:", err);
      }
      setLoading(false);
    }
    loadProblem();
  }, [config.problemSlug]);

  // Timed hint reveals
  useEffect(() => {
    const hintTimer = setTimeout(
      () => setShowHint(true),
      (config.hintAfterMinutes ?? 3) * 60 * 1000
    );
    const approachTimer = setTimeout(
      () => setShowApproach(true),
      (config.approachAfterMinutes ?? 7) * 60 * 1000
    );
    return () => {
      clearTimeout(hintTimer);
      clearTimeout(approachTimer);
    };
  }, [config.hintAfterMinutes, config.approachAfterMinutes]);

  const handleSolved = useCallback(() => {
    const timeSpent = Math.round(
      (Date.now() - startTimeRef.current) / 1000
    );
    const xp = timeSpent < 300 ? 50 : timeSpent < 600 ? 35 : 20;
    setSolved(true);
    setTimeout(() => onComplete({ score: xp, timeSpent }), 2000);
  }, [onComplete]);

  const handleRunTests = useCallback(async () => {
    if (!problem || pyStatus !== "ready") return;
    setResult(null);

    const testCases: TestCase[] = problem.testCases.map((tc) => ({
      input: tc.input,
      expectedOutput: tc.expectedOutput,
    }));

    const execResult = await runCode(code, testCases);
    setResult(execResult);

    const allPassed =
      execResult.testResults !== null &&
      execResult.testResults.every((t) => t.passed);

    if (allPassed) {
      handleSolved();
    }
  }, [problem, pyStatus, code, runCode, handleSolved]);

  function handleGiveUp() {
    onComplete({
      score: 5,
      timeSpent: Math.round((Date.now() - startTimeRef.current) / 1000),
    });
  }

  function revealHint() {
    if (!problem) return;
    const hints = problem.hints ? JSON.parse(problem.hints) : null;
    const approach = problem.solutionApproach;
    setHintText(
      hints?.[0] ||
        approach ||
        "Think about the pattern you just learned in this session."
    );
  }

  if (loading) {
    return (
      <div className="text-center text-white/30 py-20">
        Loading problem...
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="text-center space-y-4 py-20">
        <p className="text-white/40">
          Problem &quot;{config.problemSlug}&quot; not found.
        </p>
        <button
          onClick={() => onComplete({ score: 0, timeSpent: 0 })}
          className="text-sm text-primary hover:underline cursor-pointer"
        >
          Skip →
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-xs uppercase tracking-widest text-white/20 mb-1">
          Code
        </p>
        <h3 className="text-lg font-semibold text-white">{problem.title}</h3>
      </div>

      {/* Context hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-lg border border-primary/10 bg-primary/[0.03] px-4 py-2.5 text-center"
      >
        <p className="text-xs text-primary/60">{config.contextHint}</p>
      </motion.div>

      {/* Code editor */}
      <div
        className="rounded-xl border border-white/[0.06] overflow-hidden"
        style={{ height: "45vh" }}
      >
        <CodeEditor
          initialCode={code}
          onChange={setCode}
          fontSize={14}
          language="python"
        />
      </div>

      {/* Run / Submit buttons */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={handleRunTests}
          disabled={pyStatus !== "ready" || solved}
          className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
            pyStatus !== "ready" || solved
              ? "bg-white/5 text-white/20 cursor-not-allowed"
              : "bg-gradient-to-r from-cyan-500 to-cyan-400 text-black hover:shadow-lg hover:shadow-cyan-500/20 cursor-pointer"
          }`}
        >
          {pyStatus === "loading"
            ? "Loading Python..."
            : pyStatus === "running"
            ? "Running..."
            : "▶ Run Tests"}
        </button>
      </div>

      {/* Test results */}
      {result?.testResults && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          {result.testResults.map((tr) => (
            <div
              key={tr.index}
              className={`rounded-lg border p-3 text-xs ${
                tr.passed
                  ? "border-emerald-500/20 bg-emerald-500/5"
                  : "border-red-500/20 bg-red-500/5"
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={
                    tr.passed ? "text-emerald-400" : "text-red-400"
                  }
                >
                  {tr.passed ? "✓" : "✗"}
                </span>
                <span className="text-white/60">Test {tr.index}</span>
                {!tr.passed && (
                  <span className="text-red-400/60 ml-auto">
                    Expected:{" "}
                    {typeof tr.expectedOutput === "object"
                      ? JSON.stringify(tr.expectedOutput)
                      : String(tr.expectedOutput)}{" "}
                    | Got:{" "}
                    {typeof tr.actualOutput === "object"
                      ? JSON.stringify(tr.actualOutput)
                      : String(tr.actualOutput ?? "")}
                  </span>
                )}
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {result?.error && !result.testResults && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-lg border border-red-500/20 bg-red-500/5 p-3"
        >
          <pre className="text-xs text-red-400 whitespace-pre-wrap">
            {result.error}
          </pre>
        </motion.div>
      )}

      {/* Hints */}
      {hintText && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-4"
        >
          <p className="text-xs text-yellow-400/80">{hintText}</p>
        </motion.div>
      )}

      <div className="flex items-center justify-center gap-4">
        {showHint && !solved && !hintText && (
          <motion.button
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={revealHint}
            className="text-xs text-yellow-400/50 hover:text-yellow-400 transition-colors cursor-pointer"
          >
            💡 Show hint
          </motion.button>
        )}

        {showApproach && !solved && (
          <motion.button
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={handleGiveUp}
            className="text-xs text-white/20 hover:text-white/40 transition-colors cursor-pointer"
          >
            Show solution &amp; continue
          </motion.button>
        )}
      </div>

      {/* Solved celebration */}
      {solved && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5 text-center"
        >
          <p className="text-emerald-400 font-semibold">
            All tests passed! 🎉
          </p>
          <p className="text-xs text-emerald-400/50 mt-1">
            Continuing to reflection...
          </p>
        </motion.div>
      )}
    </div>
  );
}
