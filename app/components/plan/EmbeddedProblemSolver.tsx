"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

const ProblemSolver = dynamic(
  () => import("@/app/dashboard/practice/[problemId]/ProblemSolver"),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-[60vh] bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-white/40 text-sm">Loading editor...</span>
        </div>
      </div>
    ),
  }
);

interface Props {
  problemId: string;
  userId: string;
  onSolved?: () => void;
}

interface FetchedProblem {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  category: string;
  starterCode: string;
  testCases: Array<{
    input: Record<string, unknown> | string;
    expectedOutput: unknown;
  }>;
}

/**
 * Fetches a problem by ID from the API, then renders the existing
 * ProblemSolver component. Used inside plan steps to avoid duplicating
 * the code editor / test runner logic.
 */
export default function EmbeddedProblemSolver({
  problemId,
  userId,
  onSolved,
}: Props) {
  const [problem, setProblem] = useState<FetchedProblem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/problems/${problemId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load problem");
        return res.json();
      })
      .then((data) => {
        // Parse testCases if they come as a string
        let testCases = data.testCases;
        if (typeof testCases === "string") {
          try {
            testCases = JSON.parse(testCases);
          } catch {
            testCases = [];
          }
        }

        setProblem({
          id: data.id,
          title: data.title,
          description: data.description,
          difficulty: data.difficulty,
          category: data.category || data.pattern || "DSA",
          starterCode: data.starterCode,
          testCases: testCases || [],
        });
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [problemId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <motion.div
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="text-white/30 text-sm"
        >
          Loading problem...
        </motion.div>
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <p className="text-white/30 text-sm">
          {error || "Problem not found"}
        </p>
      </div>
    );
  }

  return (
    <ProblemSolver
      problem={problem}
      isSolved={false}
      userId={userId}
      onSolved={onSolved}
    />
  );
}
