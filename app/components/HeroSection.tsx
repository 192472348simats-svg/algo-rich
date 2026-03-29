// REDESIGNED v3: Outcome-first framing, animated stats, Zyra teaser, company badges
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

function useCounter(target: number, duration = 1800, start = false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (ts: number) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setVal(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return val;
}

const COMPANIES = ["TCS", "Zoho", "Infosys", "Wipro", "Cognizant", "HCL"];
const ZYRA_MESSAGES = [
  "Hint: try using a hash map here. O(n) is possible! 💡",
  "Nice solve! You're on a 5-day streak 🔥",
  "Two pointers — you'll see this in 30% of array problems.",
  "Almost! Check your edge case for empty arrays.",
];

const CODE_STEPS = [
  {
    label: "Brute force",
    code: `def two_sum(nums, target):\n    for i in range(len(nums)):\n        for j in range(i+1, len(nums)):\n            if nums[i]+nums[j]==target:\n                return [i, j]`,
    badge: "O(n²) Slow", badgeColor: "#ef4444", badgeBg: "#1a0505",
  },
  {
    label: "Optimised",
    code: `def two_sum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        comp = target - num\n        if comp in seen:\n            return [seen[comp], i]\n        seen[num] = i`,
    badge: "O(n) Optimal", badgeColor: "#10b981", badgeBg: "#0d2a1a",
  },
];

export default function HeroSection() {
  const [statsVisible, setStatsVisible] = useState(false);
  const [codeStep, setCodeStep] = useState(0);
  const [zyraMsg, setZyraMsg] = useState(0);
  const [zyraVisible, setZyraVisible] = useState(false);

  const studentsCount = useCounter(2847, 1800, statsVisible);
  const problemsCount = useCounter(150, 1400, statsVisible);
  const streakDays = useCounter(34, 1200, statsVisible);

  useEffect(() => { const t = setTimeout(() => setStatsVisible(true), 600); return () => clearTimeout(t); }, []);
  useEffect(() => { const t = setTimeout(() => setZyraVisible(true), 2200); return () => clearTimeout(t); }, []);
  useEffect(() => {
    if (!zyraVisible) return;
    const t = setInterval(() => setZyraMsg(v => (v + 1) % ZYRA_MESSAGES.length), 3500);
    return () => clearInterval(t);
  }, [zyraVisible]);
  useEffect(() => {
    const t = setInterval(() => setCodeStep(v => (v + 1) % CODE_STEPS.length), 3200);
    return () => clearInterval(t);
  }, []);

  const step = CODE_STEPS[codeStep];

  return (
    <section className="relative min-h-screen flex flex-col justify-center pt-24 pb-20 px-4 md:px-8 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{ backgroundImage: `radial-gradient(#E5A829 1px, transparent 1px)`, backgroundSize: "40px 40px" }} />
      <div className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full opacity-[0.06]"
        style={{ background: "#E5A829", filter: "blur(80px)" }} />

      <div className="max-w-7xl w-full mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium"
            style={{ background: "#1a1400", border: "1px solid #E5A82940", color: "#E5A829" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Used by students at SRM, VIT, Anna University &amp; more
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: "easeOut" }}>
            <div className="flex items-center gap-2 mb-5 flex-wrap">
              <span className="text-xs font-medium" style={{ color: "#6b7a99" }}>Crack</span>
              {COMPANIES.map(c => (
                <span key={c} className="text-xs px-2.5 py-1 rounded-md font-semibold"
                  style={{ background: "#0f1629", border: "1px solid #1E3A5F", color: "#c8d0e0" }}>{c}</span>
              ))}
            </div>

            <h1 className="text-5xl sm:text-6xl font-bold text-white mb-5" style={{ letterSpacing: "-0.025em", lineHeight: "1.08" }}>
              From Python basics<br />
              to <span style={{ color: "#E5A829" }}>placement-ready</span><br />
              in 90 days.
            </h1>

            <p className="text-lg mb-8 leading-relaxed max-w-lg" style={{ color: "#c8d0e0" }}>
              A structured, gamified DSA platform for CS students. In-browser Python editor, Zyra your AI guide, XP streaks, and 150+ problems — no random grind, just a clear path.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <Link href="/signup">
                <button className="px-7 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 hover:opacity-90"
                  style={{ background: "#E5A829", color: "#0a0f24" }}>
                  Start learning free →
                </button>
              </Link>
              <a href="#demo">
                <button className="px-7 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200"
                  style={{ background: "transparent", color: "#c8d0e0", border: "1px solid #1E3A5F" }}
                  onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.borderColor = "#E5A829"}
                  onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.borderColor = "#1E3A5F"}>
                  Try a session live ↓
                </button>
              </a>
            </div>

            <div className="grid grid-cols-3 gap-4 p-4 rounded-xl" style={{ background: "#0f1629", border: "1px solid #1E3A5F" }}>
              {[
                { val: `${studentsCount.toLocaleString()}+`, label: "students learning" },
                { val: `${problemsCount}+`, label: "DSA problems" },
                { val: `${streakDays}`, label: "avg streak days" },
              ].map((s, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl font-bold tabular-nums" style={{ color: "#E5A829" }}>{s.val}</div>
                  <div className="text-xs mt-0.5" style={{ color: "#6b7a99" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right panel */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            className="hidden lg:block relative">
            <div className="rounded-2xl overflow-hidden" style={{ background: "#0f1629", border: "1px solid #1E3A5F", boxShadow: "0 8px 40px rgba(0,0,0,0.5)" }}>
              <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid #1E3A5F", background: "#0a0f24" }}>
                <div className="flex items-center gap-1.5">
                  {["#ef4444","#f59e0b","#10b981"].map((c,i) => <span key={i} className="w-2.5 h-2.5 rounded-full" style={{ background: c, opacity: 0.7 }} />)}
                </div>
                <span className="text-xs font-mono" style={{ color: "#6b7a99" }}>two_sum.py</span>
                <div className="flex rounded-md overflow-hidden text-xs font-mono" style={{ border: "1px solid #1E3A5F" }}>
                  {CODE_STEPS.map((s, i) => (
                    <button key={i} onClick={() => setCodeStep(i)} className="px-2.5 py-1 transition-colors"
                      style={{ background: codeStep === i ? "#1a1400" : "transparent", color: codeStep === i ? "#E5A829" : "#6b7a99" }}>
                      {i === 0 ? "Brute" : "Optimal"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 min-h-[170px]">
                <motion.div key={codeStep} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                  <div className="flex text-sm font-mono">
                    <div className="select-none pr-4 text-right" style={{ color: "#1E3A5F", minWidth: "28px", lineHeight: "1.75" }}>
                      {step.code.split("\n").map((_, n) => <div key={n}>{n + 1}</div>)}
                    </div>
                    <pre style={{ lineHeight: "1.75", color: "#c8d0e0", margin: 0, whiteSpace: "pre" }}>
                      <code dangerouslySetInnerHTML={{ __html: step.code
                        .replace(/def /g, '<span style="color:#c678dd">def </span>')
                        .replace(/(two_sum|enumerate|range|len)/g, '<span style="color:#61afef">$1</span>')
                        .replace(/\bin\b/g, '<span style="color:#c678dd">in</span>')
                        .replace(/\bfor\b/g, '<span style="color:#c678dd">for</span>')
                        .replace(/\bif\b/g, '<span style="color:#c678dd">if</span>')
                        .replace(/\breturn\b/g, '<span style="color:#c678dd">return</span>')
                      }} />
                    </pre>
                  </div>
                </motion.div>
              </div>

              <div style={{ borderTop: "1px solid #1E3A5F", padding: "10px 16px" }}>
                {[["nums=[2,7,11,15], target=9","[0,1]"],["nums=[3,2,4], target=6","[1,2]"]].map(([inp, out], i) => (
                  <div key={i} className="flex items-center justify-between py-1.5 text-xs font-mono" style={{ borderBottom: i === 0 ? "1px solid #0a0f24" : "none" }}>
                    <span style={{ color: "#6b7a99" }}>{inp}</span>
                    <div className="flex items-center gap-2">
                      <span style={{ color: "#c8d0e0" }}>{out}</span>
                      <span style={{ color: "#10b981" }}>✓</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between px-4 py-2.5" style={{ borderTop: "1px solid #1E3A5F", background: "#0a0f24" }}>
                <span className="text-xs font-mono" style={{ color: "#6b7a99" }}>Pattern: <span style={{ color: "#E5A829" }}>Hash Map</span></span>
                <span className="text-xs px-2 py-0.5 rounded font-medium" style={{ background: step.badgeBg, color: step.badgeColor, border: `1px solid ${step.badgeColor}30` }}>
                  {step.badge}
                </span>
              </div>
            </div>

            {/* Zyra floating */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={zyraVisible ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
              className="absolute -bottom-6 -right-4 flex items-end gap-2"
            >
              <div className="rounded-2xl rounded-br-sm px-4 py-3 max-w-[210px]"
                style={{ background: "#0f1629", border: "1px solid #E5A82940", boxShadow: "0 4px 20px rgba(0,0,0,0.4)" }}>
                <motion.p key={zyraMsg} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}
                  className="text-xs leading-relaxed" style={{ color: "#c8d0e0" }}>
                  {ZYRA_MESSAGES[zyraMsg]}
                </motion.p>
              </div>
              <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: "#1a1400", border: "1px solid #E5A82950" }}>
                <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
                  <polygon points="14,3 16.7,10.3 24.5,10.3 18.4,15.1 20.7,22.5 14,18 7.3,22.5 9.6,15.1 3.5,10.3 11.3,10.3" fill="#E5A829" />
                  <circle cx="11" cy="12" r="1.2" fill="#0a0f24" />
                  <circle cx="17" cy="12" r="1.2" fill="#0a0f24" />
                  <path d="M11.5 15.5 Q14 17.5 16.5 15.5" stroke="#0a0f24" strokeWidth="1.2" fill="none" strokeLinecap="round" />
                </svg>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
