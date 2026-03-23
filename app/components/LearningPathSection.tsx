// REDESIGNED: Vertical progression, locked stages at 40% opacity, topic pills, no glow
"use client";

import { motion } from "framer-motion";
import { Lock, CheckCircle2 } from "lucide-react";

const stages = [
  { phase: "Phase 1", title: "Python Foundations", description: "Variables, loops, functions, lists, dicts. The building blocks you'll use in every problem.", duration: "4–5 weeks", topics: ["Syntax & types", "Functions", "Lists & dicts", "Recursion basics"], status: "available", accentColor: '#7C6FCD', accentBg: '#13103a' },
  { phase: "Phase 2", title: "Core Data Structures", description: "Arrays, stacks, queues, linked lists, hash maps, trees. Know when to use each one.", duration: "6–8 weeks", topics: ["Arrays & strings", "Hash maps", "Linked lists", "Stacks & queues"], status: "available", accentColor: '#61afef', accentBg: '#042C53' },
  { phase: "Phase 3", title: "Algorithm Patterns", description: "Two pointers, sliding window, BFS/DFS, binary search, dynamic programming.", duration: "6–8 weeks", topics: ["Two pointers", "BFS / DFS", "Binary search", "Dynamic programming"], status: "locked", accentColor: '#10b981', accentBg: '#04342C' },
  { phase: "Phase 4", title: "Interview Readiness", description: "Hard problems, time-pressure practice, and pattern fluency under stress.", duration: "4–6 weeks", topics: ["Hard problems", "Mock interviews", "Pattern drills", "Time optimization"], status: "locked", accentColor: '#E5A829', accentBg: '#412402' },
];

const LearningPathSection = () => {
  return (
    <section id="curriculum" className="py-24 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div className="mb-14" initial={{ opacity: 0, y: -16 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
          <h2 className="text-4xl font-bold text-white mb-3" style={{ letterSpacing: '-0.02em' }}>Your learning path</h2>
          <p className="text-lg" style={{ color: '#6b7a99' }}>Four phases. Each builds directly on the last.</p>
        </motion.div>

        <div className="space-y-3">
          {stages.map((stage, index) => (
            <motion.div key={index} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.08 }} viewport={{ once: true }} style={{ opacity: stage.status === 'locked' ? 0.45 : 1 }}>
              <div className="rounded-xl p-6" style={{ background: '#0f1629', border: `1px solid ${stage.status === 'locked' ? '#1a2847' : stage.accentColor + '30'}` }}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="px-3 py-1 rounded text-xs font-semibold flex-shrink-0 mt-0.5" style={{ background: stage.accentBg, color: stage.accentColor }}>{stage.phase}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-base font-semibold text-white">{stage.title}</h3>
                        {stage.status === 'locked' ? <Lock size={13} color="#6b7a99" /> : <CheckCircle2 size={13} color="#10b981" />}
                      </div>
                      <p className="text-sm mb-4" style={{ color: '#6b7a99' }}>{stage.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {stage.topics.map((topic, ti) => (
                          <span key={ti} className="text-xs px-2.5 py-1 rounded" style={{ background: '#0a0f24', color: '#6b7a99', border: '1px solid #1a2847' }}>{topic}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs flex-shrink-0" style={{ color: '#6b7a99' }}>{stage.duration}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LearningPathSection;