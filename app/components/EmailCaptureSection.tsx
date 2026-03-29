// NEW: Email capture strip for bounce recovery
"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function EmailCaptureSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  return (
    <section className="py-16 px-4 md:px-8">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="rounded-2xl p-8 text-center"
          style={{ background: "#0f1629", border: "1px solid #E5A82930" }}
        >
          {!submitted ? (
            <>
              <div className="text-3xl mb-3">📬</div>
              <h3 className="text-xl font-bold text-white mb-2">Get the free 90-day DSA roadmap</h3>
              <p className="text-sm mb-6" style={{ color: "#6b7a99" }}>
                We&apos;ll send you a week-by-week plan to go from basics to placement-ready — no spam, unsubscribe anytime.
              </p>
              <form onSubmit={handleSubmit} className="flex gap-3 max-w-sm mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm text-white placeholder-[#6b7a99] focus:outline-none"
                  style={{ background: "#0a0f24", border: "1px solid #1E3A5F" }}
                  onFocus={e => (e.currentTarget.style.borderColor = "#E5A829")}
                  onBlur={e => (e.currentTarget.style.borderColor = "#1E3A5F")}
                />
                <button type="submit" className="px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap hover:opacity-90"
                  style={{ background: "#E5A829", color: "#0a0f24" }}>
                  Send it →
                </button>
              </form>
            </>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <div className="text-3xl mb-3">✅</div>
              <h3 className="text-xl font-bold text-white mb-1">Roadmap on its way!</h3>
              <p className="text-sm" style={{ color: "#6b7a99" }}>
                Check your inbox. While you wait —{" "}
                <a href="/signup" style={{ color: "#E5A829" }}>start your first session</a>.
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
