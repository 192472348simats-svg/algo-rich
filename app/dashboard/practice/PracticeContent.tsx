"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { difficultyColor } from "@/lib/utils";
import EmptyState from "@/app/components/ui/EmptyState";

interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  category: string;
  phase?: number;
  isSolved: boolean;
  topics?: string[];
  topicOrder?: number;
  connectedLessons?: { id: string; slug: string; title: string }[];
}

interface Props {
  problems: Problem[];
}

const filters = ["All", "Easy", "Medium", "Hard"];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

export default function PracticeContent({ problems }: Props) {
  const searchParams = useSearchParams();
  const initialPhase = searchParams.get("phase");
  const [activeFilter, setActiveFilter] = useState("All");
  const [phaseFilter, setPhaseFilter] = useState<number | null>(
    initialPhase ? parseInt(initialPhase) : null
  );
  const [viewMode, setViewMode] = useState<"grid" | "topic">("grid");
  const [companies, setCompanies] = useState<{ name: string; count: number }[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [companyProblemIds, setCompanyProblemIds] = useState<Set<string> | null>(null);

  // Fetch available companies on mount
  useEffect(() => {
    fetch("/api/problems/by-company")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.companies) setCompanies(data.companies);
      })
      .catch(() => {});
  }, []);

  // When a company is selected, fetch its problem IDs
  const handleCompanySelect = useCallback(
    async (company: string | null) => {
      setSelectedCompany(company);
      if (!company) {
        setCompanyProblemIds(null);
        return;
      }
      try {
        const res = await fetch(
          `/api/problems/by-company?company=${encodeURIComponent(company)}`
        );
        if (res.ok) {
          const data = await res.json();
          setCompanyProblemIds(
            new Set((data.problems ?? []).map((p: { id: string }) => p.id))
          );
        }
      } catch {
        setCompanyProblemIds(null);
      }
    },
    []
  );

  const filtered = useMemo(() => {
    let result =
      activeFilter === "All"
        ? problems
        : problems.filter(
            (p) => p.difficulty.toLowerCase() === activeFilter.toLowerCase()
          );
    if (phaseFilter) {
      result = result.filter((p) => p.phase === phaseFilter);
    }
    if (companyProblemIds) {
      result = result.filter((p) => companyProblemIds.has(p.id));
    }
    return result;
  }, [problems, activeFilter, phaseFilter, companyProblemIds]);

  const solvedCount = problems.filter((p) => p.isSolved).length;

  // Group problems by topic (from connected lessons or topics field)
  const topicGroups = useMemo(() => {
    const groups: Record<string, { title: string; problems: Problem[] }> = {};

    for (const problem of filtered) {
      // Group by connected lesson titles
      if (problem.connectedLessons && problem.connectedLessons.length > 0) {
        for (const lesson of problem.connectedLessons) {
          if (!groups[lesson.id]) {
            groups[lesson.id] = { title: lesson.title, problems: [] };
          }
          if (!groups[lesson.id].problems.find((p) => p.id === problem.id)) {
            groups[lesson.id].problems.push(problem);
          }
        }
      } else {
        // Fallback: group by category
        const key = problem.category || "Other";
        if (!groups[key]) {
          groups[key] = { title: key, problems: [] };
        }
        groups[key].problems.push(problem);
      }
    }

    // Sort problems within each group by topicOrder
    for (const group of Object.values(groups)) {
      group.problems.sort((a, b) => (a.topicOrder || 0) - (b.topicOrder || 0));
    }

    return Object.values(groups);
  }, [filtered]);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-6xl mx-auto pt-8 lg:pt-0"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Practice Problems</h1>
        <p className="text-gray-light/60">
          Sharpen your skills with hands-on Python challenges.{" "}
          <span className="text-gold-primary font-medium">
            {solvedCount}/{problems.length}
          </span>{" "}
          solved
        </p>
      </motion.div>

      {/* Filter Tabs + View Toggle */}
      <motion.div variants={itemVariants} className="flex items-center justify-between mb-8 flex-wrap gap-3">
        <div className="flex gap-2 flex-wrap">
          {filters.map((f) => {
            const count =
              f === "All"
                ? problems.length
                : problems.filter(
                    (p) => p.difficulty.toLowerCase() === f.toLowerCase()
                  ).length;
            return (
              <motion.button
                key={f}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeFilter === f
                    ? "bg-gold-primary/15 text-gold-primary border border-gold-primary/30"
                    : "text-gray-light/60 hover:text-gray-light hover:bg-navy-light/30 border border-transparent"
                }`}
              >
                {f}
                <span className="ml-1.5 text-xs opacity-60">({count})</span>
              </motion.button>
            );
          })}
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-navy-light/20 border border-navy-light/30 rounded-lg p-1">
          <button
            onClick={() => setViewMode("grid")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              viewMode === "grid"
                ? "bg-gold-primary/15 text-gold-primary"
                : "text-gray-light/50 hover:text-gray-light/80"
            }`}
          >
            Grid
          </button>
          <button
            onClick={() => setViewMode("topic")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              viewMode === "topic"
                ? "bg-gold-primary/15 text-gold-primary"
                : "text-gray-light/50 hover:text-gray-light/80"
            }`}
          >
            By Topic
          </button>
        </div>
      </motion.div>

      {/* Phase Filter */}
      <motion.div variants={itemVariants} className="flex gap-2 flex-wrap mb-4">
        {[
          { label: "All Phases", value: null },
          { label: "🐍 Phase 1", value: 1 },
          { label: "🧩 Phase 2", value: 2 },
          { label: "🏗️ Phase 3", value: 3 },
          { label: "⚡ Phase 4", value: 4 },
          { label: "🎯 Phase 5", value: 5 },
        ].map((p) => {
          const count = p.value
            ? problems.filter((pr) => pr.phase === p.value).length
            : problems.length;
          if (count === 0 && p.value) return null;
          return (
            <button
              key={p.label}
              onClick={() => setPhaseFilter(p.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                phaseFilter === p.value
                  ? "bg-primary/15 text-primary border border-primary/30"
                  : "text-white/40 hover:text-white/60 hover:bg-white/[0.04] border border-transparent"
              }`}
            >
              {p.label}
              <span className="ml-1 opacity-60">({count})</span>
            </button>
          );
        })}
      </motion.div>

      {/* Company Filter */}
      {companies.length > 0 && (
        <motion.div variants={itemVariants} className="flex items-center gap-2 mb-6 flex-wrap">
          <span className="text-xs text-white/30 uppercase tracking-wider mr-1">Company:</span>
          <button
            onClick={() => handleCompanySelect(null)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              !selectedCompany
                ? "bg-gold-primary/15 text-gold-primary border border-gold-primary/30"
                : "text-gray-light/50 hover:text-gray-light border border-transparent"
            }`}
          >
            All
          </button>
          {companies.slice(0, 10).map((c) => (
            <button
              key={c.name}
              onClick={() => handleCompanySelect(c.name)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                selectedCompany === c.name
                  ? "bg-gold-primary/15 text-gold-primary border border-gold-primary/30"
                  : "text-gray-light/50 hover:text-gray-light border border-transparent hover:bg-navy-light/30"
              }`}
            >
              {c.name} <span className="opacity-60">({c.count})</span>
            </button>
          ))}
        </motion.div>
      )}

      {/* Problems */}
      {filtered.length === 0 ? (
        <EmptyState
          icon="🔍"
          title="No problems found"
          message={`No ${activeFilter.toLowerCase()} problems available yet. Try a different filter.`}
          actionLabel="Show All"
          onAction={() => setActiveFilter("All")}
        />
      ) : viewMode === "topic" ? (
        /* ── By Topic View ── */
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {topicGroups.map((group) => {
            const groupSolved = group.problems.filter((p) => p.isSolved).length;
            const groupTotal = group.problems.length;
            const pct = groupTotal > 0 ? Math.round((groupSolved / groupTotal) * 100) : 0;

            return (
              <motion.div key={group.title} variants={itemVariants}>
                {/* Topic header */}
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    📂 {group.title}
                  </h2>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-light/50">
                      {groupSolved}/{groupTotal} solved
                    </span>
                    <div className="w-20 h-1.5 bg-navy-dark/60 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-gold-primary to-gold-light rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Problems in topic — sequential list */}
                <div className="space-y-2">
                  {group.problems.map((problem, idx) => (
                    <Link key={problem.id} href={`/dashboard/practice/${problem.id}`}>
                      <motion.div
                        whileHover={{ x: 4 }}
                        className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 ${
                          problem.isSolved
                            ? "bg-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/40"
                            : "bg-navy-light/10 border-navy-light/20 hover:border-gold-primary/30"
                        }`}
                      >
                        {/* Order number */}
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                            problem.isSolved
                              ? "bg-emerald-500/20 text-emerald-400"
                              : "bg-navy-light/40 text-gray-light/60"
                          }`}
                        >
                          {problem.isSolved ? "✓" : idx + 1}
                        </div>

                        {/* Problem info */}
                        <div className="flex-1 min-w-0">
                          <p className={`font-medium truncate ${problem.isSolved ? "text-emerald-300" : "text-white"}`}>
                            {problem.title}
                          </p>
                          <p className="text-xs text-gray-light/40 truncate mt-0.5">
                            {problem.description.replace(/\*\*/g, "").replace(/\n/g, " ").slice(0, 80)}...
                          </p>
                        </div>

                        {/* Difficulty badge */}
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full border flex-shrink-0 ${difficultyColor(
                            problem.difficulty
                          )}`}
                        >
                          {problem.difficulty}
                        </span>

                        {/* Arrow */}
                        <svg
                          className="w-4 h-4 text-gray-light/20 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      ) : (
        /* ── Grid View (original) ── */
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {filtered.map((problem) => (
            <Link key={problem.id} href={`/dashboard/practice/${problem.id}`}>
              <motion.div
                variants={itemVariants}
                whileHover={{ y: -4, scale: 1.01 }}
                className={`group bg-gradient-to-br from-navy-light/20 to-navy-dark/20 border rounded-xl p-5 transition-all duration-300 cursor-pointer h-full ${
                  problem.isSolved
                    ? "border-emerald-500/20 hover:border-emerald-500/40"
                    : "border-navy-light/30 hover:border-gold-primary/30"
                }`}
                style={{ boxShadow: "var(--shadow-card)" }}
              >
                {/* Top row */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full border ${difficultyColor(
                        problem.difficulty
                      )}`}
                    >
                      {problem.difficulty}
                    </span>
                    <span className="text-xs text-gray-light/40 bg-navy-light/30 px-2 py-0.5 rounded-full">
                      {problem.category}
                    </span>
                  </div>
                  {problem.isSolved && (
                    <span className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Solved
                    </span>
                  )}
                </div>

                {/* Title + arrow */}
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-white font-semibold leading-snug group-hover:text-gold-primary transition-colors">
                    {problem.title}
                  </h3>
                  <svg
                    className="w-4 h-4 text-gray-light/20 group-hover:text-gold-primary group-hover:translate-x-1 transition-all duration-200"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>

                {/* Description preview */}
                <p className="text-sm text-gray-light/50 mb-4 line-clamp-2 leading-relaxed">
                  {problem.description.replace(/\*\*/g, "").replace(/\n/g, " ")}
                </p>

                {/* CTA */}
                <div
                  className={`w-full py-2 rounded-lg font-medium text-sm text-center transition-all duration-200 ${
                    problem.isSolved
                      ? "border border-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500/10"
                      : "bg-gradient-to-r from-gold-primary to-gold-light text-navy-dark"
                  }`}
                >
                  {problem.isSolved ? "Solve Again" : "Solve Problem"}
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
