"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface ReadinessComponent {
  name: string;
  score: number;
  weight: number;
  status: "strong" | "moderate" | "weak" | "not-started";
}

interface TopicBreakdown {
  topic: string;
  solved: number;
  total: number;
  percentage: number;
}

interface WeeklyDay {
  day: string;
  count: number;
  isToday: boolean;
}

interface ReadinessData {
  overall: number;
  level: string;
  components: ReadinessComponent[];
  topicBreakdown: TopicBreakdown[];
  weeklyProgress: WeeklyDay[];
  interviewEstimate: string;
}

const statusColors: Record<string, string> = {
  strong: "bg-emerald-500",
  moderate: "bg-yellow-500",
  weak: "bg-red-500",
  "not-started": "bg-white/10",
};

const statusTextColors: Record<string, string> = {
  strong: "text-emerald-400",
  moderate: "text-yellow-400",
  weak: "text-red-400",
  "not-started": "text-white/20",
};

const levelColors: Record<string, string> = {
  beginner: "text-white/40",
  developing: "text-blue-400",
  intermediate: "text-yellow-400",
  advanced: "text-emerald-400",
  "interview-ready": "text-primary",
};

export default function ReadinessOverview() {
  const [data, setData] = useState<ReadinessData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/readiness")
      .then((res) => (res.ok ? res.json() : null))
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-white/5 rounded w-1/3" />
          <div className="h-20 bg-white/5 rounded" />
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-white/60">
            Placement Readiness
          </h3>
          <span
            className={`text-xs font-medium capitalize ${levelColors[data.level] || "text-white/40"}`}
          >
            {data.level.replace("-", " ")}
          </span>
        </div>

        {/* Progress bar */}
        <div className="relative mb-3">
          <div className="h-3 bg-white/[0.06] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${data.overall}%` }}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full"
            />
          </div>
          <span className="absolute right-0 -top-5 text-xs text-white/40">
            {data.overall}%
          </span>
        </div>

        <p className="text-xs text-white/25">{data.interviewEstimate}</p>

        {/* Component bars */}
        <div className="mt-6 space-y-3">
          {data.components.map((comp) => (
            <div key={comp.name} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/40">{comp.name}</span>
                <span
                  className={`text-[10px] ${statusTextColors[comp.status] || "text-white/20"}`}
                >
                  {comp.score}%
                </span>
              </div>
              <div className="h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${comp.score}%` }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className={`h-full rounded-full ${statusColors[comp.status] || "bg-white/10"}`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Heatmap */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
        <h3 className="text-sm font-medium text-white/60 mb-4">This Week</h3>
        <div className="flex items-end gap-2 justify-between">
          {data.weeklyProgress.map((day) => (
            <div key={day.day} className="flex flex-col items-center gap-1.5">
              <div
                className={`w-8 rounded-md transition-all ${
                  day.count > 0
                    ? day.count >= 5
                      ? "bg-emerald-500/60 h-12"
                      : day.count >= 3
                        ? "bg-emerald-500/40 h-9"
                        : "bg-emerald-500/20 h-6"
                    : "bg-white/[0.04] h-3"
                }`}
              />
              {day.count > 0 && (
                <span className="text-[10px] text-white/30">{day.count}</span>
              )}
              <span
                className={`text-[10px] ${
                  day.isToday
                    ? "text-primary font-medium"
                    : "text-white/20"
                }`}
              >
                {day.day}
              </span>
              {day.isToday && (
                <div className="w-1 h-1 rounded-full bg-primary" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Topic Breakdown */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
        <h3 className="text-sm font-medium text-white/60 mb-4">
          Topic Coverage
        </h3>
        <div className="space-y-2">
          {data.topicBreakdown.slice(0, 10).map((topic) => (
            <div key={topic.topic} className="flex items-center gap-3">
              <span className="text-xs text-white/40 w-28 truncate capitalize">
                {topic.topic.replace(/-/g, " ")}
              </span>
              <div className="flex-1 h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary/50 rounded-full"
                  style={{ width: `${topic.percentage}%` }}
                />
              </div>
              <span className="text-[10px] text-white/25 w-14 text-right">
                {topic.solved}/{topic.total}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
