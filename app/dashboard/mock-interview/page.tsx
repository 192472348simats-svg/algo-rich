"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export const dynamic = 'force-dynamic'


export default function MockInterviewPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Link href="/dashboard" className="text-sm text-white/40 hover:text-white/70 transition-colors">
            ← Dashboard
          </Link>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl mx-auto bg-white/[0.04] border border-white/10 rounded-2xl p-10 text-center mt-12"
      >
        <div className="text-5xl mb-6">🎯</div>
        <span className="text-xs font-semibold bg-[#E5A829]/10 text-[#E5A829] border border-[#E5A829]/20 px-3 py-1 rounded-full uppercase tracking-wider mb-4 inline-block">
          Coming in Phase 3
        </span>
        <h1 className="text-2xl font-bold text-white mb-3">Mock Interview Mode</h1>
        <p className="text-white/60 text-sm leading-relaxed max-w-sm mx-auto mb-8">
          Timed interview simulation with company-specific question sets.
        </p>

        <div className="flex bg-white/[0.02] border border-white/5 rounded-xl p-4 text-left items-start gap-4">
          <div className="text-2xl">⏳</div>
          <div>
            <h3 className="text-sm font-semibold text-white mb-1">What to expect</h3>
            <ul className="text-xs text-white/50 space-y-1">
              <li>• Real-time code execution</li>
              <li>• Strict time limits (30 - 45 mins)</li>
              <li>• Company tags (Google, Meta, Apple)</li>
              <li>• Blind problem pools</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
