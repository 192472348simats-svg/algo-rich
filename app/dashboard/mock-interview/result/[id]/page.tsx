"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

interface SessionResult {
  id: string;
  company: string;
  difficulty: string;
  timeLimitMins: number;
  score: number | null;
  status: string;
  startedAt: string;
  endedAt: string | null;
  aiFeedback: string | null;
  problemTitles: string[];
  submissions?: Record<string, { code: string; passed: boolean }>;
}

const COMPANY_COLORS: Record<string, string> = {
  Amazon: "#FF9900",
  Google: "#4285F4",
  Flipkart: "#F7CB45",
  Microsoft: "#00A4EF",
  TCS: "#7B68EE",
  General: "#E5A829",
};

function ScoreRing({ score }: { score: number }) {
  const r = 52;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? "#4ade80" : score >= 50 ? "#E5A829" : "#f87171";

  return (
    <div className="relative w-32 h-32 flex items-center justify-center">
      <svg className="absolute inset-0" width="128" height="128" viewBox="0 0 128 128">
        <circle cx="64" cy="64" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
        <motion.circle
          cx="64" cy="64" r={r}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          transform="rotate(-90 64 64)"
        />
      </svg>
      <div className="text-center z-10">
        <motion.div
          className="text-3xl font-black"
          style={{ color }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {score}
        </motion.div>
        <div className="text-[10px] text-white/40 uppercase tracking-widest">Score</div>
      </div>
    </div>
  );
}

export default function MockInterviewResultPage() {
  const params = useParams<{ id: string }>();
  const sessionId = params.id;
  const [result, setResult] = useState<SessionResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/mock-interview/history")
      .then((r) => r.json())
      .then((data) => {
        const session = (data.sessions ?? []).find((s: SessionResult) => s.id === sessionId);
        if (session) { setResult(session); }
        else { setError("Result not found."); }
        setLoading(false);
      })
      .catch(() => { setError("Failed to load result."); setLoading(false); });
  }, [sessionId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#E5A829] border-t-transparent rounded-full animate-spin" />
          <p className="text-white/50 text-sm">Loading your results...</p>
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] gap-4">
        <p className="text-red-400 text-sm">{error ?? "Result not found"}</p>
        <Link href="/dashboard/mock-interview" className="text-[#E5A829] text-sm hover:underline">
          ← Try another interview
        </Link>
      </div>
    );
  }

  const score = result.score ?? 0;
  const companyColor = COMPANY_COLORS[result.company] ?? "#E5A829";
  const timeTakenMins = result.endedAt && result.startedAt
    ? Math.round((new Date(result.endedAt).getTime() - new Date(result.startedAt).getTime()) / 60000)
    : result.timeLimitMins;

  const scoreLabel = score >= 80 ? "Excellent 🔥" : score >= 60 ? "Good 👍" : score >= 40 ? "Keep Practicing 💪" : "Needs Work 📚";

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/dashboard/mock-interview" className="text-sm text-white/40 hover:text-white/70 transition-colors">
          ← Mock Interview
        </Link>
      </div>

      {/* Hero result card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border p-8 mb-6 relative overflow-hidden"
        style={{ borderColor: `${companyColor}30`, background: `linear-gradient(135deg, ${companyColor}08, transparent)` }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(229,168,41,0.06),transparent_60%)]" />
        <div className="relative flex items-center gap-8">
          <ScoreRing score={score} />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: `${companyColor}20`, color: companyColor }}>
                {result.company}
              </span>
              <span className="text-xs text-white/40 capitalize">{result.difficulty}</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">Interview Complete</h1>
            <p className="text-white/60 text-sm">{scoreLabel}</p>
            <div className="flex gap-4 mt-3 text-xs text-white/40">
              <span>⏱ {timeTakenMins} min used</span>
              <span>📝 {result.problemTitles.length} problem{result.problemTitles.length > 1 ? "s" : ""}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Problems summary */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 mb-5"
      >
        <h2 className="text-sm font-semibold text-white/60 uppercase tracking-widest mb-4">Problems</h2>
        <div className="space-y-3">
          {result.problemTitles.map((title, i) => {
            const problemIds = Object.keys(result.submissions ?? {});
            const sub = result.submissions?.[problemIds[i]];
            const passed = sub?.passed ?? false;
            return (
              <div key={i} className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${
                passed ? "border-emerald-500/20 bg-emerald-500/5" : "border-red-500/20 bg-red-500/5"
              }`}>
                <span className={`text-lg ${passed ? "text-emerald-400" : "text-red-400"}`}>
                  {passed ? "✓" : "✗"}
                </span>
                <div className="flex-1">
                  <div className="text-sm font-medium text-white">{title}</div>
                </div>
                <span className={`text-xs font-semibold ${passed ? "text-emerald-400" : "text-red-400"}`}>
                  {passed ? "Passed" : "Failed"}
                </span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Zyra Debrief */}
      {result.aiFeedback && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="rounded-2xl border border-[#E5A829]/20 bg-[#E5A829]/[0.04] p-5 mb-6"
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">⭐</span>
            <h2 className="text-sm font-bold text-[#E5A829]">Zyra&apos;s Debrief</h2>
          </div>
          <p className="text-sm text-white/75 leading-relaxed whitespace-pre-line">{result.aiFeedback}</p>
        </motion.div>
      )}

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex gap-3"
      >
        <Link
          href="/dashboard/mock-interview"
          className="flex-1 py-3.5 rounded-xl text-center text-sm font-semibold border border-white/10 text-white/70 hover:bg-white/5 transition-all"
        >
          Try Another →
        </Link>
        <Link
          href="/dashboard/practice"
          className="flex-1 py-3.5 rounded-xl text-center text-sm font-bold text-[#0a0f24]"
          style={{ background: "linear-gradient(135deg, #FFD700, #E5A829)" }}
        >
          Practice Problems ⭐
        </Link>
      </motion.div>
    </div>
  );
}
