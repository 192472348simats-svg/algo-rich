"use client";

import { motion } from "framer-motion";

const steps = [
  { number: "01", title: "Pick your level", description: "Tell us where you are. We build your path from there." },
  { number: "02", title: "Learn the concept", description: "Short sessions. One idea at a time. Watch it, then do it." },
  { number: "03", title: "Solve problems", description: "Apply it in the editor. Real code, real test cases." },
  { number: "04", title: "Stay consistent", description: "XP and streaks keep you moving. Progress compounds." },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div className="mb-16" initial={{ opacity: 0, y: -16 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="w-6 h-px" style={{ background: '#E5A829' }} />
            <span className="text-xs font-medium tracking-widest uppercase" style={{ color: '#E5A829' }}>The Process</span>
          </div>
          <h2 className="text-4xl font-bold text-white mb-3" style={{ letterSpacing: '-0.02em' }}>How it works</h2>
          <p className="text-lg" style={{ color: '#6b7a99' }}>Four steps. Signup to solving hard problems.</p>
        </motion.div>
        <div className="hidden md:grid grid-cols-4 gap-0 relative">
          <div className="absolute top-8 left-[12.5%] right-[12.5%] h-px" style={{ borderTop: '1px dashed #1E3A5F', zIndex: 0 }} />
          {steps.map((step, index) => (
            <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.1 }} viewport={{ once: true }} className="flex flex-col items-center text-center px-6 relative z-10">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6" style={{ background: '#0f1629', border: '1px solid #E5A82950' }}>
                <span className="text-xl font-bold" style={{ color: '#E5A829' }}>{step.number}</span>
              </div>
              <h3 className="text-base font-semibold text-white mb-2">{step.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#6b7a99' }}>{step.description}</p>
            </motion.div>
          ))}
        </div>
        <div className="md:hidden space-y-0">
          {steps.map((step, index) => (
            <motion.div key={index} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: index * 0.08 }} viewport={{ once: true }} className="flex gap-5 pb-8">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#0f1629', border: '1px solid #E5A82950' }}>
                  <span className="text-base font-bold" style={{ color: '#E5A829' }}>{step.number}</span>
                </div>
                {index < steps.length - 1 && <div className="w-px flex-1 mt-3" style={{ borderLeft: '1px dashed #1E3A5F' }} />}
              </div>
              <div className="pt-2">
                <h3 className="text-base font-semibold text-white mb-1">{step.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#6b7a99' }}>{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
