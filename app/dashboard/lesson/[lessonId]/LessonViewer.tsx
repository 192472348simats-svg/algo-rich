"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import MarkdownContent from "@/app/components/MarkdownContent";
import ConceptConnectionCard from "@/app/components/learning/ConceptConnectionCard";
import { triggerSuccessConfetti } from "@/app/components/feedback/Confetti";
import { difficultyColor } from "@/lib/utils";
import { getVisualizerForLesson } from "@/lib/lessonVisualizerMap";

interface ConnectedProblem {
  id: string;
  slug: string;
  title: string;
  difficulty: string;
  solved: boolean;
  attempts: number;
}

interface Props {
  lesson: {
    id: string;
    title: string;
    content: string;
    codeExample: string | null;
    difficulty: string;
    estimatedTime: number;
    order: number;
  };
  course: {
    id: string;
    title: string;
  };
  isCompleted: boolean;
  prevLesson: { id: string; title: string; order: number } | null;
  nextLesson: { id: string; title: string; order: number } | null;
  totalLessons: number;
  connectedProblems?: ConnectedProblem[];
  masteryLevel?: string;
}


export default function LessonViewer({
  lesson,
  course,
  isCompleted: initialCompleted,
  prevLesson,
  nextLesson,
  totalLessons,
  connectedProblems = [],
  masteryLevel = "none",
}: Props) {
  const [completed, setCompleted] = useState(initialCompleted);
  const [marking, setMarking] = useState(false);

  // Extract headings for TOC
  const headings = useMemo(() => {
    const matches = lesson.content.match(/^## (.+)$/gm);
    if (!matches) return [];
    return matches.map((m) => {
      const text = m.replace(/^## /, "");
      const id = text
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]/g, "");
      return { text, id };
    });
  }, [lesson.content]);

  // Highlight current heading in view
  const [activeId, setActiveId] = useState<string>("");
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-100px 0px -60% 0px" }
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  async function markComplete() {
    if (completed || marking) return;
    setMarking(true);
    try {
      const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId: lesson.id }),
      });
      if (res.ok) {
        setCompleted(true);
        triggerSuccessConfetti();
      }
    } catch {
      // silently fail
    } finally {
      setMarking(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" as const }}
      className="max-w-7xl mx-auto pt-8 lg:pt-0"
    >
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-light/50 mb-6 flex-wrap">
        <Link href="/dashboard" className="hover:text-gold-primary transition-colors">
          Dashboard
        </Link>
        <span>/</span>
        <Link
          href={`/dashboard/courses/${course.id}`}
          className="hover:text-gold-primary transition-colors"
        >
          {course.title}
        </Link>
        <span>/</span>
        <span className="text-gold-light/70">Lesson {lesson.order}</span>
      </nav>

      {/* Main layout */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main content - left column */}
        <div className="flex-1 min-w-0">
          {/* Lesson header */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4, ease: "easeOut" as const }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <span
                className={`text-xs px-2.5 py-1 rounded-full border ${difficultyColor(
                  lesson.difficulty
                )}`}
              >
                {lesson.difficulty}
              </span>
              <span className="text-xs text-gray-light/40">
                ⏱️ {lesson.estimatedTime} min
              </span>
              <span className="text-xs text-gray-light/40">
                📖 Lesson {lesson.order} of {totalLessons}
              </span>
              {completed && (
                <span className="text-xs text-gold-primary flex items-center gap-1">
                  ✓ Completed
                </span>
              )}
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-white">{lesson.title}</h1>
          </motion.div>

          {/* Why This Matters — Concept Connection */}
          <ConceptConnectionCard
            courseTitle={course.title}
            lessonTitle={lesson.title}
          />

          {/* Markdown content */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4, ease: "easeOut" as const }}
            className="bg-navy-light/10 border border-navy-light/20 rounded-xl p-6 lg:p-8"
          >
            <MarkdownContent content={lesson.content} />
          </motion.div>

          {/* Code example (if separate) */}
          {lesson.codeExample && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4, ease: "easeOut" as const }}
              className="mt-6 bg-navy-light/10 border border-gold-primary/20 rounded-xl p-6"
            >
              <h3 className="text-lg font-bold text-gold-primary mb-4 flex items-center gap-2">
                💻 Code Example
              </h3>
              <MarkdownContent content={`\`\`\`python\n${lesson.codeExample}\n\`\`\``} />
            </motion.div>
          )}

          {/* Practice This — Connected Problems */}
          {connectedProblems.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.4, ease: "easeOut" as const }}
              className="mt-6 bg-navy-light/10 border border-gold-primary/20 rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gold-primary flex items-center gap-2">
                  🎯 Practice This
                </h3>
                {masteryLevel !== "none" && (
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full border ${
                      masteryLevel === "mastered"
                        ? "bg-gold-primary/20 border-gold-primary/40 text-gold-primary"
                        : masteryLevel === "practiced"
                        ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                        : "bg-blue-500/15 border-blue-500/30 text-blue-400"
                    }`}
                  >
                    {masteryLevel === "mastered"
                      ? "⭐ Mastered"
                      : masteryLevel === "practiced"
                      ? "✓ Practiced"
                      : "📖 Read"}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-light/60 mb-4">
                Reinforce what you learned with these practice problems:
              </p>
              <div className="space-y-2">
                {connectedProblems.map((problem) => (
                  <Link
                    key={problem.id}
                    href={`/dashboard/practice/${problem.id}`}
                    className="flex items-center gap-3 p-3 rounded-lg border border-navy-light/20 hover:border-gold-primary/30 hover:bg-navy-light/10 transition-all group"
                  >
                    {/* Status icon */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        problem.solved
                          ? "bg-gold-primary/20 text-gold-primary"
                          : "bg-navy-light/30 text-gray-light/40 group-hover:text-gray-light/70"
                      }`}
                    >
                      {problem.solved ? "✓" : "→"}
                    </div>

                    {/* Problem info */}
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-medium truncate ${
                          problem.solved
                            ? "text-gold-light"
                            : "text-white group-hover:text-gold-light"
                        }`}
                      >
                        {problem.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span
                          className={`text-xs px-1.5 py-0.5 rounded border ${difficultyColor(
                            problem.difficulty
                          )}`}
                        >
                          {problem.difficulty}
                        </span>
                        {problem.attempts > 0 && !problem.solved && (
                          <span className="text-xs text-gray-light/40">
                            {problem.attempts} attempt{problem.attempts !== 1 ? "s" : ""}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Arrow */}
                    <svg
                      className="w-4 h-4 text-gray-light/30 group-hover:text-gold-primary transition-colors flex-shrink-0"
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
                  </Link>
                ))}
              </div>
              {/* Mastery progress */}
              {connectedProblems.length > 0 && (
                <div className="mt-4 pt-4 border-t border-navy-light/20">
                  <div className="flex justify-between text-xs text-gray-light/50 mb-1.5">
                    <span>Problems solved</span>
                    <span>
                      {connectedProblems.filter((p) => p.solved).length} /{" "}
                      {connectedProblems.length}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-navy-dark/40 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${
                          (connectedProblems.filter((p) => p.solved).length /
                            connectedProblems.length) *
                          100
                        }%`,
                      }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-gold-primary to-gold-light rounded-full"
                    />
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Bottom navigation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.4, ease: "easeOut" as const }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            {/* Mark complete button */}
            <button
              onClick={markComplete}
              disabled={completed || marking}
              className={`px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-300 ${
                completed
                  ? "bg-gold-primary/20 text-gold-primary cursor-default border border-gold-primary/30"
                  : marking
                  ? "bg-navy-light/40 text-gray-light/50 cursor-wait"
                  : "bg-gold-primary text-navy-dark hover:bg-gold-light cursor-pointer"
              }`}
            >
              {completed ? "✓ Lesson Complete" : marking ? "Marking..." : "Mark as Complete"}
            </button>

            {/* Prev / Next */}
            <div className="flex items-center gap-3">
              {prevLesson && (
                <Link
                  href={`/dashboard/lesson/${prevLesson.id}`}
                  className="flex items-center gap-2 px-4 py-2.5 border border-navy-light/30 rounded-lg text-gray-light/70 hover:text-white hover:border-gold-primary/40 transition-all text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span className="hidden sm:inline">Prev</span>
                </Link>
              )}
              {nextLesson && (
                <Link
                  href={`/dashboard/lesson/${nextLesson.id}`}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gold-primary/10 border border-gold-primary/30 rounded-lg text-gold-light hover:bg-gold-primary/20 transition-all text-sm"
                >
                  <span className="hidden sm:inline">Next</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              )}
            </div>
          </motion.div>
        </div>

        {/* Sidebar - right column */}
        <motion.aside
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" as const }}
          className="lg:w-72 flex-shrink-0 order-first lg:order-last"
        >
          <div className="lg:sticky lg:top-8 space-y-5">
            {/* Lesson info card */}
            <div className="bg-navy-light/20 border border-navy-light/30 rounded-xl p-5">
              <h3 className="text-sm font-bold text-gold-primary mb-3">Lesson Info</h3>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between text-gray-light/60">
                  <span>Course</span>
                  <span className="text-gray-light/90 text-right max-w-[140px] truncate">
                    {course.title}
                  </span>
                </div>
                <div className="flex justify-between text-gray-light/60">
                  <span>Lesson</span>
                  <span className="text-gray-light/90">
                    {lesson.order} / {totalLessons}
                  </span>
                </div>
                <div className="flex justify-between text-gray-light/60">
                  <span>Duration</span>
                  <span className="text-gray-light/90">{lesson.estimatedTime} min</span>
                </div>
                <div className="flex justify-between text-gray-light/60">
                  <span>Difficulty</span>
                  <span className="text-gray-light/90 capitalize">{lesson.difficulty}</span>
                </div>
                <div className="flex justify-between text-gray-light/60">
                  <span>Status</span>
                  <span className={completed ? "text-gold-primary" : "text-gray-light/50"}>
                    {completed ? "Completed ✓" : "In Progress"}
                  </span>
                </div>
              </div>
            </div>

            {/* Table of Contents */}
            {headings.length > 0 && (
              <div className="bg-navy-light/20 border border-navy-light/30 rounded-xl p-5">
                <h3 className="text-sm font-bold text-gold-primary mb-3">On This Page</h3>
                <nav className="space-y-1">
                  {headings.map((h) => (
                    <a
                      key={h.id}
                      href={`#${h.id}`}
                      className={`block text-sm py-1 pl-3 border-l-2 transition-colors ${
                        activeId === h.id
                          ? "border-gold-primary text-gold-light"
                          : "border-transparent text-gray-light/50 hover:text-gray-light/80 hover:border-gray-light/30"
                      }`}
                    >
                      {h.text}
                    </a>
                  ))}
                </nav>
              </div>
            )}

            {/* Quick actions */}
            <div className="bg-navy-light/20 border border-navy-light/30 rounded-xl p-5">
              <h3 className="text-sm font-bold text-gold-primary mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <Link
                  href={`/dashboard/courses/${course.id}`}
                  className="flex items-center gap-2 text-sm text-gray-light/60 hover:text-gold-light transition-colors"
                >
                  📚 All Lessons
                </Link>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 text-sm text-gray-light/60 hover:text-gold-light transition-colors"
                >
                  🏠 Dashboard
                </Link>
                {getVisualizerForLesson(lesson.title, course.title) && (
                  <Link
                    href={`/dashboard/visualize?type=${getVisualizerForLesson(lesson.title, course.title)}`}
                    className="flex items-center gap-2 text-sm text-purple-400/70 hover:text-purple-300 transition-colors"
                  >
                    🎬 Visualize This
                  </Link>
                )}
              </div>
            </div>
          </div>
        </motion.aside>
      </div>
    </motion.div>
  );
}
