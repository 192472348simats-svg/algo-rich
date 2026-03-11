"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import PatternCard from "@/app/components/patterns/PatternCard";
import { patterns } from "@/lib/patterns/patternDefinitions";
import Link from "next/link";
import PatternFlowchart from "./PatternFlowchart";

type CategoryFilter = "all" | "arrays" | "linkedlists" | "trees" | "graphs" | "dynamic";

const categoryLabels: Record<CategoryFilter, string> = {
  all: "All Patterns",
  arrays: "Arrays & Strings",
  linkedlists: "Linked Lists",
  trees: "Trees & Graphs",
  graphs: "Advanced",
  dynamic: "Dynamic Programming",
};

interface PatternsPageContentProps {
  patternProgress: Record<
    string,
    {
      status: string;
      visualizationWatched: boolean;
      templateStudied: boolean;
      quizPassed: boolean;
      problemsSolved: number;
    }
  >;
}

export default function PatternsPageContent({
  patternProgress,
}: PatternsPageContentProps) {
  const [filter, setFilter] = useState<CategoryFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFlowchart, setShowFlowchart] = useState(false);

  const filteredPatterns = useMemo(() => {
    return patterns.filter((p) => {
      const matchesCategory = filter === "all" || p.category === filter;
      const matchesSearch =
        !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [filter, searchQuery]);

  const completedCount = Object.values(patternProgress).filter(
    (p) => p.status === "completed"
  ).length;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Pattern Library
          </h1>
          <p className="text-sm text-muted-foreground">
            Master the 15 essential problem-solving patterns •{" "}
            {completedCount}/{patterns.length} mastered
          </p>
        </div>
      </div>

      {/* Overall progress bar */}
      <div className="card-shiny p-4 mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-muted-foreground">Overall Progress</span>
          <span className="text-primary font-semibold">
            {Math.round((completedCount / patterns.length) * 100)}%
          </span>
        </div>
        <div className="h-2 bg-card/60 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{
              width: `${(completedCount / patterns.length) * 100}%`,
            }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="h-full rounded-full"
            style={{ background: "var(--gradient-gold)" }}
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {Object.entries(categoryLabels).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilter(key as CategoryFilter)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                filter === key
                  ? "bg-primary/20 text-primary border border-primary/40"
                  : "text-muted-foreground border border-border hover:text-foreground"
              }`}
            >
              {label}
            </button>
          ))}
          <button
            onClick={() => setShowFlowchart((v) => !v)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              showFlowchart
                ? "bg-primary/20 text-primary border border-primary/40"
                : "text-muted-foreground border border-border hover:text-foreground"
            }`}
          >
            🤔 Which pattern?
          </button>
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search patterns..."
          className="px-4 py-2 rounded-xl bg-card border border-border text-sm text-foreground focus:outline-none focus:border-primary transition-colors sm:ml-auto sm:w-64"
        />
      </div>

      {/* Pattern Flowchart */}
      {showFlowchart && <PatternFlowchart />}

      {/* Pattern grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPatterns.map((pattern, i) => {
          const progress = patternProgress[pattern.id];
          const status = progress
            ? (progress.status as "locked" | "available" | "in-progress" | "completed")
            : i === 0
            ? "available"
            : "locked";

          return (
            <motion.div
              key={pattern.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href={`/dashboard/patterns/${pattern.id}`}>
                <PatternCard
                  name={pattern.name}
                  slug={pattern.slug}
                  description={pattern.description}
                  icon={pattern.icon}
                  difficulty={pattern.difficulty as 1 | 2 | 3 | 4 | 5}
                  category={pattern.category}
                  status={status}
                  progress={
                    progress
                      ? {
                          visualizationWatched: progress.visualizationWatched,
                          templateStudied: progress.templateStudied,
                          quizPassed: progress.quizPassed,
                          problemsSolved: progress.problemsSolved,
                          totalProblems: 5,
                        }
                      : undefined
                  }
                />
              </Link>
            </motion.div>
          );
        })}
      </div>

      {filteredPatterns.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground/70">No patterns match your search</p>
        </div>
      )}
    </div>
  );
}
