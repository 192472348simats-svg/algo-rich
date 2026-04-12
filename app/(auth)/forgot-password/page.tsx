"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.error || "An error occurred");
      } else {
        setMessage(data.message || "A password reset link has been sent to your email.");
        setEmail("");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: "#0a0f24" }}>
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-96 p-12 flex-shrink-0"
        style={{ borderRight: "1px solid #1E3A5F" }}>
        <Link href="/">
          <h1 className="text-xl font-bold" style={{ color: "#E5A829" }}>Algo Rich</h1>
        </Link>
        <div className="space-y-6">
          {[
            { emoji: "🔐", text: "Securely recover access to your account" },
            { emoji: "⚡", text: "Fast and easy password reset process" },
            { emoji: "🚀", text: "Get back to solving algorithms quickly" },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="text-lg flex-shrink-0">{item.emoji}</span>
              <p className="text-sm leading-relaxed" style={{ color: "#6b7a99" }}>{item.text}</p>
            </div>
          ))}
        </div>
        <p className="text-xs" style={{ color: "#6b7a99" }}>© 2026 Algo Rich</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm"
        >
          <div className="mb-8">
            <Link href="/" className="lg:hidden text-lg font-bold mb-6 block" style={{ color: "#E5A829" }}>
              Algo Rich
            </Link>
            <h2 className="text-2xl font-bold text-white mb-1" style={{ letterSpacing: "-0.02em" }}>
              Reset Password
            </h2>
            <p className="text-sm" style={{ color: "#6b7a99" }}>Enter your email to receive a reset link</p>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="rounded-lg px-4 py-3 text-sm mb-5"
                style={{ background: "#1a0505", border: "1px solid #ef444440", color: "#ef4444" }}>
                {error}
              </motion.div>
            )}
            {message && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="rounded-lg px-4 py-3 text-sm mb-5"
                style={{ background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.2)", color: "#34d399" }}>
                {message}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-1.5">Email</label>
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                required placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl text-white placeholder-[#6b7a99] focus:outline-none transition-colors"
                style={{ background: "#0f1629", border: "1px solid #1E3A5F" }}
                onFocus={e => (e.currentTarget.style.borderColor = "#E5A829")}
                onBlur={e => (e.currentTarget.style.borderColor = "#1E3A5F")}
              />
            </div>
            
            <button
              type="submit" disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-50 mt-2"
              style={{ background: "#E5A829", color: "#0a0f24" }}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: "#6b7a99" }}>
            Remembered your password?{" "}
            <Link href="/signin" className="font-medium transition-colors hover:text-white" style={{ color: "#E5A829" }}>
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
