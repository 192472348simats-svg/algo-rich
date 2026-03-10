"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

import StreakFlame from "@/app/components/feedback/StreakFlame";
import {
  evaluateAchievements,
  type UserStats,
} from "@/lib/achievements";
import {
  BookOpen,
  CheckCircle2,
  Zap,
  Target,
  Brain,
  RotateCcw,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import Card3D, { type GlowColor } from "@/app/components/ui/Card3D";
import ProgressBar3D from "@/app/components/ui/ProgressBar3D";
import ProgressRing from "@/app/components/ui/ProgressRing";
import BeginnerOnboardingFlow from "@/app/components/onboarding/BeginnerOnboardingFlow";

// ─── Types ─────────────────────────────────────────────────

interface CourseCard {
  id: string;
  title: string;
  icon: string;
  description: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  href: string;
}

interface OnboardingChecklist {
  accountCreated: boolean;
  firstLesson: boolean;
  firstSolve: boolean;
  firstVisualizer: boolean;
  firstPlan: boolean;
}

interface DashboardContentProps {
  userName: string;
  stats: {
    lessonsCompleted: number;
    problemsSolved: number;
    currentStreak: number;
    totalXP: number;
    totalProblems: number;
    totalCourses: number;
    reviewsDue: number;
    daysSinceLastActivity: number;
  };
  courses: CourseCard[];
  onboardingCompleted?: boolean;
  isNewUser?: boolean;
  userState: "new" | "active" | "advanced";
  onboardingChecklist: OnboardingChecklist;
  currentPhase?: number;
}

// ─── Hooks ─────────────────────────────────────────────────

function useCountUp(target: number, duration = 1200) {
  const [count, setCount] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    if (target === 0) return;

    const startTime = performance.now();
    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - (1 - progress) * (1 - progress);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [target, duration]);

  return count;
}

// ─── Animation Variants ────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

// ─── Smart Greeting ────────────────────────────────────────

function getTimeGreeting(hour: number): string {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function getGreeting(
  userName: string,
  stats: DashboardContentProps["stats"]
): { title: string; subtitle: string } {
  const hour = new Date().getHours();
  const firstName = userName?.split(" ")[0] || "there";

  if (stats.problemsSolved === 0 && stats.lessonsCompleted === 0) {
    return {
      title: `Welcome, ${firstName}! 👋`,
      subtitle: "Let's get you placement-ready.",
    };
  }

  if (stats.daysSinceLastActivity > 3) {
    return {
      title: `Welcome back, ${firstName}!`,
      subtitle: `${stats.daysSinceLastActivity} days away — let's shake off the rust.`,
    };
  }

  if (stats.currentStreak >= 3) {
    return {
      title: `${getTimeGreeting(hour)}, ${firstName} 🔥`,
      subtitle: `Day ${stats.currentStreak} streak! Don't break it.`,
    };
  }

  if (stats.reviewsDue > 0) {
    return {
      title: `${getTimeGreeting(hour)}, ${firstName}`,
      subtitle: `${stats.reviewsDue} problem${stats.reviewsDue > 1 ? "s" : ""} due for review today.`,
    };
  }

  return {
    title: `${getTimeGreeting(hour)}, ${firstName}`,
    subtitle: `${stats.problemsSolved} problems down, keep building.`,
  };
}

function getMotivationalCopy(solved: number): string {
  if (solved === 0) return "Every expert was once a beginner. Start today.";
  if (solved <= 10) return "You've started. That's more than most people do.";
  if (solved <= 30) return "You're building real skills. Keep the momentum.";
  if (solved <= 50) return "You're in the top 20% of learners. Push further.";
  return "Interview-ready territory. Sharpen and conquer.";
}

// ─── Stats Cards (ALL users) ──────────────────────────────

interface StatCardDef {
  icon: string;
  value: number;
  label: string;
  emptyMessage: string;
  href: string;
  animate?: boolean;
  sublabel?: string;
  borderColor?: string;
  glowColor?: GlowColor;
}

function UnifiedStatsCards({
  stats,
}: {
  stats: DashboardContentProps["stats"];
}) {
  const lessonsCount = useCountUp(stats.lessonsCompleted);
  const problemsCount = useCountUp(stats.problemsSolved);
  const xp =
    stats.totalXP || stats.lessonsCompleted * 50 + stats.problemsSolved * 100;
  const xpCount = useCountUp(xp);
  const level = Math.floor(xp / 200) + 1;

  const cards: StatCardDef[] = [
    {
      icon: "📚",
      value: stats.lessonsCompleted,
      label: "Lessons",
      emptyMessage: "Start your first lesson →",
      href: "/dashboard/courses",
      borderColor: "border-primary/30",
      glowColor: "gold",
    },
    {
      icon: "✅",
      value: stats.problemsSolved,
      label: "Problems Solved",
      emptyMessage: "Solve your first problem →",
      href: "/dashboard/practice",
      borderColor: "border-emerald-500/30",
      glowColor: "green",
    },
    {
      icon: "🔥",
      value: stats.currentStreak,
      label:
        stats.currentStreak > 0
          ? `${stats.currentStreak} Day Streak`
          : "Start a Streak",
      emptyMessage: "Solve 1 problem today →",
      href: "/dashboard/practice",
      animate: stats.currentStreak >= 3,
      borderColor: "border-orange-500/30",
      glowColor: "red",
    },
    {
      icon: "⚡",
      value: xp,
      label: "Total XP",
      emptyMessage: "Earn XP by learning →",
      href: "/dashboard/courses",
      sublabel: `Level ${level}`,
      borderColor: "border-purple-500/30",
      glowColor: "purple",
    },
  ];

  const counts = [lessonsCount, problemsCount, stats.currentStreak, xpCount];

  const renderCardInner = (card: StatCardDef, idx: number) => (
    <Card3D
      glowColor={card.glowColor ?? "gold"}
      tiltEnabled
      hoverable
      className="rounded-xl h-full group cursor-pointer"
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-lg">{card.icon}</span>
          {card.animate && (
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="text-xs"
            >
              🔥
            </motion.span>
          )}
        </div>
        <p className="text-2xl font-bold text-white tabular-nums font-mono">
          {counts[idx]}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">{card.label}</p>
        {card.sublabel && (
          <p className="text-[10px] text-purple-400/50 mt-0.5">
            {card.sublabel}
          </p>
        )}
        {card.value === 0 && (
          <p className="text-xs text-primary/40 group-hover:text-primary/70 transition-colors mt-0.5">
            {card.emptyMessage}
          </p>
        )}
      </div>
    </Card3D>
  );

  return (
    <motion.div variants={itemVariants}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {cards.map((card, idx) => (
          <Link key={card.label} href={card.href}>
            {renderCardInner(card, idx)}
          </Link>
        ))}
      </div>

      {/* Motivational micro-copy */}
      <p className="text-xs text-muted-foreground text-center mb-6 italic">
        {getMotivationalCopy(stats.problemsSolved)}
      </p>
    </motion.div>
  );
}

// ─── Today's Plan Widget ───────────────────────────────────

interface PlanStepPreview {
  id: string;
  type: "review" | "lesson" | "visualize" | "solve" | "cards";
  title: string;
  subtitle: string;
  estimatedMinutes: number;
}

interface PlanPreview {
  steps: PlanStepPreview[];
  totalMinutes: number;
  metadata: {
    weakTopics: { topic: string; percentage: number }[];
  };
}

function TodaysPlan() {
  const [plan, setPlan] = useState<PlanPreview | null>(null);
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    async function fetchPlan() {
      try {
        const res = await fetch("/api/plan");
        if (res.ok) {
          const data = await res.json();
          setPlan(data);
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }
    fetchPlan();
  }, []);

  if (loading) {
    return (
      <motion.div variants={itemVariants} className="glass rounded-xl p-5 mt-4">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-base">📋</span>
          <h3 className="text-sm font-semibold text-white">Today&apos;s Plan</h3>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-white/[0.02] rounded-lg animate-pulse" />
          ))}
        </div>
      </motion.div>
    );
  }

  if (!plan || plan.steps.length === 0) return null;

  const stepIcon = (type: string) => {
    switch (type) {
      case "review": return "🔄";
      case "lesson": return "📖";
      case "visualize": return "🔬";
      case "solve": return "🎯";
      case "cards": return "🃏";
      default: return "📌";
    }
  };

  return (
    <motion.div variants={itemVariants} className="glass rounded-xl p-5 mt-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-base">📋</span>
          <h3 className="text-sm font-semibold text-white">Today&apos;s Plan</h3>
          <span className="text-xs text-white/20 bg-white/[0.04] px-2 py-0.5 rounded-full">
            ~{plan.totalMinutes} min
          </span>
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-white/20 hover:text-white/40 transition-colors text-xs"
        >
          {collapsed ? "Show" : "Hide"}
        </button>
      </div>

      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="space-y-1.5 mb-4">
              {plan.steps.map((step, idx) => (
                <div
                  key={step.id}
                  className="flex items-center gap-3 p-2.5 rounded-lg border border-white/[0.04]"
                >
                  <span className="text-xs text-white/20 font-mono w-4 text-center flex-shrink-0">
                    {idx + 1}
                  </span>
                  <span className="text-sm flex-shrink-0">{stepIcon(step.type)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-white truncate">{step.title}</p>
                    <p className="text-[10px] text-white/20 truncate">{step.subtitle}</p>
                  </div>
                  <span className="text-[10px] text-white/15 flex-shrink-0">
                    {step.estimatedMinutes}m
                  </span>
                </div>
              ))}
            </div>

            <Link href="/dashboard/plan">
              <div className="rounded-lg bg-primary/10 border border-primary/20 py-2 text-center text-xs text-primary font-medium hover:bg-primary/20 transition-colors cursor-pointer">
                Start Today&apos;s Plan →
              </div>
            </Link>

            {plan.metadata.weakTopics.length > 0 && (
              <div className="mt-3 flex items-center gap-2 text-[10px] text-white/15">
                <span>Focus:</span>
                {plan.metadata.weakTopics.slice(0, 3).map((t) => (
                  <span key={t.topic} className="bg-white/[0.04] px-2 py-0.5 rounded-full">
                    {t.topic} ({t.percentage}%)
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Review Queue Widget ───────────────────────────────────

function ReviewQueueWidget() {
  const [dueCount, setDueCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReviewStats() {
      try {
        const res = await fetch("/api/reviews");
        if (res.ok) {
          const data = await res.json();
          setDueCount(data.stats?.dueNow ?? 0);
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }
    fetchReviewStats();
  }, []);

  if (loading || dueCount === 0) return null;

  return (
    <motion.div variants={itemVariants} className="glass rounded-xl p-5 mt-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-purple-500/15 flex items-center justify-center">
            <Brain size={18} className="text-purple-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              🧠 Review Queue
              <span className="text-[10px] bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full font-medium">
                {dueCount} due
              </span>
            </h3>
            <p className="text-[10px] text-white/25">
              Re-solve problems to strengthen long-term memory
            </p>
          </div>
        </div>
        <Link href="/dashboard/review">
          <div className="px-4 py-2 bg-purple-500/10 border border-purple-500/20 text-purple-300 font-medium rounded-lg hover:bg-purple-500/20 transition-all text-xs flex items-center gap-1.5 cursor-pointer">
            <RotateCcw size={14} />
            Start Review
          </div>
        </Link>
      </div>
    </motion.div>
  );
}

// ─── Daily Cards Preview ───────────────────────────────────

interface CardPreview {
  front: string;
  topic?: string;
}

function DailyCardsPreview() {
  const router = useRouter();
  const [previewCards, setPreviewCards] = useState<CardPreview[]>([]);
  const [cardsDueToday, setCardsDueToday] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCards() {
      try {
        const res = await fetch("/api/cards/daily");
        if (res.ok) {
          const data = await res.json();
          const cards = data.cards ?? [];
          setCardsDueToday(cards.length);
          setPreviewCards(
            cards.slice(0, 3).map((c: { question?: string; front?: string; topic?: string; type?: string }) => ({
              front: c.question || c.front || "Review card",
              topic: c.topic || c.type || "",
            }))
          );
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }
    fetchCards();
  }, []);

  if (loading) return null;

  return (
    <motion.div variants={itemVariants} className="glass rounded-xl p-5 mt-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-base">📝</span>
          <h3 className="text-sm font-semibold text-white">Daily Cards</h3>
        </div>
        <div className="flex items-center gap-2">
          {cardsDueToday > 0 && (
            <span className="text-xs text-primary/60 bg-primary/10 rounded-full px-2.5 py-0.5">
              {cardsDueToday} cards today
            </span>
          )}
          <Link
            href="/dashboard/cards"
            className="text-xs text-white/20 hover:text-white/40"
          >
            View all →
          </Link>
        </div>
      </div>

      {previewCards.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {previewCards.map((card, i) => (
              <div
                key={i}
                className="rounded-lg border border-white/[0.04] bg-white/[0.01] p-3 hover:bg-white/[0.03] transition-colors cursor-pointer"
                onClick={() => router.push("/dashboard/cards")}
              >
                <p className="text-xs text-white/50 line-clamp-2 leading-relaxed">
                  {card.front}
                </p>
                {card.topic && (
                  <p className="text-[10px] text-white/15 mt-2">{card.topic}</p>
                )}
              </div>
            ))}
          </div>

          {cardsDueToday > 0 && (
            <Link href="/dashboard/cards">
              <div className="mt-3 rounded-lg bg-primary/10 border border-primary/20 py-2 text-center text-xs text-primary/70 hover:bg-primary/20 transition-colors cursor-pointer">
                Start Card Session →
              </div>
            </Link>
          )}
        </>
      ) : (
        <p className="text-xs text-white/20 text-center py-4">
          All caught up! New cards tomorrow. 🎉
        </p>
      )}
    </motion.div>
  );
}

// ─── Achievements Preview ──────────────────────────────────

function AchievementsPreview({
  stats,
}: {
  stats: DashboardContentProps["stats"];
}) {
  const userStats: UserStats = useMemo(
    () => ({
      totalSolved: stats.problemsSolved,
      lessonsCompleted: stats.lessonsCompleted,
      cardsReviewed: 0, // not tracked server-side in props yet
      streak: stats.currentStreak,
      mediumSolved: 0, // we'll estimate from totalSolved
      hardSolved: 0,
      topicsCovered: 0,
      reviewsCompleted: 0,
      fastestEasy: null,
      patternsLearned: 0,
      coursesCompleted: 0,
    }),
    [stats]
  );

  const allAchievements = useMemo(
    () => evaluateAchievements(userStats),
    [userStats]
  );

  // Show 3 most relevant: first unlocked ones, then next to unlock
  const unlocked = allAchievements.filter((a) => a.unlocked);
  const locked = allAchievements
    .filter((a) => !a.unlocked)
    .sort((a, b) => b.progress / b.target - a.progress / a.target);

  const display = [...unlocked.slice(-2), ...locked.slice(0, 3)].slice(0, 5);

  return (
    <motion.div variants={itemVariants} className="glass rounded-xl p-5 mt-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-base">🏆</span>
          <h3 className="text-sm font-semibold text-white">Achievements</h3>
        </div>
        <Link
          href="/dashboard/achievements"
          className="text-xs text-white/20 hover:text-white/40"
        >
          View all →
        </Link>
      </div>

      <div className="space-y-2">
        {display.map((achievement) => (
          <div key={achievement.id} className="flex items-center gap-3">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                achievement.unlocked
                  ? "bg-yellow-500/20"
                  : "bg-white/[0.04] grayscale opacity-40"
              }`}
            >
              {achievement.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <p
                className={`text-xs font-medium ${
                  achievement.unlocked ? "text-white/70" : "text-white/25"
                }`}
              >
                {achievement.title}
              </p>
              <p className="text-[10px] text-white/15">
                {achievement.description}
              </p>
            </div>
            {!achievement.unlocked && (
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <div className="w-16 h-1 rounded-full bg-white/[0.06] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-yellow-500/40"
                    style={{
                      width: `${Math.min((achievement.progress / achievement.target) * 100, 100)}%`,
                    }}
                  />
                </div>
                <span className="text-[9px] text-white/15 tabular-nums">
                  {achievement.progress}/{achievement.target}
                </span>
              </div>
            )}
            {achievement.unlocked && (
              <span className="text-[9px] text-yellow-400/50">✓</span>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Quick Action Cards ────────────────────────────────────

function QuickActions({
  userState,
  stats,
  courses,
}: {
  userState: "new" | "active" | "advanced";
  stats: DashboardContentProps["stats"];
  courses: CourseCard[];
}) {
  if (userState === "new") {
    const actions = [
      {
        href: courses.length > 0 ? courses[0].href : "/dashboard/courses",
        emoji: "🚀",
        title: "Start",
        subtitle: "First Lesson",
        detail: "~10 min",
        border: "border-emerald-500/20",
        hoverBorder: "hover:border-emerald-500/40",
      },
      {
        href: "/dashboard/visualize",
        emoji: "🔬",
        title: "Explore",
        subtitle: "Visualizer",
        detail: "See trees live",
        border: "border-primary/20",
        hoverBorder: "hover:border-primary/40",
      },
      {
        href: "/dashboard/practice",
        emoji: "💻",
        title: "Try a Problem",
        subtitle: "Two Sum (Easy)",
        detail: "~8 min",
        border: "border-primary/20",
        hoverBorder: "hover:border-primary/40",
      },
    ];

    return (
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6"
      >
        {actions.map((a) => (
          <Link key={a.href} href={a.href}>
            <motion.div
              whileHover={{
                scale: 1.02,
                rotateX: -2,
                rotateY: 3,
                transition: { duration: 0.2 },
              }}
              style={{ transformPerspective: 800 }}
              className={`card-pro p-5 cursor-pointer border ${a.border} ${a.hoverBorder} transition-all duration-300 group`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{a.emoji}</span>
                <span className="text-sm font-semibold text-white group-hover:text-primary transition-colors">
                  {a.title}
                </span>
              </div>
              <p className="text-sm text-white/60">{a.subtitle}</p>
              <p className="text-xs text-white/25 mt-1">{a.detail}</p>
            </motion.div>
          </Link>
        ))}
      </motion.div>
    );
  }

  // Active / Advanced users
  const nextCourse =
    courses.find((c) => c.progress < 100 && c.progress > 0) || courses[0];

  const actions = [
    {
      href: nextCourse?.href || "/dashboard/courses",
      emoji: "📖",
      title: "Continue",
      subtitle: nextCourse?.title || "Courses",
      detail: nextCourse
        ? `${nextCourse.completedLessons} of ${nextCourse.totalLessons} lessons`
        : "",
      border: "border-blue-500/20",
      hoverBorder: "hover:border-blue-500/40",
    },
    {
      href: "/dashboard/practice",
      emoji: "💪",
      title: "Quick Solve",
      subtitle: "Random Easy",
      detail: "~5 min",
      border: "border-primary/20",
      hoverBorder: "hover:border-primary/40",
    },
    {
      href: "/dashboard/visualize",
      emoji: "🔬",
      title: "Visualize",
      subtitle: "Binary Tree",
      detail: "",
      border: "border-primary/20",
      hoverBorder: "hover:border-primary/40",
    },
    ...(stats.reviewsDue > 0
      ? [
          {
            href: "/dashboard/review",
            emoji: "🧠",
            title: "Review",
            subtitle: `${stats.reviewsDue} due today`,
            detail: "",
            border: "border-purple-500/20",
            hoverBorder: "hover:border-purple-500/40",
          },
        ]
      : []),
  ];

  return (
    <motion.div
      variants={itemVariants}
      className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6"
    >
      {actions.map((a) => (
        <Link key={a.href + a.title} href={a.href}>
          <motion.div
            whileHover={{
              scale: 1.02,
              rotateX: -2,
              rotateY: 3,
              transition: { duration: 0.2 },
            }}
            style={{ transformPerspective: 800 }}
            className={`card-pro p-4 cursor-pointer border ${a.border} ${a.hoverBorder} transition-all duration-300 group h-full`}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-base">{a.emoji}</span>
              <span className="text-sm font-semibold text-white group-hover:text-primary transition-colors">
                {a.title}
              </span>
            </div>
            <p className="text-xs text-white/60">{a.subtitle}</p>
            {a.detail && (
              <p className="text-xs text-white/25 mt-0.5">{a.detail}</p>
            )}
          </motion.div>
        </Link>
      ))}
    </motion.div>
  );
}

// ─── Onboarding Checklist ──────────────────────────────────

function OnboardingChecklistWidget({
  checklist,
}: {
  checklist: OnboardingChecklist;
}) {
  const items = [
    {
      key: "accountCreated",
      label: "Created your account",
      done: checklist.accountCreated,
    },
    {
      key: "firstLesson",
      label: "Complete your first lesson",
      done: checklist.firstLesson,
      href: "/dashboard/courses",
    },
    {
      key: "firstSolve",
      label: "Solve your first problem",
      done: checklist.firstSolve,
      href: "/dashboard/practice",
    },
    {
      key: "firstVisualizer",
      label: "Try a visualizer",
      done: checklist.firstVisualizer,
      href: "/dashboard/visualize",
    },
    {
      key: "firstPlan",
      label: "Complete your first daily plan",
      done: checklist.firstPlan,
      href: "/dashboard/plan",
    },
  ];

  const completedCount = items.filter((i) => i.done).length;
  const allDone = completedCount === items.length;

  if (allDone) return null;

  return (
    <motion.div variants={itemVariants} className="glass rounded-xl p-5 mt-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <Sparkles size={16} className="text-primary" />
          Your First Steps
        </h3>
        <span className="text-xs text-white/30 font-mono">
          {completedCount}/{items.length} ✓
        </span>
      </div>
      <div className="space-y-2">
        {items.map((item) => {
          const content = (
            <motion.div
              whileHover={!item.done && item.href ? { x: 4 } : {}}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                item.done
                  ? "bg-emerald-500/5"
                  : item.href
                    ? "hover:bg-white/[0.03] cursor-pointer"
                    : ""
              }`}
            >
              {item.done ? (
                <CheckCircle2
                  size={16}
                  className="text-emerald-400 flex-shrink-0"
                />
              ) : (
                <div className="w-4 h-4 rounded-full border-2 border-white/15 flex-shrink-0" />
              )}
              <span
                className={`text-xs ${item.done ? "text-white/40 line-through" : "text-white/70"}`}
              >
                {item.label}
              </span>
              {!item.done && item.href && (
                <ArrowRight
                  size={12}
                  className="text-white/20 ml-auto flex-shrink-0"
                />
              )}
            </motion.div>
          );

          if (!item.done && item.href) {
            return (
              <Link key={item.key} href={item.href}>
                {content}
              </Link>
            );
          }
          return <div key={item.key}>{content}</div>;
        })}
      </div>
    </motion.div>
  );
}

// ─── Company Topics Showcase ───────────────────────────────

function CompanyTopics() {
  const companies = [
    { name: "Amazon", topics: "Arrays, Trees, Hash Maps, Graphs", color: "text-orange-400" },
    { name: "Google", topics: "DP, Binary Search, Trees, Backtracking", color: "text-blue-400" },
    { name: "Meta", topics: "Arrays, Trees, Graphs, Sliding Window", color: "text-primary" },
    { name: "Microsoft", topics: "Arrays, Linked Lists, Trees, Stacks", color: "text-emerald-400" },
  ];

  return (
    <motion.div variants={itemVariants} className="glass rounded-xl p-5 mt-4">
      <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
        <Target size={16} className="text-primary" />
        Top Interview Topics
      </h3>
      <div className="space-y-2.5">
        {companies.map((c) => (
          <div key={c.name} className="flex items-start gap-2">
            <span className="text-sm">🏢</span>
            <div>
              <span className={`text-xs font-medium ${c.color}`}>{c.name}:</span>
              <span className="text-xs text-white/40 ml-1.5">{c.topics}</span>
            </div>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-white/15 mt-3">All problems are tagged by company.</p>
    </motion.div>
  );
}

// ─── Learning Path Card (New Users) ────────────────────────

function LearningPathCard({
  stats,
  courses,
}: {
  stats: DashboardContentProps["stats"];
  courses: CourseCard[];
}) {
  const firstCourse = courses[0];

  return (
    <motion.div
      variants={itemVariants}
      className="glass rounded-xl p-6 relative overflow-hidden mt-4"
    >
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-primary/5 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-purple-500/5 to-transparent rounded-full blur-3xl" />

      <div className="relative">
        <h2 className="text-lg font-bold text-white mb-2">Your Learning Path</h2>
        <p className="text-xs text-white/50 mb-4 max-w-lg leading-relaxed">
          This platform was built for one goal:{" "}
          <span className="text-white/80 font-medium">
            Get you ready to pass technical interviews.
          </span>
        </p>

        <div className="flex flex-wrap gap-3 text-[10px] text-white/30 mb-4">
          <span className="bg-white/[0.04] px-2.5 py-1 rounded-full">
            {stats.totalProblems} problems
          </span>
          <span className="bg-white/[0.04] px-2.5 py-1 rounded-full">12 topics</span>
          <span className="bg-white/[0.04] px-2.5 py-1 rounded-full">
            {stats.totalCourses} courses
          </span>
        </div>

        {firstCourse && (
          <Link href={firstCourse.href}>
            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="rounded-lg border border-primary/20 bg-primary/5 p-4 cursor-pointer group transition-all hover:border-primary/40"
            >
              <p className="text-xs font-semibold text-primary flex items-center gap-2 mb-0.5">
                Start Your First Lesson
                <ArrowRight
                  size={14}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </p>
              <p className="text-[10px] text-white/30">
                {firstCourse.title} (~10 min)
              </p>
            </motion.div>
          </Link>
        )}
      </div>
    </motion.div>
  );
}

// ─── Platform Features Cards (New Users) ───────────────────

function PlatformFeatures({
  stats,
}: {
  stats: DashboardContentProps["stats"];
}) {
  const features = [
    {
      emoji: "📚",
      title: `${stats.totalCourses} Courses`,
      lines: ["Python → Data Structures →", "Algorithms → Patterns"],
      cta: "Browse Courses →",
      href: "/dashboard/courses",
      border: "border-blue-500/15",
      hoverBorder: "hover:border-blue-500/30",
    },
    {
      emoji: "💻",
      title: `${stats.totalProblems} Problems`,
      lines: ["Easy to Hard", "Company-tagged", "Pattern-organized"],
      cta: "Browse Problems →",
      href: "/dashboard/practice",
      border: "border-primary/15",
      hoverBorder: "hover:border-primary/30",
    },
    {
      emoji: "🔬",
      title: "4 Visualizers",
      lines: ["Trees, Arrays", "Stacks, Linked Lists", "See data structures come alive"],
      cta: "Try Visualizer →",
      href: "/dashboard/visualize",
      border: "border-primary/15",
      hoverBorder: "hover:border-primary/30",
    },
  ];

  return (
    <motion.div
      variants={itemVariants}
      className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4"
    >
      {features.map((f) => (
        <Link key={f.href} href={f.href}>
          <motion.div
            whileHover={{ y: -3 }}
            className={`card-pro p-5 cursor-pointer border ${f.border} ${f.hoverBorder} transition-all duration-300 h-full flex flex-col`}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">{f.emoji}</span>
              <span className="text-sm font-semibold text-white">{f.title}</span>
            </div>
            <div className="flex-1 space-y-1 mb-4">
              {f.lines.map((line, i) => (
                <p key={i} className="text-xs text-white/40">{line}</p>
              ))}
            </div>
            <p className="text-xs text-primary font-medium">{f.cta}</p>
          </motion.div>
        </Link>
      ))}
    </motion.div>
  );
}

// ─── Placement Readiness ───────────────────────────────────

function PlacementReadiness({
  stats,
}: {
  stats: DashboardContentProps["stats"];
}) {
  const readinessScore = useMemo(() => {
    const lessonWeight = Math.min(stats.lessonsCompleted / 20, 1) * 30;
    const problemWeight = Math.min(stats.problemsSolved / 30, 1) * 50;
    const streakWeight = Math.min(stats.currentStreak / 14, 1) * 20;
    return Math.round(lessonWeight + problemWeight + streakWeight);
  }, [stats]);

  const readinessLabel =
    readinessScore < 20
      ? "Building foundations"
      : readinessScore < 50
        ? "Growing skills"
        : readinessScore < 75
          ? "Getting strong"
          : "Interview-ready";

  return (
    <motion.div variants={itemVariants} className="glass rounded-xl p-5 mt-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Target size={18} className="text-primary" />
          <h3 className="text-sm font-semibold text-white">
            🎯 Placement Readiness
          </h3>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold font-mono text-primary">
            {readinessScore}%
          </span>
          <p className="text-[10px] text-white/25">{readinessLabel}</p>
        </div>
      </div>
      <ProgressBar3D value={readinessScore} height={6} />
      <div className="flex justify-between mt-2 text-[10px] text-white/20">
        <span>Lessons ({Math.min(stats.lessonsCompleted, 20)}/20)</span>
        <span>Problems ({Math.min(stats.problemsSolved, 30)}/30)</span>
        <span>Streak ({Math.min(stats.currentStreak, 14)}/14d)</span>
      </div>
    </motion.div>
  );
}

// ─── Course Grid (shared) ──────────────────────────────────

function CourseGrid({ courses }: { courses: CourseCard[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {courses.map((course) => {
        const pct =
          course.totalLessons > 0
            ? Math.round((course.completedLessons / course.totalLessons) * 100)
            : 0;

        return (
          <motion.div key={course.id} whileHover={{ y: -4 }} className="card-pro p-6">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">{course.icon}</span>
              <h3 className="text-lg font-bold text-primary-foreground">{course.title}</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              {course.description}
            </p>
            <div className="mb-4">
              <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                <span>Progress</span>
                <span>
                  {course.completedLessons}/{course.totalLessons} lessons
                </span>
              </div>
              <div className="w-full h-2 bg-background/60 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full"
                />
              </div>
            </div>
            <Link href={course.href}>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full py-2 border border-primary/40 text-primary font-medium rounded-lg hover:bg-primary/10 transition-all duration-200 text-sm"
              >
                View Course
              </motion.button>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════

export default function DashboardContent({
  userName,
  stats,
  courses,
  onboardingCompleted = true,
  userState,
  onboardingChecklist,
  currentPhase = 1,
}: DashboardContentProps) {
  const [showOnboarding, setShowOnboarding] = useState(!onboardingCompleted);

  // Safety: deduplicate courses by title
  const uniqueCourses = courses.filter(
    (course, index, self) =>
      index === self.findIndex((c) => c.title === course.title)
  );

  const greeting = getGreeting(userName, stats);

  const phaseNames: Record<number, string> = {
    1: "Python Foundations",
    2: "Logic Building",
    3: "Data Structures",
    4: "Patterns & Algorithms",
    5: "Interview Ready",
  };
  const phaseIcons: Record<number, string> = {
    1: "🐍",
    2: "🧩",
    3: "🏗️",
    4: "⚡",
    5: "🎯",
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-6xl mx-auto pt-8 lg:pt-0"
    >
      {/* Onboarding Modal */}
      <AnimatePresence>
        {showOnboarding && (
          <BeginnerOnboardingFlow onComplete={() => setShowOnboarding(false)} />
        )}
      </AnimatePresence>

      {/* Smart Greeting */}
      <motion.div variants={itemVariants} className="mb-6 -mx-2">
        <Card3D glowColor="gold" className="rounded-2xl px-6 py-5">
          <h1 className="text-3xl font-bold text-white">{greeting.title}</h1>
          <p className="text-muted-foreground mt-1">{greeting.subtitle}</p>
        </Card3D>
      </motion.div>

      {/* Phase Banner */}
      <motion.div variants={itemVariants} className="mb-6">
        <Link href="/dashboard/path">
          <Card3D glowColor="gold" hoverable className="rounded-xl cursor-pointer group">
            <div className="flex items-center gap-3 p-4">
              <ProgressRing
                value={(currentPhase - 1) * 25}
                size={48}
                strokeWidth={4}
                label={`P${currentPhase}`}
              />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Current Phase</p>
                <p className="text-base font-semibold gradient-text">
                  Phase {currentPhase}: {phaseNames[currentPhase] ?? "Learning"}
                </p>
              </div>
              <ArrowRight size={18} className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </Card3D>
        </Link>
      </motion.div>

      {/* ──── Stats Cards (ALWAYS visible, ALL users) ──── */}
      <UnifiedStatsCards stats={stats} />

      {/* Quick Action Cards */}
      <QuickActions
        userState={userState}
        stats={stats}
        courses={uniqueCourses}
      />

      {/* ────────────────────────────────────────────────── */}
      {/* Widgets section — same for ALL states               */}
      {/* ────────────────────────────────────────────────── */}

      {/* Daily Cards Preview */}
      <DailyCardsPreview />

      {/* Achievements Preview */}
      <AchievementsPreview stats={stats} />

      {/* Today's Plan */}
      <TodaysPlan />

      {/* Review Queue */}
      <ReviewQueueWidget />

      {/* Placement Readiness (active and advanced) */}
      {userState !== "new" && <PlacementReadiness stats={stats} />}

      {/* ──── New Users get extra content ──── */}
      {userState === "new" && (
        <>
          <LearningPathCard stats={stats} courses={uniqueCourses} />
          <PlatformFeatures stats={stats} />
          <OnboardingChecklistWidget checklist={onboardingChecklist} />
          <CompanyTopics />
        </>
      )}

      {/* ──── Onboarding checklist (active users who haven't finished) ──── */}
      {userState === "active" && (
        <OnboardingChecklistWidget checklist={onboardingChecklist} />
      )}

      {/* ──── Courses Grid (ALL users) ──── */}
      <motion.div variants={itemVariants} className="mt-8">
        <h2 className="text-xl font-bold text-white mb-5">Your Courses</h2>
        <CourseGrid courses={uniqueCourses} />
      </motion.div>
    </motion.div>
  );
}
