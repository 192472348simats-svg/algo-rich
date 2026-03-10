"use client";

import { motion } from "framer-motion";

type PatternDifficulty = 1 | 2 | 3 | 4 | 5;
type PatternStatus = "locked" | "available" | "in-progress" | "completed";

interface PatternCardProps {
  name: string;
  slug: string;
  description: string;
  icon: string;
  difficulty: PatternDifficulty;
  category: string;
  status: PatternStatus;
  progress?: {
    visualizationWatched: boolean;
    templateStudied: boolean;
    quizPassed: boolean;
    problemsSolved: number;
    totalProblems: number;
  };
  onClick?: () => void;
  className?: string;
}

const difficultyColors = [
  "",
  "text-emerald-400",
  "text-primary",
  "text-primary",
  "text-orange-400",
  "text-red-400",
];

const statusConfig = {
  locked: {
    badge: "Locked",
    badgeColor: "bg-card/60 text-muted-foreground/70",
    cardOpacity: 0.5,
    cursor: "cursor-not-allowed",
  },
  available: {
    badge: "Available",
    badgeColor: "bg-primary/20 text-primary",
    cardOpacity: 1,
    cursor: "cursor-pointer",
  },
  "in-progress": {
    badge: "In Progress",
    badgeColor: "bg-primary/20 text-primary",
    cardOpacity: 1,
    cursor: "cursor-pointer",
  },
  completed: {
    badge: "Mastered",
    badgeColor: "bg-emerald-500/20 text-emerald-400",
    cardOpacity: 1,
    cursor: "cursor-pointer",
  },
};

export default function PatternCard({
  name,
  slug,
  description,
  icon,
  difficulty,
  category,
  status,
  progress,
  onClick,
  className = "",
}: PatternCardProps) {
  const config = statusConfig[status];
  const totalCheckpoints = 3;
  const completedCheckpoints = progress
    ? [
        progress.visualizationWatched,
        progress.templateStudied,
        progress.quizPassed,
      ].filter(Boolean).length
    : 0;

  const problemProgress = progress
    ? (progress.problemsSolved / Math.max(progress.totalProblems, 1)) * 100
    : 0;

  return (
    <motion.div
      whileHover={status !== "locked" ? { y: -4, scale: 1.02 } : {}}
      whileTap={status !== "locked" ? { scale: 0.98 } : {}}
      onClick={status !== "locked" ? onClick : undefined}
      className={`relative card-shiny p-5 ${config.cursor} group ${className}`}
      style={{ opacity: config.cardOpacity }}
    >
      {/* Top row - icon, name, status */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{icon}</span>
          <div>
            <h3 className="font-bold text-foreground text-sm group-hover:text-white transition-colors">
              {name}
            </h3>
            <span className="text-xs text-muted-foreground/70">{category}</span>
          </div>
        </div>
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${config.badgeColor}`}>
          {config.badge}
        </span>
      </div>

      {/* Description */}
      <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
        {description}
      </p>

      {/* Difficulty */}
      <div className="flex items-center gap-1 mb-3">
        <span className="text-xs text-muted-foreground/70 mr-1">Difficulty:</span>
        {Array.from({ length: 5 }, (_, i) => (
          <span
            key={i}
            className={`text-xs ${
              i < difficulty ? difficultyColors[difficulty] : "text-background/60"
            }`}
          >
            ●
          </span>
        ))}
      </div>

      {/* Learning progress checkpoints */}
      {(status === "in-progress" || status === "completed") && progress && (
        <div className="space-y-2">
          {/* Checkpoint dots */}
          <div className="flex items-center gap-1.5">
            {[
              { key: "watch", done: progress.visualizationWatched, label: "Watch" },
              { key: "study", done: progress.templateStudied, label: "Study" },
              { key: "quiz", done: progress.quizPassed, label: "Quiz" },
            ].map((cp) => (
              <div key={cp.key} className="flex items-center gap-1">
                <div
                  className={`w-2 h-2 rounded-full ${
                    cp.done ? "bg-emerald-400" : "bg-card/40"
                  }`}
                />
                <span
                  className={`text-[10px] ${
                    cp.done
                      ? "text-emerald-400"
                      : "text-muted-foreground/60"
                  }`}
                >
                  {cp.label}
                </span>
              </div>
            ))}
          </div>

          {/* Problem progress bar */}
          <div>
            <div className="flex justify-between text-[10px] text-muted-foreground/70 mb-1">
              <span>Problems</span>
              <span>
                {progress.problemsSolved}/{progress.totalProblems}
              </span>
            </div>
            <div className="h-1 bg-card/60 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${problemProgress}%` }}
                transition={{ duration: 0.6 }}
                className="h-full rounded-full"
                style={{ background: "var(--gradient-gold)" }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Locked overlay */}
      {status === "locked" && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl opacity-30">🔒</span>
        </div>
      )}
    </motion.div>
  );
}
