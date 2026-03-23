// REDESIGNED: Horizontal timeline desktop, step numbers muted not gold, dashed connector
"use client";

import { motion } from "framer-motion";

const steps = [
  { number: "01", title: "Pick your level", description: "Tell us where you are. We build a personalized curriculum starting from your current knowledge." },
  { number: "02", title: "Learn the concept", description: "Short, focused lessons explain each data structure or algorithm from first principles." },
  { number: "03", title: "Solve problems", description: "Apply what you learned in the in-browser editor with instant test feedback." },
  { number: "04", title: "Review and retain", description: "Spaced repetition brings back problems at the right intervals so nothing fades." },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-24 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div className="mb-16" initial={{ opacity: 0, y: -16 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
          <h2 className="text-4xl font-bold text-white mb-3" style={{ letterSpacing: '-0.02em' }}>How it works</h2>
          <p className="text-lg" style={{ color: '#6b7a99' }}>Four steps from signup to solving hard problems.</p>
        </motion.div>

        <div className="hidden md:grid grid-cols-4 gap-0 relative">
          <div className="absolute top-8 left-[12.5%] right-[12.5%] h-px" style={{ borderTop: '1px dashed #1a2847', zIndex: 0 }} />
          {steps.map((step, index) => (
            <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.1 }} viewport={{ once: true }} className="flex flex-col items-center text-center px-6 relative z-10">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6" style={{ background: '#0f1629', border: '1px solid #1a2847' }}>
                <span className="text-xl font-bold" style={{ color: '#2d3f6b' }}>{step.number}</span>
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
                <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#0f1629', border: '1px solid #1a2847' }}>
                  <span className="text-base font-bold" style={{ color: '#2d3f6b' }}>{step.number}</span>
                </div>
                {index < steps.length - 1 && <div className="w-px flex-1 mt-3" style={{ borderLeft: '1px dashed #1a2847' }} />}
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
};

export default HowItWorksSection;