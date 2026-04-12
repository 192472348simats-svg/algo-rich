"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!token || !email) {
      setError("Invalid or missing reset token.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token, password }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.error || "An error occurred");
      } else {
        setSuccess(true);
        setTimeout(() => {
          router.push("/signin");
        }, 3000);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
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
          Set New Password
        </h2>
        <p className="text-sm" style={{ color: "#6b7a99" }}>
          {email ? `For ${email}` : "Enter your new password below"}
        </p>
      </div>

      <AnimatePresence mode="wait">
        {error && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="rounded-lg px-4 py-3 text-sm mb-5"
            style={{ background: "#1a0505", border: "1px solid #ef444440", color: "#ef4444" }}>
            {error}
          </motion.div>
        )}
        {success && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="rounded-lg px-4 py-3 text-sm mb-5"
            style={{ background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.2)", color: "#34d399" }}>
            Password updated successfully! Redirecting to sign in...
          </motion.div>
        )}
      </AnimatePresence>

      {!success && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-1.5">New Password</label>
            <input
              type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              required placeholder="••••••••" minLength={8}
              className="w-full px-4 py-3 rounded-xl text-white placeholder-[#6b7a99] focus:outline-none transition-colors"
              style={{ background: "#0f1629", border: "1px solid #1E3A5F" }}
              onFocus={e => (e.currentTarget.style.borderColor = "#E5A829")}
              onBlur={e => (e.currentTarget.style.borderColor = "#1E3A5F")}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-1.5">Confirm New Password</label>
            <input
              type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
              required placeholder="••••••••" minLength={8}
              className="w-full px-4 py-3 rounded-xl text-white placeholder-[#6b7a99] focus:outline-none transition-colors"
              style={{ background: "#0f1629", border: "1px solid #1E3A5F" }}
              onFocus={e => (e.currentTarget.style.borderColor = "#E5A829")}
              onBlur={e => (e.currentTarget.style.borderColor = "#1E3A5F")}
            />
          </div>
          
          <button
            type="submit" disabled={loading || !token || !email}
            className="w-full py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-50 mt-2"
            style={{ background: "#E5A829", color: "#0a0f24" }}
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      )}

      <p className="text-center text-sm mt-6" style={{ color: "#6b7a99" }}>
        Back to{" "}
        <Link href="/signin" className="font-medium transition-colors hover:text-white" style={{ color: "#E5A829" }}>
          Sign in
        </Link>
      </p>
    </motion.div>
  );
}

export default function ResetPasswordPage() {
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
        <Suspense fallback={<div className="text-white/50">Loading...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
