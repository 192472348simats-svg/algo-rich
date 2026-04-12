"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import Link from "next/link";
import { Activity, Sparkles, Timer } from "lucide-react";

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

const CODE_STEPS = [
  {
    label: "Brute",
    code: `def two_sum(nums, target):\n    for i in range(len(nums)):\n        for j in range(i+1, len(nums)):\n            if nums[i]+nums[j]==target:\n                return [i, j]`,
    badge: "O(n²)",
    badgeColor: "#ef4444",
    badgeBg: "#1a0505",
  },
  {
    label: "Optimal",
    code: `def two_sum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        comp = target - num\n        if comp in seen:\n            return [seen[comp], i]\n        seen[num] = i`,
    badge: "O(n)",
    badgeColor: "#10b981",
    badgeBg: "#0d2a1a",
  },
];

export default function HeroSection() {
  const [statsVisible, setStatsVisible] = useState(false);
  const [codeStep, setCodeStep] = useState(0);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const springX = useSpring(tiltX, { stiffness: 220, damping: 20, mass: 1 });
  const springY = useSpring(tiltY, { stiffness: 220, damping: 20, mass: 1 });

  const studentsCount = useCounter(2847, 1800, statsVisible);
  const problemsCount = useCounter(150, 1400, statsVisible);
  const streakDays = useCounter(34, 1200, statsVisible);

  useEffect(() => {
    const t = setTimeout(() => setStatsVisible(true), 400);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setCodeStep((v) => (v + 1) % CODE_STEPS.length), 3200);
    return () => clearInterval(t);
  }, []);

  const step = CODE_STEPS[codeStep];

  const handleTilt = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -7;
    const rotateY = ((x - centerX) / centerX) * 7;
    tiltX.set(rotateX);
    tiltY.set(rotateY);
  };

  const resetTilt = () => {
    tiltX.set(0);
    tiltY.set(0);
  };

  return (
    <section className="relative min-h-screen flex flex-col justify-center pt-24 pb-20 px-4 md:px-8 overflow-hidden">
      {/* Depth layers */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(79,157,255,0.18), transparent 32%), radial-gradient(circle at 80% 18%, rgba(245,184,65,0.16), transparent 36%), radial-gradient(circle at 60% 70%, rgba(79,157,255,0.12), transparent 30%)",
          filter: "blur(16px)",
          opacity: 0.7,
          zIndex: 0,
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: "radial-gradient(#ffffff 0.8px, transparent 0.8px)",
          backgroundSize: "120px 120px",
        }}
      />

      <div className="max-w-7xl w-full mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex items-center gap-2 mb-5 flex-wrap">
              <span className="text-xs" style={{ color: "#6b7a99" }}>
                Get placed at
              </span>
              {COMPANIES.map((c) => (
                <span
                  key={c}
                  className="text-xs px-2.5 py-1 rounded-md font-semibold"
                  style={{ background: "#0f1629", border: "1px solid #1E3A5F", color: "#c8d0e0" }}
                >
                  {c}
                </span>
              ))}
            </div>

            <h1
              className="text-5xl sm:text-6xl font-bold text-white mb-5"
              style={{
                letterSpacing: "-0.03em",
                lineHeight: "1.05",
                textShadow: "0 8px 30px rgba(0,0,0,0.45)",
              }}
            >
              From Python basics
              <br />
              to <span className="text-gradient-gold text-glow">placement-ready</span>
              <br />
              in 90 days.
            </h1>

            <p className="text-lg mb-8 leading-relaxed max-w-xl" style={{ color: "#c8d0e0" }}>
              Structured DSA learning with immersive sessions, streak-driven XP, and a premium in-browser Python IDE.
              No guesswork—just the fastest path to a confident placement.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <Link href="/signup">
                <button
                  className="px-7 py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 hover:-translate-y-0.5 glow-on-hover"
                  style={{
                    background: "linear-gradient(135deg,#F5B841,#dba11f)",
                    color: "#0B0F1A",
                    boxShadow: "0 12px 40px rgba(245,184,65,0.35)",
                  }}
                >
                  Start learning free →
                </button>
              </Link>
              <Link href="/signin">
                <button
                  className="px-7 py-3.5 rounded-xl font-semibold text-sm transition-all duration-300"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    color: "#d9e1f2",
                    border: "1px solid rgba(79,157,255,0.35)",
                    backdropFilter: "blur(10px)",
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.borderColor = "#F5B841")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(79,157,255,0.35)")}
                >
                  Sign in
                </button>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { val: `${studentsCount.toLocaleString()}+`, label: "students", icon: <Sparkles size={16} /> },
                { val: `${problemsCount}+`, label: "problems", icon: <Activity size={16} /> },
                { val: `${streakDays} days`, label: "avg streak", icon: <Timer size={16} /> },
              ].map((s, i) => (
                <div
                  key={i}
                  className="card-glass px-4 py-3 rounded-xl transition-transform duration-300"
                  style={{ background: "rgba(15,22,41,0.65)", boxShadow: "0 10px 30px rgba(0,0,0,0.35)" }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{
                        background: "rgba(79,157,255,0.12)",
                        border: "1px solid rgba(79,157,255,0.3)",
                        color: "#4F9DFF",
                        boxShadow: "0 10px 30px rgba(79,157,255,0.25)",
                      }}
                    >
                      {s.icon}
                    </div>
                    <div>
                      <div className="text-lg font-semibold" style={{ color: "#F5B841" }}>
                        {s.val}
                      </div>
                      <div className="text-xs uppercase tracking-wide" style={{ color: "#7d8ba8" }}>
                        {s.label}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.55, delay: 0.15 }} className="hidden lg:block">
            <div
              className="relative rounded-3xl overflow-hidden"
              style={{
                background: "linear-gradient(145deg, rgba(15,22,41,0.9), rgba(10,15,26,0.9))",
                border: "1px solid rgba(79,157,255,0.25)",
                boxShadow: "0 25px 70px rgba(0,0,0,0.55), 0 0 60px rgba(79,157,255,0.18), 0 0 50px rgba(245,184,65,0.18)",
                perspective: "1200px",
              }}
            >
              <motion.div
                ref={cardRef}
                className="relative rounded-3xl overflow-hidden"
                style={{
                  transformStyle: "preserve-3d",
                  rotateX: springX,
                  rotateY: springY,
                  transition: "box-shadow 0.3s ease",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.55)",
                }}
                onMouseMove={handleTilt}
                onMouseLeave={resetTilt}
              >
                <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(120deg, rgba(79,157,255,0.08), rgba(245,184,65,0.08))" }} />
                <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.08), transparent 55%)", mixBlendMode: "screen", opacity: 0.6 }} />

                <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid rgba(79,157,255,0.25)", background: "rgba(10,15,26,0.8)", backdropFilter: "blur(12px)" }}>
                  <div className="flex items-center gap-1.5">
                    {["#ef4444", "#f59e0b", "#10b981"].map((c, i) => (
                      <span key={i} className="w-2.5 h-2.5 rounded-full" style={{ background: c, opacity: 0.7 }} />
                    ))}
                  </div>
                  <span className="text-xs font-mono" style={{ color: "#6b7a99" }}>
                    two_sum.py
                  </span>
                  <div className="flex rounded-md overflow-hidden text-xs font-mono" style={{ border: "1px solid #1E3A5F" }}>
                    {CODE_STEPS.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => setCodeStep(i)}
                        className="px-3 py-1 transition-colors"
                        style={{
                          background: codeStep === i ? "#1a1400" : "transparent",
                          color: codeStep === i ? "#E5A829" : "#6b7a99",
                        }}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-5 min-h-[200px]" style={{ background: "linear-gradient(180deg, rgba(12,18,34,0.7) 0%, rgba(10,15,26,0.9) 100%)" }}>
                  <motion.div key={codeStep} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
                    <div className="flex text-sm font-mono relative">
                      <div className="select-none pr-4 text-right" style={{ color: "#1E3A5F", minWidth: "28px", lineHeight: "1.75" }}>
                        {step.code.split("\n").map((_, n) => (
                          <div key={n}>{n + 1}</div>
                        ))}
                      </div>
                      <pre style={{ lineHeight: "1.75", color: "#c8d0e0", margin: 0, whiteSpace: "pre" }}>
                        <code
                          dangerouslySetInnerHTML={{
                            __html: step.code
                              .replace(/def /g, '<span style="color:#c678dd">def </span>')
                              .replace(/(two_sum|enumerate|range|len)/g, '<span style="color:#61afef">$1</span>')
                              .replace(/\bin\b/g, '<span style="color:#c678dd">in</span>')
                              .replace(/\bfor\b/g, '<span style="color:#c678dd">for</span>')
                              .replace(/\bif\b/g, '<span style="color:#c678dd">if</span>')
                              .replace(/\breturn\b/g, '<span style="color:#c678dd">return</span>'),
                          }}
                        />
                        <span className="inline-block w-1.5 h-4 align-middle ml-1" style={{ background: "#F5B841", animation: "blink 1.1s steps(2,end) infinite" }} />
                      </pre>
                    </div>
                  </motion.div>
                </div>

                <div style={{ borderTop: "1px solid rgba(79,157,255,0.25)", padding: "10px 16px", backdropFilter: "blur(8px)", background: "rgba(10,15,26,0.85)" }}>
                  {[["nums=[2,7,11,15], target=9", "[0,1]"], ["nums=[3,2,4], target=6", "[1,2]"]].map(([inp, out], i) => (
                    <div key={i} className="flex items-center justify-between py-1.5 text-xs font-mono" style={{ borderBottom: i === 0 ? "1px solid rgba(79,157,255,0.12)" : "none" }}>
                      <span style={{ color: "#6b7a99" }}>{inp}</span>
                      <div className="flex items-center gap-2">
                        <span style={{ color: "#c8d0e0" }}>{out}</span>
                        <span style={{ color: "#10b981" }}>✓</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between px-4 py-2.5" style={{ borderTop: "1px solid rgba(245,184,65,0.25)", background: "rgba(12,18,34,0.9)" }}>
                  <span className="text-xs font-mono" style={{ color: "#9fb0d0" }}>
                    Pattern: <span style={{ color: "#F5B841" }}>Hash Map</span>
                  </span>
                  <span
                    className="text-xs px-2 py-0.5 rounded font-medium"
                    style={{
                      background: step.badgeBg,
                      color: step.badgeColor,
                      border: `1px solid ${step.badgeColor}30`,
                      boxShadow: `0 0 18px ${step.badgeColor}30`,
                    }}
                  >
                    {step.badge}
                  </span>
                </div>

                <div
                  className="absolute top-4 right-4 px-3 py-1.5 text-xs rounded-full font-semibold uppercase tracking-wide"
                  style={{
                    background: "rgba(79,157,255,0.2)",
                    color: "#E5A829",
                    border: "1px solid rgba(79,157,255,0.35)",
                    boxShadow: "0 0 20px rgba(79,157,255,0.25)",
                  }}
                >
                  Optimal
                </div>

                <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(180deg, transparent 70%, rgba(255,255,255,0.04) 100%)", mixBlendMode: "screen" }} />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes blink {
          0%,
          50% {
            opacity: 1;
          }
          50.01%,
          100% {
            opacity: 0;
          }
        }
      `}</style>
    </section>
  );
}
