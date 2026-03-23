// REDESIGNED: Removed emoji icons, distinct icon colors per feature, border-on-hover only, no gold everywhere
"use client";

import { motion } from "framer-motion";
import { BookOpen, TrendingUp, Code2, Repeat2, Map, Brain } from "lucide-react";

const features = [
  {
    icon: Map,
    iconColor: '#7C6FCD',
    iconBg: '#13103a',
    title: "Structured learning path",
    description: "Follow a curriculum designed from first principles — arrays to graphs, basics to interviews. No randomness.",
  },
  {
    icon: Code2,
    iconColor: '#61afef',
    iconBg: '#042C53',
    title: "In-browser Python editor",
    description: "Write and run real Python in your browser. Zero setup. Instant feedback on every problem you solve.",
  },
  {
    icon: Brain,
    iconColor: '#10b981',
    iconBg: '#04342C',
    title: "Pattern recognition",
    description: "Learn the 15 core DSA patterns. Once you see them, you can apply them to any new problem you face.",
  },
  {
    icon: Repeat2,
    iconColor: '#E5A829',
    iconBg: '#412402',
    title: "Spaced repetition",
    description: "Flashcard review system using SM-2 algorithm. Problems resurface at the exact right time for long-term memory.",
  },
  {
    icon: TrendingUp,
    iconColor: '#ef4444',
    iconBg: '#501313',
    title: "XP and streaks",
    description: "Earn XP for every lesson and problem. Maintain your streak. Progress feels like a game, not a chore.",
  },
  {
    icon: BookOpen,
    iconColor: '#c678dd',
    iconBg: '#26215C',
    title: "Guided walkthroughs",
    description: "Stuck? A step-by-step guide walks you through the thinking process without giving away the answer.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-24 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="mb-14"
          initial={{ opacity: 0, y: -16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-white mb-3" style={{ letterSpacing: '-0.02em' }}>
            Everything you need to go from zero to interview-ready
          </h2>
          <p className="text-lg" style={{ color: '#6b7a99' }}>
            No fluff. Just the tools that actually build skill.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.07 }}
                viewport={{ once: true }}
                className="p-6 rounded-xl transition-all duration-200 group cursor-default"
                style={{
                  background: '#0f1629',
                  border: '1px solid #1a2847',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = '#2d3f6b';
                  (e.currentTarget as HTMLDivElement).style.background = '#111827';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = '#1a2847';
                  (e.currentTarget as HTMLDivElement).style.background = '#0f1629';
                }}
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                  style={{ background: feature.iconBg }}>
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