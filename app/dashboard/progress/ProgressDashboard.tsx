"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ReadinessOverview from "@/app/dashboard/components/ReadinessOverview";
import { getStatusColor, type TimelineEvent } from "@/lib/masteryTimeline";
import type { FailureSummary } from "@/lib/failurePatternAnalysis";

interface StatsData {
  lessonsCompleted: number;
  totalLessons: number;
  problemsSolved: number;
  totalProblems: number;
  currentStreak: number;
  estimatedHours: number;
  progressOverTime: Array<{ date: string; count: number }>;
}

interface ActivityItem {
  id: string;
  type: "lesson" | "submission";
  title: string;
  description: string;
  date: string;
  passed?: boolean;
}

interface ReflectionStats {
  total: number;
  patternAccuracy: number;
  timeAccuracy: number;
  spaceAccuracy: number;
  optimizeAccuracy: number;
  overallAccuracy: number;
  patternDistribution: Record<string, number>;
  weakArea: { name: string; accuracy: number } | null;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

function formatRelativeDate(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHour = Math.floor(diffMs / 3600000);
  const diffDay = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function ProgressDashboard({ userName }: { userName: string }) {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [reflectionStats, setReflectionStats] = useState<ReflectionStats | null>(null);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [failureSummary, setFailureSummary] = useState<FailureSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, actRes, reflRes, timelineRes, failureRes] = await Promise.all([
          fetch("/api/user/stats"),
          fetch("/api/user/activity"),
          fetch("/api/reflections/stats"),
          fetch("/api/patterns/mastery-timeline"),
          fetch("/api/submissions/failure-stats"),
        ]);
        if (statsRes.ok) setStats(await statsRes.json());
        if (actRes.ok) setActivities(await actRes.json());
        if (reflRes.ok) setReflectionStats(await reflRes.json());
        if (timelineRes.ok) {
          const t = await timelineRes.json();
          setTimeline(t.timeline ?? []);
        }
        if (failureRes.ok) setFailureSummary(await failureRes.json());
      } catch (e) {
        console.error("Failed to fetch progress data:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-foreground text-lg">Loading your progress...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-20 text-foreground">
        <p className="text-lg">Unable to load progress data. Please try again.</p>
      </div>
    );
  }

  const lessonPercent = stats.totalLessons > 0
    ? Math.round((stats.lessonsCompleted / stats.totalLessons) * 100)
    : 0;
  const problemPercent = stats.totalProblems > 0
    ? Math.round((stats.problemsSolved / stats.totalProblems) * 100)
    : 0;
  const maxActivity = Math.max(...stats.progressOverTime.map((d) => d.count), 1);

  const statCards = [
    {
      label: "Lessons Completed",
      value: stats.lessonsCompleted,
      total: stats.totalLessons,
      percent: lessonPercent,
      icon: "📚",
      color: "#D4AF37",
    },
    {
      label: "Problems Solved",
      value: stats.problemsSolved,
      total: stats.totalProblems,
      percent: problemPercent,
      icon: "💻",
      color: "#7eb8ff",
    },
    {
      label: "Current Streak",
      value: stats.currentStreak,
      total: null,
      percent: null,
      icon: "🔥",
      color: "#ff7b54",
      suffix: stats.currentStreak === 1 ? "day" : "days",
    },
    {
      label: "Study Time",
      value: stats.estimatedHours,
      total: null,
      percent: null,
      icon: "⏱️",
      color: "#56d49e",
      suffix: "hours",
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-6xl mx-auto space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-white mb-1">
          Your Progress
        </h1>
        <p className="text-foreground opacity-70">
          Track your learning journey, {userName}
        </p>
      </motion.div>

      {/* Placement Readiness */}
      <motion.div variants={itemVariants}>
        <ReadinessOverview />
      </motion.div>

      {/* Stat Cards */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {statCards.map((card) => (
          <motion.div
            key={card.label}
            whileHover={{ y: -3, scale: 1.02 }}
            className="bg-card/60 border border-primary/10 rounded-xl p-5 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{card.icon}</span>
              {card.percent !== null && (
                <span
                  className="text-sm font-semibold px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: `${card.color}20`, color: card.color }}
                >
                  {card.percent}%
                </span>
              )}
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {card.value}
              {card.suffix && (
                <span className="text-sm font-normal text-foreground ml-2">
                  {card.suffix}
                </span>
              )}
            </div>
            <div className="text-sm text-foreground opacity-70">
              {card.label}
              {card.total !== null && (
                <span className="ml-1">/ {card.total}</span>
              )}
            </div>
            {card.percent !== null && (
              <div className="mt-3 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${card.percent}%` }}
                  transition={{ duration: 1, delay: 0.3, ease: "easeOut" as const }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: card.color }}
                />
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>

      {/* Activity Chart */}
      <motion.div
        variants={itemVariants}
        className="bg-card/60 border border-primary/10 rounded-xl p-6 backdrop-blur-sm"
      >
        <h2 className="text-xl font-semibold text-white mb-1">Activity (Last 30 Days)</h2>
        <p className="text-sm text-foreground opacity-60 mb-6">
          Lessons completed & problems attempted per day
        </p>
        <div className="flex items-end gap-[3px] h-40">
          {stats.progressOverTime.map((day, i) => {
            const height = day.count === 0 ? 4 : (day.count / maxActivity) * 100;
            const dayDate = new Date(day.date);
            const dayLabel = dayDate.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });
            const isToday = i === stats.progressOverTime.length - 1;
            return (
              <div
                key={day.date}
                className="flex-1 flex flex-col items-center justify-end h-full group relative"
              >
                {/* Tooltip */}
                <div className="absolute -top-8 bg-background text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none border border-primary/20">
                  {dayLabel}: {day.count} {day.count === 1 ? "activity" : "activities"}
                </div>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{
                    duration: 0.6,
                    delay: i * 0.02,
                    ease: "easeOut" as const,
                  }}
                  className={`w-full rounded-t-sm cursor-pointer transition-colors ${
                    day.count === 0
                      ? "bg-white/5"
                      : isToday
                        ? "bg-primary hover:bg-primary/80"
                        : "bg-primary/50 hover:bg-primary/70"
                  }`}
                  style={{ minHeight: day.count === 0 ? "4px" : undefined }}
                />
              </div>
            );
          })}
        </div>
        {/* X-axis labels */}
        <div className="flex justify-between mt-2 text-[10px] text-foreground opacity-50">
          <span>
            {stats.progressOverTime.length > 0
              ? new Date(stats.progressOverTime[0].date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              : ""}
          </span>
          <span>
            {stats.progressOverTime.length > 1
              ? new Date(
                  stats.progressOverTime[Math.floor(stats.progressOverTime.length / 2)].date
                ).toLocaleDateString("en-US", { month: "short", day: "numeric" })
              : ""}
          </span>
          <span>Today</span>
        </div>
      </motion.div>

      {/* Analysis Skills — Reflection Stats */}
      {reflectionStats && reflectionStats.total > 0 && (
        <motion.div
          variants={itemVariants}
          className="bg-card/60 border border-primary/10 rounded-xl p-6 backdrop-blur-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-white mb-1">Analysis Skills</h2>
              <p className="text-sm text-foreground opacity-60">
                Based on {reflectionStats.total} post-solve reflections
              </p>
            </div>
            <div className="text-center">
              <span className="text-3xl font-bold text-primary">
                {reflectionStats.overallAccuracy}%
              </span>
              <p className="text-[10px] text-foreground opacity-50">Overall</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <AnalysisMetric
              label="Pattern Recognition"
              accuracy={reflectionStats.patternAccuracy}
              icon="🎯"
              color="#D4AF37"
            />
            <AnalysisMetric
              label="Time Complexity"
              accuracy={reflectionStats.timeAccuracy}
              icon="⏱️"
              color="#7eb8ff"
            />
            <AnalysisMetric
              label="Space Complexity"
              accuracy={reflectionStats.spaceAccuracy}
              icon="💾"
              color="#56d49e"
            />
          </div>

          {reflectionStats.weakArea && reflectionStats.weakArea.accuracy < 70 && (
            <div className="p-3 rounded-lg border border-amber-500/20 bg-amber-500/5 text-sm flex items-start gap-2">
              <span>💡</span>
              <p className="text-foreground opacity-80">
                <span className="text-amber-400 font-medium">{reflectionStats.weakArea.name}</span> is your weakest area at {reflectionStats.weakArea.accuracy}%. Focus here for the biggest improvement.
              </p>
            </div>
          )}
        </motion.div>
      )}

      {/* Two Column — Completion Ring + Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Overall Completion */}
        <motion.div
          variants={itemVariants}
          className="bg-card/60 border border-primary/10 rounded-xl p-6 backdrop-blur-sm"
        >
          <h2 className="text-xl font-semibold text-white mb-6">Overall Completion</h2>
          <div className="flex items-center gap-8">
            {/* SVG Ring */}
            <div className="relative w-32 h-32 flex-shrink-0">
              <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  fill="none"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="10"
                />
                <motion.circle
                  cx="60"
                  cy="60"
                  r="52"
                  fill="none"
                  stroke="hsl(43 96% 56%)"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 52}
                  initial={{ strokeDashoffset: 2 * Math.PI * 52 }}
                  animate={{
                    strokeDashoffset:
                      2 * Math.PI * 52 * (1 - lessonPercent / 100),
                  }}
                  transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" as const }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-2xl font-bold text-white">{lessonPercent}%</span>
                <span className="text-[10px] text-foreground opacity-60">
                  Complete
                </span>
              </div>
            </div>
            <div className="space-y-4 flex-1">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-foreground">Lessons</span>
                  <span className="text-white font-medium">
                    {stats.lessonsCompleted}/{stats.totalLessons}
                  </span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${lessonPercent}%` }}
                    transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" as const }}
                    className="h-full bg-primary rounded-full"
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-foreground">Problems</span>
                  <span className="text-white font-medium">
                    {stats.problemsSolved}/{stats.totalProblems}
                  </span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${problemPercent}%` }}
                    transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" as const }}
                    className="h-full bg-[#7eb8ff] rounded-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Pattern Journey */}
        <motion.div
          variants={itemVariants}
          className="bg-card/60 border border-primary/10 rounded-xl p-6 backdrop-blur-sm"
        >
          <h2 className="text-xl font-semibold text-white mb-4">🗺️ Pattern Journey</h2>
          {timeline.length === 0 ? (
            <div className="text-center py-8 text-foreground opacity-60">
              <p className="text-4xl mb-3">🧩</p>
              <p>Solve problems to see your pattern mastery timeline.</p>
            </div>
          ) : (
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-white/10" />
              <div className="space-y-4 pl-12">
                {timeline.map((event, i) => (
                  <motion.div
                    key={event.patternSlug}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06, ease: "easeOut" as const }}
                    className="relative"
                  >
                    {/* Dot on timeline */}
                    <div
                      className="absolute -left-[2.05rem] top-1 w-3 h-3 rounded-full border-2 border-[#0A0F24]"
                      style={{ backgroundColor: getStatusColor(event.status) }}
                    />
                    <div className="bg-white/5 rounded-lg p-3 hover:bg-white/[0.08] transition-colors">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-white">{event.patternTitle}</span>
                        <span
                          className="text-xs px-2 py-0.5 rounded-full font-medium capitalize"
                          style={{
                            backgroundColor: getStatusColor(event.status) + "22",
                            color: getStatusColor(event.status),
                          }}
                        >
                          {event.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-xs text-white/50">
                        <span>{event.problemsSolved} problems solved</span>
                        <span>{event.recognitionAccuracy}% accuracy</span>
                        <span>{new Date(event.unlockedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Failure Pattern Analysis */}
        {failureSummary && failureSummary.totalAttempts > 0 && (
          <motion.div
            variants={itemVariants}
            className="bg-card/60 border border-primary/10 rounded-xl p-6 backdrop-blur-sm"
          >
            <h2 className="text-xl font-semibold text-white mb-1">🔍 Your Failure Patterns</h2>
            <p className="text-white/40 text-xs mb-4">
              Based on {failureSummary.totalAttempts} submissions — {failureSummary.passRate}% pass rate
            </p>
            {failureSummary.topFailures.length === 0 ? (
              <p className="text-emerald-400 text-sm">🎉 No notable failure patterns — keep it up!</p>
            ) : (
              <div className="space-y-3">
                {failureSummary.topFailures.map((fp, i) => (
                  <div key={fp.pattern} className="bg-white/5 rounded-lg p-3">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-sm font-medium text-white">{fp.label}</span>
                      <span className="text-xs text-red-400/80 bg-red-500/10 px-2 py-0.5 rounded-full">
                        {fp.count}× failed
                      </span>
                    </div>
                    <p className="text-xs text-white/50 leading-relaxed">{fp.suggestion}</p>
                    {i === 0 && (
                      <div className="mt-2 pt-2 border-t border-white/5">
                        <p className="text-xs text-[#E5A829]/80">💡 Top tip: {failureSummary.improvementTip}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Recent Activity */}
        <motion.div
          variants={itemVariants}
          className="bg-card/60 border border-primary/10 rounded-xl p-6 backdrop-blur-sm"
        >
          <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
          {activities.length === 0 ? (
            <div className="text-center py-8 text-foreground opacity-60">
              <p className="text-4xl mb-3">📖</p>
              <p>No activity yet. Start learning to see your progress!</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
              {activities.map((activity, i) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, ease: "easeOut" as const }}
                  className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/[0.08] transition-colors"
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      activity.type === "lesson"
                        ? "bg-primary/20 text-primary"
                        : activity.passed
                          ? "bg-green-500/20 text-green-400"
                          : "bg-orange-500/20 text-orange-400"
                    }`}
                  >
                    {activity.type === "lesson" ? "📖" : activity.passed ? "✅" : "🔄"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium truncate">
                      {activity.title}
                    </p>
                    <p className="text-xs text-foreground opacity-60">
                      {activity.description}
                    </p>
                  </div>
                  <span className="text-xs text-foreground opacity-50 whitespace-nowrap">
                    {formatRelativeDate(activity.date)}
                  </span>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}

function AnalysisMetric({
  label,
  accuracy,
  icon,
  color,
}: {
  label: string;
  accuracy: number;
  icon: string;
  color: string;
}) {
  return (
    <div className="bg-white/5 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">{icon}</span>
        <span className="text-xs text-foreground opacity-70">{label}</span>
      </div>
      <div className="text-2xl font-bold text-white mb-2">{accuracy}%</div>
      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${accuracy}%` }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" as const }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );
}
