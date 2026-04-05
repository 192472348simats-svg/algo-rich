"use client";

import { motion } from "framer-motion";
import { BookOpen, TrendingUp, Code2, Repeat2, Map, Brain } from "lucide-react";

const features = [
  { icon: Map, iconColor: '#E5A829', iconBg: '#1a1400', title: "Structured path", description: "Python → DSA → Patterns. In the right order. Nothing skipped, nothing repeated." },
  { icon: Code2, iconColor: '#61afef', iconBg: '#051628', title: "In-browser Python editor", description: "Write and run real Python in your browser. No setup, no installs, instant feedback." },
  { icon: Brain, iconColor: '#10b981', iconBg: '#051a12', title: "15 core patterns", description: "Two pointers, sliding window, BFS, DP — once you recognize a pattern, every problem becomes familiar." },
  { icon: Repeat2, iconColor: '#E5A829', iconBg: '#1a1400', title: "Spaced repetition", description: "Problems resurface at the right time so what you learn actually sticks." },
  { icon: TrendingUp, iconColor: '#10b981', iconBg: '#051a12', title: "XP and streaks", description: "Earn XP every session. Your streak keeps the habit alive day after day." },
  { icon: BookOpen, iconColor: '#61afef', iconBg: '#051628', title: "Guided hints", description: "Stuck? Get a nudge, not the answer. You think it through — Zyra just points the way." },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div className="mb-14" initial={{ opacity: 0, y: -16 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="w-6 h-px" style={{ background: '#E5A829' }} />
            <span className="text-xs font-medium tracking-widest uppercase" style={{ color: '#E5A829' }}>Why Algo Rich</span>
          </div>
          <h2 className="text-4xl font-bold text-white mb-3" style={{ letterSpacing: '-0.02em' }}>
            Built for one thing — placements.
          </h2>
          <p className="text-lg" style={{ color: '#6b7a99' }}>Everything here exists to help you solve problems faster and remember them longer.</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.07 }} viewport={{ once: true }}
                className="p-6 rounded-xl transition-all duration-200"
                style={{ background: '#0f1629', border: '1px solid #1E3A5F' }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#E5A82950'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#1E3A5F'; }}
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ background: feature.iconBg, border: `1px solid ${feature.iconColor}20` }}>
                  <Icon size={18} color={feature.iconColor} />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#6b7a99' }}>{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
