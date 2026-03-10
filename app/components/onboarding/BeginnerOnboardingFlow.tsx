"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

interface Props {
  onComplete: () => void;
}

const PHASES = [
  {
    id: 1,
    emoji: "🐣",
    title: "Complete Beginner",
    description: "Never written code before. Start with Python from absolute zero.",
    tag: "Phase 1 · Python Foundations",
    color: "border-emerald-500/40 bg-emerald-500/5",
    textColor: "text-emerald-400",
  },
  {
    id: 2,
    emoji: "🐍",
    title: "Some Python",
    description: "You know basic Python. Ready to tackle logic and problem solving.",
    tag: "Phase 2 · Logic Building",
    color: "border-blue-500/40 bg-blue-500/5",
    textColor: "text-blue-400",
  },
  {
    id: 3,
    emoji: "⚡",
    title: "DSA Basics",
    description: "Familiar with arrays & loops. Time to go deeper into data structures.",
    tag: "Phase 3 · Data Structures",
    color: "border-purple-500/40 bg-purple-500/5",
    textColor: "text-purple-400",
  },
];

const PHASE_PATHS: Record<number, { icon: string; text: string }[]> = {
  1: [
    { icon: "🐍", text: "Python syntax & basics" },
    { icon: "🖨️", text: "Print, variables, data types" },
    { icon: "🔁", text: "Loops & conditions" },
    { icon: "🧩", text: "Functions & logic" },
    { icon: "📦", text: "Lists & dictionaries" },
  ],
  2: [
    { icon: "💡", text: "Problem decomposition" },
    { icon: "🔍", text: "Searching & sorting intro" },
    { icon: "📐", text: "Time complexity basics" },
    { icon: "🧠", text: "Pattern recognition" },
    { icon: "🏗️", text: "Arrays & strings" },
  ],
  3: [
    { icon: "🌳", text: "Trees & graphs" },
    { icon: "📚", text: "Stacks, queues, heaps" },
    { icon: "⚡", text: "Dynamic programming" },
    { icon: "🎯", text: "Competitive patterns" },
    { icon: "🏆", text: "Interview preparation" },
  ],
};

export default function BeginnerOnboardingFlow({ onComplete }: Props) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [selectedPhase, setSelectedPhase] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleFinish() {
    setSaving(true);
    try {
      await fetch("/api/onboarding/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ experience: "onboarding", phase: selectedPhase ?? 1 }),
      });
      onComplete();
      if (selectedPhase === 1) {
        router.push("/dashboard/sessions");
      } else {
        router.push("/dashboard");
      }
    } catch {
      setSaving(false);
    }
  }

  const steps = [
    // Step 0: Welcome
    <motion.div
      key="welcome"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8 text-center max-w-lg mx-auto"
    >
      <div className="text-6xl">🚀</div>
      <div>
        <h1 className="text-3xl font-bold text-white mb-3">Welcome to Algo Rich</h1>
        <p className="text-white/60 text-base leading-relaxed">
          A structured path from Python beginner to interview-ready — one lesson at a time.
        </p>
      </div>

      {/* Phase timeline */}
      <div className="flex items-center justify-center gap-0">
        {["🐍 Python", "💡 Logic", "🏗️ DSA", "⚡ Patterns", "🎯 Interviews"].map((phase, i) => (
          <div key={i} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div className="w-9 h-9 rounded-full border border-primary/30 bg-primary/10 flex items-center justify-center text-base">
                {phase.split(" ")[0]}
              </div>
              <span className="text-[10px] text-white/30 hidden sm:block">{phase.split(" ")[1]}</span>
            </div>
            {i < 4 && (
              <div className="w-8 h-px bg-white/10 mx-0.5" />
            )}
          </div>
        ))}
      </div>

      <button
        onClick={() => setStep(1)}
        className="px-8 py-3 rounded-xl bg-primary text-navy font-semibold text-base hover:bg-primary/90 transition-all cursor-pointer"
      >
        Let&apos;s Go →
      </button>
    </motion.div>,

    // Step 1: Experience selection
    <motion.div
      key="experience"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      className="space-y-6 max-w-lg mx-auto"
    >
      <div className="text-center">
        <p className="text-xs uppercase tracking-widest text-white/30 mb-2">Step 1 of 3</p>
        <h2 className="text-2xl font-bold text-white">Where are you starting from?</h2>
        <p className="text-white/50 text-sm mt-2">We&apos;ll build a path that fits your level</p>
      </div>

      <div className="space-y-3">
        {PHASES.map((phase) => (
          <button
            key={phase.id}
            onClick={() => setSelectedPhase(phase.id)}
            className={`w-full text-left rounded-xl border p-4 transition-all cursor-pointer ${
              selectedPhase === phase.id
                ? phase.color + " scale-[1.02]"
                : "border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04]"
            }`}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{phase.emoji}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-white text-sm">{phase.title}</p>
                  <span className={`text-[10px] ${selectedPhase === phase.id ? phase.textColor : "text-white/30"}`}>
                    {phase.tag}
                  </span>
                </div>
                <p className="text-xs text-white/50 mt-0.5">{phase.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      <button
        onClick={() => selectedPhase && setStep(2)}
        disabled={!selectedPhase}
        className="w-full py-3 rounded-xl bg-primary text-navy font-semibold text-sm
                   hover:bg-primary/90 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
      >
        Next →
      </button>
    </motion.div>,

    // Step 2: Your personalized path
    <motion.div
      key="path"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      className="space-y-6 max-w-lg mx-auto"
    >
      <div className="text-center">
        <p className="text-xs uppercase tracking-widest text-white/30 mb-2">Step 2 of 3</p>
        <h2 className="text-2xl font-bold text-white">Your Personalized Path</h2>
        <p className="text-white/50 text-sm mt-2">
          Starting at{" "}
          <span className="text-primary font-medium">
            {PHASES.find((p) => p.id === selectedPhase)?.tag}
          </span>
        </p>
      </div>

      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 space-y-3">
        {(PHASE_PATHS[selectedPhase ?? 1] ?? []).map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className="flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-sm">
              {item.icon}
            </div>
            <p className="text-sm text-white/70">{item.text}</p>
            <div className="flex-1 h-px bg-white/[0.04]" />
            <span className="text-[10px] text-white/20">Lesson {i + 1}</span>
          </motion.div>
        ))}
        <p className="text-xs text-white/30 text-center pt-2">+ many more sessions ahead →</p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => setStep(1)}
          className="flex-1 py-3 rounded-xl border border-white/[0.08] text-sm text-white/50 hover:text-white hover:bg-white/[0.04] transition-all cursor-pointer"
        >
          ← Change Level
        </button>
        <button
          onClick={() => setStep(3)}
          className="flex-[2] py-3 rounded-xl bg-primary text-navy font-semibold text-sm hover:bg-primary/90 transition-all cursor-pointer"
        >
          This looks right →
        </button>
      </div>
    </motion.div>,

    // Step 3: Let's begin
    <motion.div
      key="begin"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className="space-y-8 text-center max-w-lg mx-auto"
    >
      <div className="text-6xl">🎯</div>
      <div>
        <p className="text-xs uppercase tracking-widest text-white/30 mb-3">Step 3 of 3</p>
        <h2 className="text-2xl font-bold text-white mb-3">You&apos;re all set!</h2>
        <p className="text-white/60 text-sm leading-relaxed">
          Your learning path is ready. Each session takes about <strong className="text-white/80">15–20 minutes</strong> and
          ends with a real coding challenge. Complete one today to start your streak!
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 text-center">
        {[
          { icon: "⚡", label: "XP system", sub: "Earn XP each lesson" },
          { icon: "🔥", label: "Streaks", sub: "Come back daily" },
          { icon: "🏆", label: "Milestones", sub: "Celebrate wins" },
        ].map((item) => (
          <div key={item.label} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 space-y-1">
            <div className="text-xl">{item.icon}</div>
            <p className="text-xs font-medium text-white/70">{item.label}</p>
            <p className="text-[10px] text-white/30">{item.sub}</p>
          </div>
        ))}
      </div>

      <button
        onClick={handleFinish}
        disabled={saving}
        className="w-full py-3.5 rounded-xl bg-primary text-navy font-bold text-base
                   hover:bg-primary/90 disabled:opacity-50 transition-all cursor-pointer"
      >
        {saving ? "Setting up..." : "Begin My Journey 🚀"}
      </button>
    </motion.div>,
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(10, 17, 40, 0.97)" }}
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-10"
          style={{ background: "radial-gradient(circle, #D4AF37, transparent)" }} />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-10"
          style={{ background: "radial-gradient(circle, #3b82f6, transparent)" }} />
      </div>

      {/* Card */}
      <div className="relative w-full max-w-xl rounded-3xl border border-white/[0.08] bg-[#0d1627] p-8 shadow-2xl">
        {/* Step progress bar */}
        <div className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl overflow-hidden bg-white/[0.04]">
          <motion.div
            className="h-full bg-primary rounded-t-3xl"
            animate={{ width: `${((step + 1) / 4) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>

        <AnimatePresence mode="wait">
          {steps[step]}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
