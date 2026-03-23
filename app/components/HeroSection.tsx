// REDESIGNED v2: Navy+gold theme, AlgoRich branding, real code card, clean stat row
"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 pb-24 px-4 md:px-8 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(#E5A829 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />
      <div className="max-w-7xl w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div className="flex flex-col justify-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }}>
            <div className="inline-flex items-center gap-2 mb-6">
              <span className="w-6 h-px" style={{ background: '#E5A829' }} />
              <span className="text-xs font-medium tracking-widest uppercase" style={{ color: '#E5A829' }}>Python & DSA Learning</span>
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold text-white mb-5" style={{ letterSpacing: '-0.02em', lineHeight: '1.08' }}>
              Algo Rich.<br />
              <span style={{ color: '#E5A829' }}>Learn. Solve. Master.</span>
            </h1>
            <p className="text-lg mb-8 leading-relaxed max-w-lg" style={{ color: '#c8d0e0' }}>
              A structured path from Python basics to cracking any DSA interview.
              In-browser code execution, spaced repetition, and guided walkthroughs
              — built for CS students who want to actually get good.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <Link href="/signup">
                <button className="px-7 py-3 rounded-lg font-semibold text-sm transition-all duration-200 hover:opacity-90" style={{ background: '#E5A829', color: '#0a0f24' }}>
                  Start for Free →
                </button>
              </Link>
              <Link href="#how-it-works">
                <button className="px-7 py-3 rounded-lg font-semibold text-sm transition-all duration-200" style={{ background: 'transparent', color: '#c8d0e0', border: '1px solid #1E3A5F' }}
                  onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.borderColor = '#E5A829'}
                  onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.borderColor = '#1E3A5F'}>
                  See How It Works
                </button>
              </Link>
            </div>
            <div className="flex items-center gap-5 text-sm" style={{ color: '#6b7a99' }}>
              <span>150+ problems</span>
              <span style={{ color: '#1E3A5F' }}>|</span>
              <span>12 learning paths</span>
              <span style={{ color: '#1E3A5F' }}>|</span>
              <span>Free to start</span>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }} className="hidden lg:block">
            <div className="rounded-xl overflow-hidden" style={{ background: '#0f1629', border: '1px solid #1E3A5F', boxShadow: '0 4px 24px rgba(0,0,0,0.4)' }}>
              <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid #1E3A5F', background: '#0a0f24' }}>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ background: '#ef4444', opacity: 0.7 }} />
                  <span className="w-3 h-3 rounded-full" style={{ background: '#f59e0b', opacity: 0.7 }} />
                  <span className="w-3 h-3 rounded-full" style={{ background: '#10b981', opacity: 0.7 }} />
                </div>
                <span className="text-xs font-mono" style={{ color: '#6b7a99' }}>two_sum.py</span>
                <span className="text-xs px-2 py-0.5 rounded font-medium" style={{ background: '#0d2a1a', color: '#10b981', fontSize: '10px' }}>Easy</span>
              </div>
              <div className="flex text-sm font-mono p-4 overflow-x-auto">
                <div className="select-none pr-4 text-right" style={{ color: '#1E3A5F', minWidth: '28px', lineHeight: '1.7' }}>
                  {[1,2,3,4,5,6,7,8,9,10].map(n => <div key={n}>{n}</div>)}
                </div>
                <pre style={{ lineHeight: '1.7', color: '#c8d0e0', margin: 0 }}>
                  <code>
                    <span style={{ color: '#c678dd' }}>def</span>{" "}
                    <span style={{ color: '#61afef' }}>two_sum</span>
                    <span>(nums, target):</span>{"\n"}
                    {"    "}<span style={{ color: '#5c6370', fontStyle: 'italic' }}># O(n) with hash map</span>{"\n"}
                    {"    "}seen = {"{}"}{"\n"}
                    {"    "}<span style={{ color: '#c678dd' }}>for</span>{" i, num "}<span style={{ color: '#c678dd' }}>in</span>{" "}<span style={{ color: '#61afef' }}>enumerate</span>(nums):{"\n"}
                    {"        "}complement = target - num{"\n"}
                    {"        "}<span style={{ color: '#c678dd' }}>if</span>{" complement "}<span style={{ color: '#c678dd' }}>in</span>{" seen:"}{"\n"}
                    {"            "}<span style={{ color: '#c678dd' }}>return</span>{" [seen[complement], i]"}{"\n"}
                    {"        "}seen[num] = i{"\n"}
                    {"    "}<span style={{ color: '#c678dd' }}>return</span>{" []"}{"\n"}
                  </code>
                </pre>
              </div>
              <div style={{ borderTop: '1px solid #1E3A5F', padding: '12px 16px' }}>
                <div className="text-xs mb-2 font-medium" style={{ color: '#6b7a99' }}>Test Results</div>
                {[
                  { input: 'nums=[2,7,11,15], target=9', output: '[0,1]' },
                  { input: 'nums=[3,2,4], target=6', output: '[1,2]' },
                  { input: 'nums=[3,3], target=6', output: '[0,1]' },
                ].map((t, i) => (
                  <div key={i} className="flex items-center justify-between py-1.5 text-xs font-mono" style={{ borderBottom: i < 2 ? '1px solid #0a0f24' : 'none' }}>
                    <span style={{ color: '#6b7a99' }}>{t.input}</span>
                    <div className="flex items-center gap-2">
                      <span style={{ color: '#c8d0e0' }}>{t.output}</span>
                      <span style={{ color: '#10b981' }}>✓</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between px-4 py-3" style={{ borderTop: '1px solid #1E3A5F', background: '#0a0f24' }}>
                <span className="text-xs font-mono" style={{ color: '#6b7a99' }}>
                  Time: <span style={{ color: '#10b981' }}>O(n)</span>{"  "}Space: <span style={{ color: '#10b981' }}>O(n)</span>
                </span>
                <span className="text-xs px-2 py-0.5 rounded font-medium" style={{ background: '#1a1400', color: '#E5A829', border: '1px solid #E5A82930' }}>
                  Pattern: Hash Map
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;