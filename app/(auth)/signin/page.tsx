// REDESIGNED: Navy+gold theme, clean minimal signin
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await signIn("credentials", { email, password, redirect: false });
      if (result?.error) {
        if (result.error.includes("EMAIL_NOT_VERIFIED")) {
          setError("Please verify your email before signing in.");
        } else if (result.error.includes("Too many login")) {
          setError("Too many attempts. Please wait 5 minutes and try again.");
        } else {
          setError("Invalid email or password. Check your credentials and try again.");
        }
      } else if (result?.ok) {
        router.push("/dashboard");
        router.refresh();
      } else {
        setError("Sign in failed. Please try again.");
      }
    } catch {
      setError("Cannot connect to server. Make sure the app is running.");
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
            { emoji: "🎯", text: "150+ DSA problems with guided walkthroughs" },
            { emoji: "🐍", text: "Run Python in your browser — zero setup" },
            { emoji: "📈", text: "Track your progress from basics to interviews" },
            { emoji: "⭐", text: "XP, streaks, and spaced repetition built in" },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="text-lg flex-shrink-0">{item.emoji}</span>
              <p className="text-sm leading-relaxed" style={{ color: "#6b7a99" }}>{item.text}</p>
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
            <Link href="/" className="lg:hidden text-lg font-bold mb-6 block" style={{ color: "#E5A829" }}>
              Algo Rich
            </Link>
            <h2 className="text-2xl font-bold text-white mb-1" style={{ letterSpacing: "-0.02em" }}>
              Welcome back
            </h2>
            <p className="text-sm" style={{ color: "#6b7a99" }}>Sign in to continue learning</p>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-lg px-4 py-3 text-sm mb-5"
              style={{ background: "#1a0505", border: "1px solid #ef444440", color: "#ef4444" }}>
              {error}
            </motion.div>
          )}

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
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-medium text-white">Password</label>
                <Link href="/forgot-password" className="text-xs transition-colors hover:text-white" style={{ color: "#E5A829" }}>
                  Forgot password?
                </Link>
              </div>
              <input
                type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                required placeholder="••••••••"
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
              {loading ? "Signing in..." : "Sign in →"}
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: "#6b7a99" }}>
            No account?{" "}
            <Link href="/signup" className="font-medium transition-colors hover:text-white" style={{ color: "#E5A829" }}>
              Create one free
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
