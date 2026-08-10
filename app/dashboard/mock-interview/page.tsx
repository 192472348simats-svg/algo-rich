"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

export const dynamic = "force-dynamic";

const COMPANIES = [
  { id: "Amazon",    label: "Amazon",    icon: "📦", color: "#FF9900", desc: "2 medium-hard in 90 min · OA style" },
  { id: "Google",    label: "Google",    icon: "🔵", color: "#4285F4", desc: "Hard graphs · DP · Always optimize" },
  { id: "Flipkart",  label: "Flipkart",  icon: "🛒", color: "#F7CB45", desc: "LRU Cache · Trie · Heaps · OOP" },
  { id: "Microsoft", label: "Microsoft", icon: "🪟", color: "#00A4EF", desc: "Trees (40%) · Arrays · Clean code" },
  { id: "TCS",       label: "TCS / Wipro / Infosys", icon: "🏢", color: "#7B68EE", desc: "Easy-medium · Speed · Campus OA" },
  { id: "General",   label: "General Placement", icon: "⭐", color: "#E5A829", desc: "Balanced mix across all patterns" },
];

const DIFFICULTIES = [
  { id: "easy",   label: "Easy",   desc: "Warm up · 15-20 min per problem" },
  { id: "medium", label: "Medium", desc: "Real OA level · 20-30 min per problem" },
  { id: "hard",   label: "Hard",   desc: "FAANG level · 30-40 min per problem" },
  { id: "mixed",  label: "Mixed",  desc: "1 medium + 1 hard · Most realistic" },
];

const TIME_OPTIONS = [
  { mins: 20, label: "20 min", desc: "Quick practice" },
  { mins: 45, label: "45 min", desc: "Standard OA" },
  { mins: 60, label: "60 min", desc: "Full interview" },
  { mins: 90, label: "90 min", desc: "Amazon-style" },
];

const PROBLEM_COUNTS = [
  { count: 1, label: "1 Problem", desc: "Focused practice" },
  { count: 2, label: "2 Problems", desc: "Standard OA" },
  { count: 3, label: "3 Problems", desc: "Extended session" },
];

export default function MockInterviewSetupPage() {
  const router = useRouter();
  const [company, setCompany] = useState<string>("Amazon");
  const [difficulty, setDifficulty] = useState<string>("mixed");
  const [timeLimitMins, setTimeLimitMins] = useState<number>(45);
  const [problemCount, setProblemCount] = useState<number>(2);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedCompany = COMPANIES.find((c) => c.id === company)!;

  const handleStart = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/mock-interview/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company, difficulty, timeLimitMins, problemCount }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to start session");
      router.push(`/dashboard/mock-interview/${data.sessionId}`);
    } catch (e) {
      setError((e as Error).message);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/dashboard" className="text-sm text-white/40 hover:text-white/70 transition-colors">
          ← Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-white mt-4 mb-1">Mock Interview</h1>
        <p className="text-white/50 text-sm">Simulate a real technical interview. Zyra gives you honest feedback after.</p>
      </div>

      <div className="space-y-8">
        {/* Company Selection */}
        <div>
          <h2 className="text-sm font-semibold text-white/60 uppercase tracking-widest mb-3">Target Company</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {COMPANIES.map((c) => (
              <motion.button
                key={c.id}
                onClick={() => setCompany(c.id)}
                whileTap={{ scale: 0.97 }}
                className={`text-left p-4 rounded-2xl border transition-all ${
                  company === c.id
                    ? "border-[var(--color)] bg-[var(--color)]/10"
                    : "border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04]"
                }`}
                style={{ "--color": c.color } as React.CSSProperties}
              >
                <div className="text-2xl mb-2">{c.icon}</div>
                <div className="font-bold text-white text-sm leading-tight">{c.label}</div>
                <div className="text-[11px] text-white/40 mt-1 leading-tight">{c.desc}</div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Difficulty */}
        <div>
          <h2 className="text-sm font-semibold text-white/60 uppercase tracking-widest mb-3">Difficulty</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {DIFFICULTIES.map((d) => (
              <motion.button
                key={d.id}
                onClick={() => setDifficulty(d.id)}
                whileTap={{ scale: 0.97 }}
                className={`text-left p-3.5 rounded-xl border transition-all ${
                  difficulty === d.id
                    ? "border-[#E5A829] bg-[#E5A829]/10"
                    : "border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04]"
                }`}
              >
                <div className={`text-sm font-bold mb-0.5 ${difficulty === d.id ? "text-[#E5A829]" : "text-white"}`}>
                  {d.label}
                </div>
                <div className="text-[11px] text-white/40 leading-tight">{d.desc}</div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Time Limit + Problem Count */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h2 className="text-sm font-semibold text-white/60 uppercase tracking-widest mb-3">Time Limit</h2>
            <div className="flex flex-col gap-2">
              {TIME_OPTIONS.map((t) => (
                <motion.button
                  key={t.mins}
                  onClick={() => setTimeLimitMins(t.mins)}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center justify-between px-4 py-2.5 rounded-xl border text-left transition-all ${
                    timeLimitMins === t.mins
                      ? "border-[#E5A829] bg-[#E5A829]/10"
                      : "border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04]"
                  }`}
                >
                  <span className={`font-bold text-sm ${timeLimitMins === t.mins ? "text-[#E5A829]" : "text-white"}`}>
                    {t.label}
                  </span>
                  <span className="text-[11px] text-white/40">{t.desc}</span>
                </motion.button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-white/60 uppercase tracking-widest mb-3">Problems</h2>
            <div className="flex flex-col gap-2">
              {PROBLEM_COUNTS.map((p) => (
                <motion.button
                  key={p.count}
                  onClick={() => setProblemCount(p.count)}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center justify-between px-4 py-2.5 rounded-xl border text-left transition-all ${
                    problemCount === p.count
                      ? "border-[#E5A829] bg-[#E5A829]/10"
                      : "border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04]"
                  }`}
                >
                  <span className={`font-bold text-sm ${problemCount === p.count ? "text-[#E5A829]" : "text-white"}`}>
                    {p.label}
                  </span>
                  <span className="text-[11px] text-white/40">{p.desc}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Session Preview */}
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
          <h3 className="text-sm font-semibold text-white/60 mb-3">Your Session</h3>
          <div className="flex flex-wrap gap-3 text-sm">
            <span className="px-3 py-1 rounded-full font-bold" style={{ background: `${selectedCompany.color}20`, color: selectedCompany.color }}>
              {selectedCompany.icon} {selectedCompany.label}
            </span>
            <span className="px-3 py-1 rounded-full bg-white/[0.06] text-white/70 capitalize">{difficulty}</span>
            <span className="px-3 py-1 rounded-full bg-white/[0.06] text-white/70">{timeLimitMins} minutes</span>
            <span className="px-3 py-1 rounded-full bg-white/[0.06] text-white/70">{problemCount} problem{problemCount > 1 ? "s" : ""}</span>
          </div>
          <p className="text-xs text-white/30 mt-3">
            ⚠️ Zyra is hidden during the interview — no hints. This is a real simulation.
          </p>
        </div>

        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* Start Button */}
        <motion.button
          onClick={handleStart}
          disabled={loading}
          whileTap={{ scale: 0.98 }}
          className="w-full py-4 rounded-2xl font-bold text-[#0a0f24] text-base transition-all disabled:opacity-60"
          style={{ background: loading ? "#a07a1c" : "linear-gradient(135deg, #FFD700, #E5A829)" }}
        >
          {loading ? "Setting up your interview..." : `Start ${selectedCompany.label} Mock Interview →`}
        </motion.button>
      </div>
    </div>
  );
}
