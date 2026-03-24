"use client";

import { motion } from "framer-motion";
import type { HookConfig } from "@/lib/sessionDefinitions";
import type { StageResult } from "@/app/dashboard/session/[sessionSlug]/SessionPlayer";

interface Props {
  config: HookConfig;
  onComplete: (result: StageResult) => void;
}

export default function HookStage({ config, onComplete }: Props) {
  return (
    <div className="flex flex-col items-center justify-center text-center min-h-[60vh]">
      {config.backgroundEmoji && (
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="text-6xl mb-8"
        >
          {config.backgroundEmoji}
        </motion.div>
      )}

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-2xl md:text-3xl font-bold text-white max-w-xl leading-snug mb-4 whitespace-pre-line"
      >
        {config.headline}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-base text-white/40 max-w-md leading-relaxed mb-10"
      >
        {config.subtext}
      </motion.p>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        onClick={() => onComplete({ score: 0, timeSpent: 0 })}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="rounded-xl px-8 py-3 text-sm font-semibold transition-all hover:opacity-90"
          style={{ background: '#E5A829', color: '#0a0f24' }} cursor-pointer"
      >
        Let&apos;s go →
      </motion.button>
    </div>
  );
}
