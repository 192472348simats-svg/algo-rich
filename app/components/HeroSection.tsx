"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import AvatarStack from "./landing/AvatarStack";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" as const },
  },
};

const codeSnippetVariants = {
  hidden: { opacity: 0, x: 40, rotateY: 8 },
  visible: {
    opacity: 1,
    x: 0,
    rotateY: 0,
    transition: { duration: 0.9, ease: "easeOut" as const, delay: 0.5 },
  },
};

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 pb-24 px-4 md:px-8 overflow-hidden">
      {/* Background glow accents */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-primary opacity-[0.04] blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full bg-primary opacity-[0.03] blur-[150px]" />
      </div>

      <div className="max-w-7xl w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <motion.div
            className="flex flex-col justify-center"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* Overline */}
            <motion.span
              variants={itemVariants}
              className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-5"
            >
              <span className="w-8 h-px bg-primary" />
              For Future Software Engineers
            </motion.span>

            {/* Headline */}
            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-[1.1] mb-6"
            >
              Stop memorizing.
              <br />
              <span className="text-gradient-gold">Start understanding.</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={itemVariants}
              className="text-lg md:text-xl text-foreground/80 mb-8 leading-relaxed max-w-lg"
            >
              Learn Python & Data Structures the right way — see the patterns,
              build real intuition, and gain the confidence to solve anything.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 mb-10"
            >
              <Link href="/signup">
                <motion.button
                  className="btn-primary px-8 py-3.5 text-base font-semibold rounded-lg"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Start Learning Free →
                </motion.button>
              </Link>
              <Link href="#how-it-works">
                <motion.button
                  className="btn-ghost px-8 py-3.5 text-base font-semibold rounded-lg"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                >
                  See How It Works ↓
                </motion.button>
              </Link>
            </motion.div>

            {/* Social Proof */}
            <motion.div variants={itemVariants}>
              <AvatarStack count={127} />
            </motion.div>
          </motion.div>

          {/* Right - Floating Code Snippet */}
          <motion.div
            variants={codeSnippetVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative hidden lg:flex items-center justify-center"
          >
            <div className="relative w-full max-w-md mx-auto">
              {/* Glow behind card */}
              <div className="absolute -inset-4 rounded-2xl bg-primary opacity-[0.06] blur-2xl" />

              {/* Code card */}
              <div className="relative card-glass rounded-xl overflow-hidden">
                {/* Title bar */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
                  <span className="w-3 h-3 rounded-full bg-red-500/70" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
                  <span className="w-3 h-3 rounded-full bg-green-500/70" />
                  <span className="ml-2 text-xs text-white/30 font-mono">
                    binary_search.py
                  </span>
                </div>

                {/* Code content */}
                <pre className="p-5 text-sm leading-relaxed font-mono overflow-x-auto">
                  <code>
                    <span className="text-[#c678dd]">def</span>{" "}
                    <span className="text-[#61afef]">binary_search</span>
                    <span className="text-white/80">(arr, target):</span>
                    {"\n"}
                    <span className="text-white/40">    </span>
                    <span className="text-white/80">lo, hi = </span>
                    <span className="text-[#d19a66]">0</span>
                    <span className="text-white/80">, </span>
                    <span className="text-[#61afef]">len</span>
                    <span className="text-white/80">(arr) - </span>
                    <span className="text-[#d19a66]">1</span>
                    {"\n\n"}
                    <span className="text-white/40">    </span>
                    <span className="text-[#c678dd]">while</span>
                    <span className="text-white/80"> lo {"<="} hi:</span>
                    {"\n"}
                    <span className="text-white/40">        </span>
                    <span className="text-white/80">mid = (lo + hi) </span>
                    <span className="text-[#c678dd]">//</span>
                    <span className="text-white/80"> </span>
                    <span className="text-[#d19a66]">2</span>
                    {"\n\n"}
                    <span className="text-white/40">        </span>
                    <span className="text-[#c678dd]">if</span>
                    <span className="text-white/80">
                      {" "}
                      arr[mid] == target:
                    </span>
                    {"\n"}
                    <span className="text-white/40">            </span>
                    <span className="text-[#c678dd]">return</span>
                    <span className="text-white/80"> mid</span>
                    {"\n"}
                    <span className="text-white/40">        </span>
                    <span className="text-[#c678dd]">elif</span>
                    <span className="text-white/80">
                      {" "}
                      arr[mid] {"<"} target:
                    </span>
                    {"\n"}
                    <span className="text-white/40">            </span>
                    <span className="text-white/80">lo = mid + </span>
                    <span className="text-[#d19a66]">1</span>
                    {"\n"}
                    <span className="text-white/40">        </span>
                    <span className="text-[#c678dd]">else</span>
                    <span className="text-white/80">:</span>
                    {"\n"}
                    <span className="text-white/40">            </span>
                    <span className="text-white/80">hi = mid - </span>
                    <span className="text-[#d19a66]">1</span>
                    {"\n\n"}
                    <span className="text-white/40">    </span>
                    <span className="text-[#c678dd]">return</span>
                    <span className="text-white/80"> -</span>
                    <span className="text-[#d19a66]">1</span>
                    {"\n\n"}
                    <span className="text-[#5c6370]">
                      # O(log n) — halve the search space each step
                    </span>
                  </code>
                </pre>
              </div>

              {/* Floating annotation */}
              <motion.div
                className="absolute -bottom-6 -left-6 card-glass rounded-lg px-4 py-2.5 text-xs"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <span className="text-primary font-semibold">
                  ✦ Pattern:
                </span>{" "}
                <span className="text-white/70">Divide & Conquer</span>
              </motion.div>

              {/* Floating complexity badge */}
              <motion.div
                className="absolute -top-4 -right-4 card-glass rounded-lg px-3 py-2 text-xs"
                animate={{ y: [0, -4, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
              >
                <span className="text-green-400 font-mono font-bold">
                  O(log n)
                </span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
