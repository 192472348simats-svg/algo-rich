// NEW: Testimonials + trust signals
"use client";

import { motion } from "framer-motion";

const TESTIMONIALS = [
  {
    name: "Priya S.",
    college: "SRM Institute of Science & Technology",
    text: "I failed 3 placement rounds before AlgoRich. The structured path made it click. Got placed at TCS Digital in 6 weeks.",
    xp: "4,820 XP",
    streak: "42 days",
  },
  {
    name: "Arjun K.",
    college: "Anna University",
    text: "The sessions are short and focused. Zyra's hints never give away the answer — they make you think. That's rare.",
    xp: "3,210 XP",
    streak: "28 days",
  },
  {
    name: "Divya M.",
    college: "VIT Chennai",
    text: "I went from barely understanding recursion to solving sliding window problems in 3 weeks. The XP system kept me going.",
    xp: "6,540 XP",
    streak: "67 days",
  },
];

const TRUST_ITEMS = [
  { label: "Free to start", icon: "🆓" },
  { label: "No setup needed", icon: "⚡" },
  { label: "Browser-based Python", icon: "🐍" },
  { label: "Progress auto-saved", icon: "💾" },
];

export default function SocialProofSection() {
  return (
    <section className="py-24 px-4 md:px-8" style={{ borderTop: "1px solid #1E3A5F" }}>
      <div className="max-w-6xl mx-auto">
        {/* Trust strip */}
        <motion.div className="flex flex-wrap justify-center gap-6 mb-16"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
          {TRUST_ITEMS.map((t) => (
            <div key={t.label} className="flex items-center gap-2 text-sm" style={{ color: "#6b7a99" }}>
              <span>{t.icon}</span>
              <span>{t.label}</span>
            </div>
          ))}
        </motion.div>

        <motion.div className="mb-12 text-center" initial={{ opacity: 0, y: -16 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="w-6 h-px" style={{ background: "#E5A829" }} />
            <span className="text-xs font-medium tracking-widest uppercase" style={{ color: "#E5A829" }}>Student stories</span>
            <span className="w-6 h-px" style={{ background: "#E5A829" }} />
          </div>
          <h2 className="text-4xl font-bold text-white" style={{ letterSpacing: "-0.02em" }}>
            Students who got placed
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.1 }} viewport={{ once: true }}
              className="rounded-2xl p-6"
              style={{ background: "#0f1629", border: "1px solid #1E3A5F" }}>
              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, si) => (
                  <span key={si} style={{ color: "#E5A829" }}>★</span>
                ))}
              </div>
              <p className="text-sm leading-relaxed mb-5" style={{ color: "#c8d0e0" }}>"{t.text}"</p>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-white">{t.name}</div>
                  <div className="text-xs mt-0.5" style={{ color: "#6b7a99" }}>{t.college}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-medium" style={{ color: "#E5A829" }}>{t.xp}</div>
                  <div className="text-xs mt-0.5" style={{ color: "#6b7a99" }}>🔥 {t.streak}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
