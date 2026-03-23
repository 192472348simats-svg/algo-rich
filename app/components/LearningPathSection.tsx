// REDESIGNED v2: Navy+gold theme, gold phase badges, locked stages dimmed
"use client";

import { motion } from "framer-motion";
import { Lock, CheckCircle2 } from "lucide-react";

const stages = [
  { phase: "Phase 1", title: "Python Foundations", description: "Variables, loops, functions, lists, dicts. The building blocks you'll use in every problem.", duration: "4–5 weeks", topics: ["Syntax & types", "Functions", "Lists & dicts", "Recursion basics"], status: "available" },
  { phase: "Phase 2", title: "Core Data Structures", description: "Arrays, stacks, queues, linked lists, hash maps, trees. Know when to use each one.", duration: "6–8 weeks", topics: ["Arrays & strings", "Hash maps", "Linked lists", "Stacks & queues"], status: "available" },
  { phase: "Phase 3", title: "Algorithm Patterns", description: "Two pointers, sliding window, BFS/DFS, binary search, dynamic programming.", duration: "6–8 weeks", topics: ["Two pointers", "BFS / DFS", "Binary search", "Dynamic programming"], status: "locked" },
  { phase: "Phase 4", title: "Interview Readiness", description: "Hard problems, time-pressure practice, and pattern fluency under stress.", duration: "4–6 weeks", topics: ["Hard problems", "Mock interviews", "Pattern drills", "Time optimization"], status: "locked" },
];

const LearningPathSection = () => {
  return (
    <section id="curriculum" className="py-24 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div className="mb-14" initial={{ opacity: 0, y: -16 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="w-6 h-px" style={{ background: '#E5A829' }} />
            <span className="text-xs font-medium tracking-widest uppercase" style={{ color: '#E5A829' }}>Curriculum</span>
          </div>
          <h2 className="text-4xl font-bold text-white mb-3" style={{ letterSpacing: '-0.02em' }}>Your learning path</h2>
          <p className="text-lg" style={{ color: '#6b7a99' }}>Four phases. Each builds directly on the last.</p>
        </motion.div>
        <div className="space-y-3">
          {stages.map((stage, index) => (
            <motion.div key={index} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.08 }} viewport={{ once: true }} style={{ opacity: stage.status === 'locked' ? 0.45 : 1 }}>
              <div className="rounded-xl p-6 transition-all duration-200" style={{ background: '#0f1629', border: `1px solid ${stage.status === 'locked' ? '#1E3A5F' : '#E5A82940'}` }}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="px-3 py-1 rounded text-xs font-semibold flex-shrink-0 mt-0.5" style={{ background: '#1a1400', color: '#E5A829', border: '1px solid #E5A82930' }}>
                      {stage.phase}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-base font-semibold text-white">{stage.title}</h3>
                        {stage.status === 'locked' ? <Lock size={13} color="#6b7a99" /> : <CheckCircle2 size={13} color="#10b981" />}
                      </div>
                      <p className="text-sm mb-4" style={{ color: '#6b7a99' }}>{stage.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {stage.topics.map((topic, ti) => (
                          <span key={ti} className="text-xs px-2.5 py-1 rounded" style={{ background: '#0a0f24', color: '#6b7a99', border: '1px solid #1E3A5F' }}>{topic}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs flex-shrink-0 mt-1" style={{ color: '#6b7a99' }}>{stage.duration}</span>
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