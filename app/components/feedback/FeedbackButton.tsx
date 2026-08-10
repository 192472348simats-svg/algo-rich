"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { analytics } from "@/lib/analytics";

const feedbackTypes = [
  { value: "bug", label: "🐛 Bug" },
  { value: "feature", label: "💡 Feature" },
  { value: "praise", label: "🙏 Praise" },
  { value: "other", label: "💬 Other" },
];

export default function FeedbackButton() {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("bug");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;
    setSending(true);
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          message: message.trim(),
          page: window.location.pathname,
        }),
      });
      if (!response.ok) throw new Error("Failed to submit feedback");
      analytics.track("feedback_submitted", { feedback_type: type });
      setSent(true);
      setTimeout(() => {
        setOpen(false);
        setSent(false);
        setMessage("");
      }, 1500);
    } catch {
      // silent
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={() => setOpen(true)}
        className="fixed bottom-20 lg:bottom-6 right-4 z-50 w-11 h-11 rounded-full bg-primary text-background font-bold text-lg shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        title="Send Feedback"
      >
        💬
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-4"
            >
              <div className="card-glass rounded-2xl p-6">
                {sent ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-3">🎉</div>
                    <p className="text-white font-semibold">
                      Thanks for your feedback!
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <h3 className="text-lg font-bold text-white mb-4">
                      Send Feedback
                    </h3>

                    {/* Type selector */}
                    <div className="flex gap-2 mb-4">
                      {feedbackTypes.map((ft) => (
                        <button
                          key={ft.value}
                          type="button"
                          onClick={() => setType(ft.value)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                            type === ft.value
                              ? "border-primary bg-primary/15 text-primary"
                              : "border-white/10 text-white/50 hover:border-white/20"
                          }`}
                        >
                          {ft.label}
                        </button>
                      ))}
                    </div>

                    {/* Message */}
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us what's on your mind..."
                      rows={4}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary/50 resize-none"
                    />

                    {/* Actions */}
                    <div className="flex justify-end gap-3 mt-4">
                      <button
                        type="button"
                        onClick={() => setOpen(false)}
                        className="px-4 py-2 text-sm text-white/50 hover:text-white transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={!message.trim() || sending}
                        className="btn-primary px-5 py-2 rounded-lg text-sm font-semibold disabled:opacity-40"
                      >
                        {sending ? "Sending..." : "Send"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
