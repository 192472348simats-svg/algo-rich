"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface CourseItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  difficulty: string;
  totalLessons: number;
  completedLessons: number;
  href: string;
}

const diffBadge: Record<string, string> = {
  beginner: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  intermediate: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  advanced: "bg-rose-500/10 text-rose-400 border-rose-500/20",
};

export default function CoursesListContent({ courses }: { courses: CourseItem[] }) {
  return (
    <div className="max-w-5xl mx-auto pt-4 lg:pt-0">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold text-white">Courses</h1>
        <p className="text-sm text-white/40 mt-1">
          {courses.length} courses &middot; Structured learning path from basics to advanced
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {courses.map((course, i) => {
          const pct =
            course.totalLessons > 0
              ? Math.round((course.completedLessons / course.totalLessons) * 100)
              : 0;

          return (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -3 }}
              className="rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-gold-primary/20 p-6 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{course.icon}</span>
                  <div>
                    <h3 className="text-lg font-bold text-white">{course.title}</h3>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${diffBadge[course.difficulty] ?? diffBadge.beginner}`}>
                      {course.difficulty}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-white/50 leading-relaxed mb-4 line-clamp-2">
                {course.description}
              </p>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-white/40 mb-1.5">
                  <span>Progress</span>
                  <span>{course.completedLessons}/{course.totalLessons} lessons</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-gold-primary to-gold-light rounded-full"
                  />
                </div>
              </div>

              <Link href={course.href}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-2.5 border border-gold-primary/30 text-gold-primary font-medium rounded-lg hover:bg-gold-primary/10 transition-all text-sm"
                >
                  {pct > 0 ? "Continue" : "Start Course"}
                </motion.button>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
