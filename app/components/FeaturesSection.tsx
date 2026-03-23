// REDESIGNED v2: Navy+gold theme, lucide icons with gold/blue/green accents
"use client";

import { motion } from "framer-motion";
import { BookOpen, TrendingUp, Code2, Repeat2, Map, Brain } from "lucide-react";

const features = [
  { icon: Map, iconColor: '#E5A829', iconBg: '#1a1400', title: "Structured learning path", description: "From Python basics to advanced DSA — a curriculum designed in the right order so nothing feels random." },
  { icon: Code2, iconColor: '#61afef', iconBg: '#051628', title: "In-browser Python editor", description: "Write and run real Python without any setup. Instant test feedback every time you submit." },
  { icon: Brain, iconColor: '#10b981', iconBg: '#051a12', title: "Pattern recognition", description: "Learn the 15 core DSA patterns. Once you see them, every new problem becomes recognizable." },
  { icon: Repeat2, iconColor: '#E5A829', iconBg: '#1a1400', title: "Spaced repetition", description: "SM-2 flashcard algorithm resurfaces problems at exactly the right time for long-term retention." },
  { icon: TrendingUp, iconColor: '#10b981', iconBg: '#051a12', title: "XP and streaks", description: "Earn XP for every lesson and problem solved. Your streak keeps you consistent day after day." },
  { icon: BookOpen, iconColor: '#61afef', iconBg: '#051628', title: "Guided walkthroughs", description: "Stuck? A step-by-step guide walks through the thinking process — without just handing you the answer." },
];

const FeaturesSection = () => {
  return (
    <section className="py-24 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div className="mb-14" initial={{ opacity: 0, y: -16 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="w-6 h-px" style={{ background: '#E5A829' }} />
            <span className="text-xs font-medium tracking-widest uppercase" style={{ color: '#E5A829' }}>Why Algo Rich</span>
          </div>
          <h2 className="text-4xl font-bold text-white mb-3" style={{ letterSpacing: '-0.02em' }}>
            Everything you need to go from zero to interview-ready
          </h2>
          <p className="text-lg" style={{ color: '#6b7a99' }}>No fluff. Just the tools that actually build skill.</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.07 }} viewport={{ once: true }}
                className="p-6 rounded-xl transition-all duration-200"
                style={{ background: '#0f1629', border: '1px solid #1E3A5F' }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#E5A82950'; (e.currentTarget as HTMLDivElement).style.background = '#111d35'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#1E3A5F'; (e.currentTarget as HTMLDivElement).style.background = '#0f1629'; }}
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
};

export default FeaturesSection;