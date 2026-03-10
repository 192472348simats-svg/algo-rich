"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { difficultyColor, categoryIcon } from "@/lib/utils";

interface LessonItem {
  id: string;
  title: string;
  order: number;
  difficulty: string;
  estimatedTime: number;
  isCompleted: boolean;
  isUnlocked: boolean;
  masteryLevel?: string;
  problemCount?: number;
}

interface Props {
  course: {
    id: string;
    title: string;
    description: string;
    category: string;
  };
  lessons: LessonItem[];
  completedCount: number;
  totalLessons: number;
  totalTime: number;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
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

export default function CourseOverviewContent({
  course,
  lessons,
  completedCount,
  totalLessons,
  totalTime,
}: Props) {
  const pct = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
  const hours = Math.floor(totalTime / 60);
  const mins = totalTime % 60;
  const timeStr = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-4xl mx-auto pt-8 lg:pt-0"
    >
      {/* Back link */}
      <motion.div variants={itemVariants} className="mb-6">
        <Link
          href="/dashboard"
          className="text-gray-light/50 hover:text-gold-primary text-sm transition-colors inline-flex items-center gap-1.5"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </Link>
      </motion.div>

      {/* Course Header */}
      <motion.div
        variants={itemVariants}
        className="bg-gradient-to-br from-navy-light/40 to-navy-dark/40 border border-gold-primary/20 rounded-xl p-8 mb-8"
      >
        <div className="flex items-start gap-4 mb-4">
          <span className="text-4xl">{categoryIcon(course.category)}</span>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white mb-2">{course.title}</h1>
            <p className="text-gray-light/70 leading-relaxed">{course.description}</p>
          </div>
        </div>

        {/* Stats row */}
        <div className="flex flex-wrap gap-6 mt-6 text-sm">
          <div className="flex items-center gap-2 text-gray-light/60">
            <span>📚</span>
            <span>{totalLessons} lessons</span>
          </div>
          <div className="flex items-center gap-2 text-gray-light/60">
            <span>⏱️</span>
            <span>{timeStr} total</span>
          </div>
          <div className="flex items-center gap-2 text-gray-light/60">
            <span>✅</span>
            <span>{completedCount} completed</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-5">
          <div className="flex justify-between text-xs text-gray-light/50 mb-2">
            <span>Progress</span>
            <span>{pct}%</span>
          </div>
          <div className="w-full h-3 bg-navy-dark/60 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-gold-primary to-gold-light rounded-full"
            />
          </div>
        </div>
      </motion.div>

      {/* Lessons List */}
      <motion.div variants={itemVariants}>
        <h2 className="text-xl font-bold text-white mb-5">Lessons</h2>
        <div className="space-y-3">
          {lessons.map((lesson) => {
            const isClickable = lesson.isUnlocked;

            const card = (
              <motion.div
                whileHover={isClickable ? { x: 4 } : undefined}
                className={`flex items-center gap-4 p-5 rounded-xl border transition-all duration-200 ${
                  lesson.isCompleted
                    ? "bg-gold-primary/5 border-gold-primary/30"
                    : lesson.isUnlocked
                    ? "bg-navy-light/20 border-navy-light/30 hover:border-gold-primary/40 cursor-pointer"
                    : "bg-navy-dark/40 border-navy-light/10 opacity-60"
                }`}
              >
                {/* Lesson number badge */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                    lesson.isCompleted
                      ? "bg-gold-primary text-navy-dark"
                      : lesson.isUnlocked
                      ? "bg-navy-light/50 text-gray-light/80 border border-gray-light/20"
                      : "bg-navy-dark/60 text-gray-light/30 border border-gray-light/10"
                  }`}
                >
                  {lesson.isCompleted ? "✓" : lesson.order}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3
                      className={`font-semibold truncate ${
                        lesson.isCompleted
                          ? "text-gold-light"
                          : lesson.isUnlocked
                          ? "text-white"
                          : "text-gray-light/40"
                      }`}
                    >
                      {lesson.title}
                    </h3>
                    {/* Mastery badge */}
                    {lesson.masteryLevel && lesson.masteryLevel !== "none" && (
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-full border flex-shrink-0 ${
                          lesson.masteryLevel === "mastered"
                            ? "bg-gold-primary/20 border-gold-primary/40 text-gold-primary"
                            : lesson.masteryLevel === "practiced"
                            ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                            : "bg-blue-500/15 border-blue-500/30 text-blue-400"
                        }`}
                      >
                        {lesson.masteryLevel === "mastered"
                          ? "⭐ Mastered"
                          : lesson.masteryLevel === "practiced"
                          ? "✓ Practiced"
                          : "📖 Read"}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full border ${difficultyColor(
                        lesson.difficulty
                      )}`}
                    >
                      {lesson.difficulty}
                    </span>
                    <span className="text-xs text-gray-light/40">
                      {lesson.estimatedTime} min
                    </span>
                    {(lesson.problemCount ?? 0) > 0 && (
                      <span className="text-xs text-gray-light/40">
                        🎯 {lesson.problemCount} problem{lesson.problemCount !== 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                </div>

                {/* Status icon */}
                <div className="flex-shrink-0 text-lg">
                  {lesson.isCompleted ? (
                    <span className="text-gold-primary">✓</span>
                  ) : !lesson.isUnlocked ? (
                    <span className="text-gray-light/30">🔒</span>
                  ) : (
                    <svg
                      className="w-5 h-5 text-gray-light/30"
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
                  )}
                </div>
              </motion.div>
            );

            return isClickable ? (
              <Link key={lesson.id} href={`/dashboard/lesson/${lesson.id}`}>
                {card}
              </Link>
            ) : (
              <div key={lesson.id}>{card}</div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}
