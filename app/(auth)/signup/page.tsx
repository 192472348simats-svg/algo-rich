// REDESIGNED: Navy+gold theme, split layout matching signin
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

const PERKS = [
  { emoji: "🎯", text: "Structured path from Python basics to interview-ready" },
  { emoji: "🐍", text: "Run Python in your browser — zero setup, instant feedback" },
  { emoji: "⭐", text: "Zyra, your AI guide, helps when you're stuck" },
  { emoji: "🔥", text: "Streaks, XP, and spaced repetition keep you consistent" },
  { emoji: "🏆", text: "150+ problems across TCS, Zoho, Infosys patterns" },
];

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setLoading(false);
        return;
      }
      router.push(`/verify-email?email=${encodeURIComponent(email.trim().toLowerCase())}`);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: "#0a0f24" }}>
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-[420px] p-12 flex-shrink-0"
        style={{ borderRight: "1px solid #1E3A5F" }}>
        <div>
          <Link href="/">
            <div className="flex items-center gap-2 mb-12">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
                style={{ background: "#E5A829", color: "#0a0f24" }}>AR</div>
              <span className="text-base font-bold" style={{ color: "#E5A829" }}>Algo Rich</span>
            </div>
          </Link>

          <div className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-2" style={{ letterSpacing: "-0.02em" }}>
              90 days to placement-ready.
            </h2>
            <p className="text-sm" style={{ color: "#6b7a99" }}>
              Join students from SRM, VIT, Anna University and more.
            </p>
          </div>

          <div className="space-y-5">
            {PERKS.map((p, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-lg flex-shrink-0">{p.emoji}</span>
                <p className="text-sm leading-relaxed" style={{ color: "#6b7a99" }}>{p.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mini stat strip */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { val: "2,847+", label: "students" },
            { val: "150+", label: "problems" },
            { val: "34 days", label: "avg streak" },
            { val: "Free", label: "to start" },
          ].map((s, i) => (
            <div key={i} className="rounded-xl p-3 text-center" style={{ background: "#0f1629", border: "1px solid #1E3A5F" }}>
              <div className="text-base font-bold" style={{ color: "#E5A829" }}>{s.val}</div>
              <div className="text-xs mt-0.5" style={{ color: "#6b7a99" }}>{s.label}</div>
            </div>
          ))}
        </div>

        <p className="text-xs" style={{ color: "#6b7a99" }}>© 2026 Algo Rich</p>
      </div>

      {/* Right panel — scrollable on mobile */}
      <div className="flex-1 flex items-start lg:items-center justify-center p-8 py-12 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm"
        >
          <div className="mb-8">
            <Link href="/" className="lg:hidden flex items-center gap-2 mb-6">
              <div className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold"
                style={{ background: "#E5A829", color: "#0a0f24" }}>AR</div>
              <span className="text-sm font-bold" style={{ color: "#E5A829" }}>Algo Rich</span>
            </Link>
            <h2 className="text-2xl font-bold text-white mb-1" style={{ letterSpacing: "-0.02em" }}>
              Create your account
            </h2>
            <p className="text-sm" style={{ color: "#6b7a99" }}>Free forever — no credit card needed</p>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-xl px-4 py-3 text-sm mb-5"
              style={{ background: "#1a0505", border: "1px solid #ef444440", color: "#ef4444" }}>
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-1.5">Full name</label>
              <input
                type="text" value={name} onChange={e => setName(e.target.value)}
                required placeholder="Priya Sharma"
                className="w-full px-4 py-3 rounded-xl text-white placeholder-[#6b7a99] focus:outline-none transition-colors"
                style={{ background: "#0f1629", border: "1px solid #1E3A5F" }}
                onFocus={e => (e.currentTarget.style.borderColor = "#E5A829")}
                onBlur={e => (e.currentTarget.style.borderColor = "#1E3A5F")}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1.5">Email</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                required placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl text-white placeholder-[#6b7a99] focus:outline-none transition-colors"
                style={{ background: "#0f1629", border: "1px solid #1E3A5F" }}
                onFocus={e => (e.currentTarget.style.borderColor = "#E5A829")}
                onBlur={e => (e.currentTarget.style.borderColor = "#1E3A5F")}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1.5">Password</label>
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)}
                required minLength={8} placeholder="8+ chars, a number & symbol (e.g. Hello1!)"
                className="w-full px-4 py-3 rounded-xl text-white placeholder-[#6b7a99] focus:outline-none transition-colors"
                style={{ background: "#0f1629", border: "1px solid #1E3A5F" }}
                onFocus={e => (e.currentTarget.style.borderColor = "#E5A829")}
                onBlur={e => (e.currentTarget.style.borderColor = "#1E3A5F")}
              />
            </div>
            <button
              type="submit" disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-50 mt-2"
              style={{ background: "#E5A829", color: "#0a0f24" }}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creating account...
                </span>
              ) : "Create free account →"}
            </button>
          </form>

          <p className="text-center text-xs mt-4" style={{ color: "#6b7a99" }}>
            By signing up, you agree to our Terms and Privacy Policy.
          </p>

          <p className="text-center text-sm mt-5" style={{ color: "#6b7a99" }}>
            Already have an account?{" "}
            <Link href="/signin" className="font-medium hover:text-white transition-colors" style={{ color: "#E5A829" }}>
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
