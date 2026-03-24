// REDESIGNED: Sessions integrated into Learning Path — topics expand to show sessions with locked/unlocked state
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Check, Lock, ChevronDown, ChevronUp, ArrowRight,
  Target, Zap, Circle, BookOpen, Play,
} from "lucide-react";
import { getAllSessionDefinitions } from "@/lib/sessionDefinitions";

// ─── Types ─────────────────────────────────────────────────

interface ProblemItem {
  id: string;
  slug: string;
  title: string;
  difficulty: string;
  solved: boolean;
}

interface PhaseData {
  phase: number;
  name: string;
  subtitle: string;
  weeks: string;
  weekRange: number[];
  icon: string;
  color: string;
  borderColor: string;
  bgColor: string;
  totalProblems: number;
  solvedProblems: number;
  progress: number;
  completedAt: Date | string | null;
  status: "completed" | "current" | "locked";
  weekProblems: Record<number, ProblemItem[]>;
}

interface PathContentProps {
  phases: PhaseData[];
  currentPhase: number;
  currentWeek: number;
}

// ─── Phase 1 topic/session map ─────────────────────────────

const PHASE1_TOPICS = [
  {
    id: "intro",
    title: "Introduction to Python",
    emoji: "🐍",
    sessions: ["first-python-program", "variables-basics"],
  },
  {
    id: "datatypes",
    title: "Data Types",
    emoji: "🗂️",
    sessions: ["data-types", "type-conversion"],
  },
  {
    id: "control",
    title: "Control Statements",
    emoji: "🤔",
    sessions: ["if-else-basics", "loops-basics", "while-loops"],
  },
  {
    id: "functions",
    title: "Functions",
    emoji: "🛠️",
    sessions: ["functions-basics", "functions-scope"],
  },
  {
    id: "collections",
    title: "Lists & Strings",
    emoji: "📋",
    sessions: ["lists-basics", "strings-basics"],
  },
];

const PHASE2_TOPICS = [
  {
    id: "thinking",
    title: "Thinking Like a Programmer",
    emoji: "🧠",
    sessions: ["problem-thinking", "brute-force-first"],
  },
  {
    id: "bigo",
    title: "Big-O Notation",
    emoji: "📈",
    sessions: ["big-o-basics", "big-o-reading"],
  },
  {
    id: "arrays",
    title: "Arrays Deep Dive",
    emoji: "📊",
    sessions: ["arrays-and-big-o", "two-pointers", "sliding-window"],
  },
];

const PHASE3_TOPICS = [
  {
    id: "linked-lists",
    title: "Linked Lists",
    emoji: "🔗",
    sessions: ["linked-lists-intro"],
  },
  {
    id: "stacks-queues",
    title: "Stacks & Queues",
    emoji: "📚",
    sessions: ["stacks-basics", "queues-basics"],
  },
  {
    id: "trees",
    title: "Trees",
    emoji: "🌳",
    sessions: ["binary-search-trees", "bst-deletion"],
  },
];

const PHASE_TOPICS: Record<number, typeof PHASE1_TOPICS> = {
  1: PHASE1_TOPICS,
  2: PHASE2_TOPICS,
  3: PHASE3_TOPICS,
};

const difficultyColors: Record<string, string> = {
  easy: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  medium: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  hard: "text-red-400 bg-red-500/10 border-red-500/20",
};

const checkpointLabels: Record<number, string> = {
  1: "Solve 8/12 Python problems to unlock Phase 2",
  2: "Solve 5/6 Logic problems to unlock Phase 3",
  3: "Solve 50% of DS problems to unlock Phase 4",
  4: "Solve 50% of Pattern problems to unlock Phase 5",
};

// ─── Session progress hook ─────────────────────────────────

function useSessionProgress() {
  const [progressMap, setProgressMap] = useState<
    Record<string, { completed: boolean; currentStage: number; totalXP: number }>
  >({});

  useEffect(() => {
    fetch("/api/sessions")
      .then((r) => (r.ok ? r.json() : { progress: {} }))
      .then((d) => setProgressMap(d.progress ?? {}))
      .catch(() => {});
  }, []);

  return progressMap;
}

// ─── Sessions Tab ──────────────────────────────────────────

function SessionsTab({ phaseNum }: { phaseNum: number }) {
  const allSessions = getAllSessionDefinitions();
  const sessionMap = Object.fromEntries(allSessions.map((s) => [s.slug, s]));
  const progressMap = useSessionProgress();
  const topics = PHASE_TOPICS[phaseNum];

  // Track which topics are open — completed topics collapsed by default
  const [openTopics, setOpenTopics] = useState<Record<string, boolean>>({});

  const toggleTopic = (topicId: string) => {
    setOpenTopics(prev => ({ ...prev, [topicId]: !prev[topicId] }));
  };

  if (!topics || topics.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-sm" style={{ color: '#6b7a99' }}>
          Sessions for this phase are coming soon.
        </p>
      </div>
    );
  }

  // Determine which sessions are unlocked
  const isUnlocked = (slug: string): boolean => {
    const def = sessionMap[slug];
    if (!def) return false;
    if (!def.prerequisiteSessionSlug) return true;
    return progressMap[def.prerequisiteSessionSlug]?.completed ?? false;
  };

  return (
    <div className="space-y-3 mt-2">
      {topics.map((topic) => {
        const topicSessions = topic.sessions
          .map((slug) => sessionMap[slug])
          .filter(Boolean);

        const completedCount = topicSessions.filter(
          (s) => progressMap[s.slug]?.completed
        ).length;

        const allDone = completedCount === topicSessions.length && topicSessions.length > 0;
        const hasInProgress = topicSessions.some(s => {
          const p = progressMap[s.slug];
          return p && !p.completed && p.currentStage > 0;
        });

        // Default: completed topics collapsed, in-progress/new topics open
        const isOpen = openTopics[topic.id] !== undefined
          ? openTopics[topic.id]
          : (!allDone || hasInProgress);

        return (
          <div key={topic.id} className="rounded-xl overflow-hidden"
            style={{ background: '#0a0f24', border: `1px solid ${allDone ? '#10b98130' : '#1E3A5F'}` }}>
            {/* Topic header — always visible, click to toggle */}
            <button
              onClick={() => toggleTopic(topic.id)}
              className="w-full flex items-center justify-between px-4 py-3 transition-all"
              style={{ borderBottom: isOpen ? '1px solid #1E3A5F' : 'none' }}
            >
              <div className="flex items-center gap-2">
                <span className="text-base">{topic.emoji}</span>
                <span className="text-sm font-semibold" style={{ color: allDone ? '#6b7a99' : '#fff' }}>
                  {topic.title}
                </span>
                {allDone && (
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#051a12', color: '#10b981' }}>
                    ✓ Complete
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs" style={{ color: allDone ? '#10b981' : '#6b7a99' }}>
                  {completedCount}/{topicSessions.length}
                </span>
                <span className="text-xs" style={{ color: '#6b7a99' }}>
                  {isOpen ? '▲' : '▼'}
                </span>
              </div>
            </button>

            {/* Sessions list — only shown when open */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="divide-y" style={{ borderColor: '#1E3A5F' }}>
                    {topicSessions.map((sess, idx) => {
                      const prog = progressMap[sess.slug];
                      const isDone = prog?.completed ?? false;
                      const stagesDone = prog?.currentStage ?? 0;
                      const unlocked = isUnlocked(sess.slug);
                      const inProgress = !isDone && stagesDone > 0;
                      const pct = Math.round((stagesDone / sess.stages.length) * 100);

                return (
                  <div key={sess.slug}>
                    {unlocked ? (
                      <Link href={`/dashboard/session/${sess.slug}`}>
                        <div className="flex items-center gap-3 px-4 py-3 transition-all duration-200 group"
                          style={{ background: 'transparent' }}
                          onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = '#0f1629'}
                          onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'transparent'}>
                          {/* Status icon */}
                          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{
                              background: isDone ? '#051a12' : inProgress ? '#1a1400' : '#0f1629',
                              border: `1px solid ${isDone ? '#10b981' : inProgress ? '#E5A829' : '#1E3A5F'}`
                            }}>
                            {isDone
                              ? <Check size={14} color="#10b981" />
                              : inProgress
                                ? <Play size={12} color="#E5A829" />
                                : <span className="text-xs font-bold" style={{ color: '#6b7a99' }}>{idx + 1}</span>
                            }
                          </div>

                          {/* Session info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className={`text-sm font-medium ${isDone ? 'line-through' : ''}`}
                                style={{ color: isDone ? '#6b7a99' : '#fff' }}>
                                {sess.title.split(' — ')[0]}
                              </span>
                              {inProgress && (
                                <span className="text-xs px-1.5 py-0.5 rounded"
                                  style={{ background: '#1a1400', color: '#E5A829', fontSize: '10px' }}>
                                  In progress
                                </span>
                              )}
                            </div>
                            {/* Progress bar */}
                            {(inProgress || isDone) && (
                              <div className="mt-1.5 h-1 rounded-full overflow-hidden" style={{ background: '#1E3A5F' }}>
                                <div className="h-full rounded-full transition-all"
                                  style={{
                                    width: `${isDone ? 100 : pct}%`,
                                    background: isDone ? '#10b981' : '#E5A829'
                                  }} />
                              </div>
                            )}
                          </div>

                          {/* Right side */}
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className="text-xs" style={{ color: '#6b7a99' }}>~{sess.estimatedMinutes}m</span>
                            <span className="text-xs font-medium" style={{ color: '#E5A829' }}>{sess.xpTotal}xp</span>
                            <ArrowRight size={14} color="#6b7a99" className="group-hover:translate-x-0.5 transition-transform" />
                          </div>
                        </div>
                      </Link>
                    ) : (
                      <div className="flex items-center gap-3 px-4 py-3" style={{ opacity: 0.4 }}>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ background: '#0f1629', border: '1px solid #1E3A5F' }}>
                          <Lock size={12} color="#6b7a99" />
                        </div>
                        <div className="flex-1">
                          <span className="text-sm" style={{ color: '#6b7a99' }}>
                            {sess.title.split(' — ')[0]}
                          </span>
                          <p className="text-xs mt-0.5" style={{ color: '#6b7a99' }}>
                            Complete previous session to unlock
                          </p>
                        </div>
                        <span className="text-xs" style={{ color: '#6b7a99' }}>~{sess.estimatedMinutes}m</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

// ─── Problems Tab ──────────────────────────────────────────

function ProblemsTab({
  phase,
  currentWeek,
}: {
  phase: PhaseData;
  currentWeek: number;
}) {
  return (
    <div className="space-y-4 mt-2">
      <Link
        href={`/dashboard/practice?phase=${phase.phase}`}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        style={{ background: '#1a1400', color: '#E5A829', border: '1px solid #E5A82930' }}
      >
        <Zap size={14} />
        Practice All
        <ArrowRight size={14} />
      </Link>

      {Object.entries(phase.weekProblems).map(([weekStr, problems]) => {
        const weekNum = parseInt(weekStr, 10);
        const isCurrentWeek = phase.status === "current" && weekNum === currentWeek;
        if (!problems || problems.length === 0) return null;

        return (
          <div key={weekNum} className="rounded-xl overflow-hidden"
            style={{ background: '#0a0f24', border: '1px solid #1E3A5F' }}>
            <div className="flex items-center gap-2 px-4 py-2.5"
              style={{ borderBottom: '1px solid #1E3A5F' }}>
              <span className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: isCurrentWeek ? '#E5A829' : '#6b7a99' }}>
                Week {weekNum}
              </span>
              {isCurrentWeek && (
                <span className="text-xs px-1.5 py-0.5 rounded"
                  style={{ background: '#1a1400', color: '#E5A829', fontSize: '9px' }}>
                  You are here
                </span>
              )}
              <span className="text-xs ml-auto" style={{ color: '#6b7a99' }}>
                {problems.filter((p) => p.solved).length}/{problems.length}
              </span>
            </div>
            <div className="divide-y" style={{ borderColor: '#1E3A5F' }}>
              {problems.map((problem) => (
                <Link key={problem.id} href={`/dashboard/practice/${problem.slug}`}>
                  <div className="flex items-center gap-3 px-4 py-2.5 transition-all group"
                    style={{ background: 'transparent' }}
                    onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = '#0f1629'}
                    onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'transparent'}>
                    {problem.solved
                      ? <Check size={14} color="#10b981" className="flex-shrink-0" />
                      : <Circle size={14} color="#1E3A5F" className="flex-shrink-0" />
                    }
                    <span className={`text-sm flex-1 ${problem.solved ? 'line-through' : 'group-hover:text-white'}`}
                      style={{ color: problem.solved ? '#6b7a99' : '#c8d0e0' }}>
                      {problem.title}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded capitalize border ${difficultyColors[problem.difficulty] ?? ''}`}>
                      {problem.difficulty}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────

export default function PathContent({ phases, currentPhase, currentWeek }: PathContentProps) {
  const [expandedPhase, setExpandedPhase] = useState<number | null>(currentPhase);
  const [activeTab, setActiveTab] = useState<Record<number, "learn" | "practice">>({});
  const [advancing, setAdvancing] = useState(false);
  const [advanceMsg, setAdvanceMsg] = useState<string | null>(null);

  const getTab = (phase: number) => activeTab[phase] ?? "learn";

  const handleAdvance = async () => {
    setAdvancing(true);
    setAdvanceMsg(null);
    try {
      const checkRes = await fetch("/api/checkpoint");
      const checkData = await checkRes.json();
      if (!checkData.canAdvance) {
        setAdvanceMsg(checkData.message);
        setAdvancing(false);
        return;
      }
      const advRes = await fetch("/api/user/phase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "advance" }),
      });
      const advData = await advRes.json();
      if (advData.success) {
        setAdvanceMsg(advData.message);
        setTimeout(() => window.location.reload(), 1500);
      } else {
        setAdvanceMsg(advData.error || "Failed to advance");
      }
    } catch {
      setAdvanceMsg("Something went wrong");
    }
    setAdvancing(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="inline-flex items-center gap-2 mb-3">
          <span className="w-5 h-px" style={{ background: '#E5A829' }} />
          <span className="text-xs font-medium tracking-widest uppercase" style={{ color: '#E5A829' }}>Your Journey</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3" style={{ letterSpacing: '-0.02em' }}>
          <Target size={26} color="#E5A829" />
          Your Learning Path
        </h1>
        <p className="mt-2 text-sm" style={{ color: '#6b7a99' }}>
          From zero to placement ready — track your journey across 5 phases
        </p>
        <div className="mt-3 flex items-center gap-2 text-sm">
          <span className="px-3 py-1 rounded-full text-xs font-semibold"
            style={{ background: '#1a1400', color: '#E5A829', border: '1px solid #E5A82930' }}>
            Phase {currentPhase}
          </span>
          <span style={{ color: '#1E3A5F' }}>•</span>
          <span className="text-sm" style={{ color: '#6b7a99' }}>Week {currentWeek}</span>
        </div>
      </motion.div>

      {/* Timeline */}
      <div className="relative">
        <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-px" style={{ background: '#1E3A5F' }} />

        {phases.map((phase, index) => {
          const isExpanded = expandedPhase === phase.phase;
          const isCurrent = phase.status === "current";
          const isCompleted = phase.status === "completed";
          const isLocked = phase.status === "locked";
          const tab = getTab(phase.phase);

          return (
            <motion.div key={phase.phase} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.08 }} className="relative mb-4">

              {/* Timeline node */}
              <div className="absolute left-6 sm:left-8 -translate-x-1/2 z-10">
                <div className="w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all"
                  style={{
                    background: isCompleted ? '#051a12' : isCurrent ? '#1a1400' : '#0a0f24',
                    borderColor: isCompleted ? '#10b981' : isCurrent ? '#E5A829' : '#1E3A5F',
                  }}>
                  {isCompleted
                    ? <Check size={18} color="#10b981" />
                    : isLocked
                      ? <Lock size={14} color="#1E3A5F" />
                      : <span className="text-base">{phase.icon}</span>
                  }
                </div>
              </div>

              {/* Card */}
              <div className="ml-14 sm:ml-20">
                <button
                  onClick={() => setExpandedPhase(isExpanded ? null : phase.phase)}
                  className="w-full text-left p-4 sm:p-5 rounded-xl border transition-all duration-200"
                  style={{
                    background: isCurrent ? '#0f1629' : isCompleted ? '#051a12' : '#0a0f24',
                    borderColor: isCurrent ? '#E5A82940' : isCompleted ? '#10b98130' : '#1E3A5F',
                    opacity: isLocked ? 0.5 : 1,
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-base">{phase.icon}</span>
                        <h3 className="text-base sm:text-lg font-semibold"
                          style={{ color: isLocked ? '#6b7a99' : '#fff' }}>
                          Phase {phase.phase}: {phase.name}
                        </h3>
                        {isCurrent && (
                          <span className="px-2 py-0.5 rounded text-xs font-bold uppercase"
                            style={{ background: '#1a1400', color: '#E5A829', fontSize: '10px' }}>
                            Current
                          </span>
                        )}
                        {isCompleted && <Check size={15} color="#10b981" />}
                      </div>
                      <p className="text-sm" style={{ color: '#6b7a99' }}>{phase.subtitle}</p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-xs" style={{ color: '#6b7a99' }}>{phase.weeks}</span>
                        {!isLocked && phase.totalProblems > 0 && (
                          <>
                            <span style={{ color: '#1E3A5F' }}>•</span>
                            <span className="text-xs" style={{ color: '#6b7a99' }}>
                              {phase.solvedProblems}/{phase.totalProblems} problems
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!isLocked && phase.totalProblems > 0 && (
                        <span className="text-sm font-bold" style={{ color: '#E5A829' }}>{phase.progress}%</span>
                      )}
                      {isExpanded
                        ? <ChevronUp size={16} color="#6b7a99" />
                        : <ChevronDown size={16} color="#6b7a99" />
                      }
                    </div>
                  </div>

                  {/* Progress bar */}
                  {!isLocked && phase.totalProblems > 0 && (
                    <div className="mt-3 h-1 rounded-full overflow-hidden" style={{ background: '#1E3A5F' }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${phase.progress}%` }}
                        transition={{ duration: 0.8, delay: index * 0.1 }}
                        className="h-full rounded-full"
                        style={{ background: isCompleted ? '#10b981' : '#E5A829' }}
                      />
                    </div>
                  )}
                </button>

                {/* Expanded content */}
                <AnimatePresence>
                  {isExpanded && !isLocked && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-1 p-4 rounded-xl" style={{ background: '#0a0f24', border: '1px solid #1E3A5F' }}>

                        {/* Tab switcher */}
                        <div className="flex gap-1 mb-4 p-1 rounded-lg w-fit" style={{ background: '#0f1629' }}>
                          <button
                            onClick={() => setActiveTab(prev => ({ ...prev, [phase.phase]: "learn" }))}
                            className="flex items-center gap-1.5 px-4 py-1.5 rounded-md text-sm font-medium transition-all"
                            style={{
                              background: tab === "learn" ? '#1a1400' : 'transparent',
                              color: tab === "learn" ? '#E5A829' : '#6b7a99',
                              border: tab === "learn" ? '1px solid #E5A82930' : '1px solid transparent',
                            }}>
                            <BookOpen size={13} />
                            Learn
                          </button>
                          <button
                            onClick={() => setActiveTab(prev => ({ ...prev, [phase.phase]: "practice" }))}
                            className="flex items-center gap-1.5 px-4 py-1.5 rounded-md text-sm font-medium transition-all"
                            style={{
                              background: tab === "practice" ? '#1a1400' : 'transparent',
                              color: tab === "practice" ? '#E5A829' : '#6b7a99',
                              border: tab === "practice" ? '1px solid #E5A82930' : '1px solid transparent',
                            }}>
                            <Zap size={13} />
                            Practice
                          </button>
                        </div>

                        {/* Tab content */}
                        {tab === "learn" && <SessionsTab phaseNum={phase.phase} />}
                        {tab === "practice" && <ProblemsTab phase={phase} currentWeek={currentWeek} />}

                        {/* Checkpoint */}
                        {isCurrent && checkpointLabels[phase.phase] && (
                          <div className="mt-4 p-3 rounded-lg text-xs" style={{ background: '#0f1629', color: '#6b7a99', border: '1px solid #1E3A5F' }}>
                            🎯 {checkpointLabels[phase.phase]}
                          </div>
                        )}

                        {/* Advance button */}
                        {isCurrent && (
                          <div className="mt-3">
                            <button
                              onClick={handleAdvance}
                              disabled={advancing}
                              className="w-full py-2.5 rounded-lg text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-50"
                              style={{ background: '#E5A829', color: '#0a0f24' }}>
                              {advancing ? "Checking..." : "Advance to Next Phase →"}
                            </button>
                            {advanceMsg && (
                              <p className="text-xs mt-2 text-center" style={{ color: '#6b7a99' }}>{advanceMsg}</p>
                            )}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
