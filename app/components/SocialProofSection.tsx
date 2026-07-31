"use client";

import { motion } from "framer-motion";

const EXAMPLES = [
  {
    label: "Learner A",
    text: "The structured path from Python basics to patterns made everything click. I finally understand when to use which data structure.",
  },
  {
    label: "Learner B",
    text: "Sessions are short and focused. The hints make you think instead of just giving you the answer.",
  },
  {
    label: "Learner C",
    text: "Going from barely understanding recursion to solving sliding window problems felt like a huge leap — and it happened faster than I expected.",
  },
];

export default function SocialProofSection() {
  return (
    <section className="py-24 px-4 md:px-8" style={{ borderTop: "1px solid #1E3A5F" }}>
      <div className="max-w-6xl mx-auto">
        <motion.div className="mb-12 text-center" initial={{ opacity: 0, y: -16 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="w-6 h-px" style={{ background: "#E5A829" }} />
            <span className="text-xs font-medium tracking-widest uppercase" style={{ color: "#E5A829" }}>What it feels like</span>
            <span className="w-6 h-px" style={{ background: "#E5A829" }} />
          </div>
          <h2 className="text-4xl font-bold text-white mb-3" style={{ letterSpacing: "-0.02em" }}>
            What learning on Algo Rich looks like
          </h2>
          <p className="text-sm mt-2" style={{ color: "#6b7a99" }}>
            Illustrative examples — not real student data
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {EXAMPLES.map((t, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.1 }} viewport={{ once: true }}
              className="rounded-2xl p-6"
              style={{ background: "#0f1629", border: "1px solid #1E3A5F" }}>
              <p className="text-sm leading-relaxed mb-5" style={{ color: "#c8d0e0" }}>&quot;{t.text}&quot;</p>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-white">{t.label}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
