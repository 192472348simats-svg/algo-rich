"use client";

import { FormEvent, Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState(searchParams.get("email") ?? "");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Could not verify email");
        return;
      }
      router.push("/signin");
    } catch {
      setError("Could not verify email. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function resendCode() {
    setError("");
    setResendMessage("");
    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Could not resend the code.");
        return;
      }
      setResendMessage(data.message);
    } catch {
      setError("Could not resend the code. Please try again.");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0a0f24] px-6">
      <form onSubmit={submit} className="w-full max-w-sm space-y-5 rounded-2xl border border-[#1E3A5F] bg-[#0f1629] p-7">
        <div>
          <Link href="/" className="text-lg font-bold text-[#E5A829]">Algo Rich</Link>
          <h1 className="mt-6 text-2xl font-bold text-white">Verify your email</h1>
          <p className="mt-2 text-sm text-[#6b7a99]">Enter the six-digit code we sent you.</p>
        </div>
        {error && <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p>}
        {resendMessage && <p className="rounded-lg bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">{resendMessage}</p>}
        <input aria-label="Email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-xl border border-[#1E3A5F] bg-[#0a0f24] px-4 py-3 text-white" placeholder="you@example.com" />
        <input aria-label="Verification code" inputMode="numeric" pattern="[0-9]{6}" maxLength={6} required value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, ""))} className="w-full rounded-xl border border-[#1E3A5F] bg-[#0a0f24] px-4 py-3 text-center font-mono tracking-[0.45em] text-white" placeholder="123456" />
        <button disabled={loading} className="w-full rounded-xl bg-[#E5A829] py-3 font-semibold text-[#0a0f24] disabled:opacity-50">{loading ? "Verifying..." : "Verify email"}</button>
        <button type="button" onClick={resendCode} disabled={!email || loading} className="w-full text-sm text-[#E5A829] disabled:opacity-50">Resend code</button>
        <p className="text-center text-sm text-[#6b7a99]">Already verified? <Link href="/signin" className="text-[#E5A829]">Sign in</Link></p>
      </form>
    </main>
  );
}

export default function VerifyEmailPage() {
  return <Suspense fallback={<main className="min-h-screen bg-[#0a0f24]" />}><VerifyEmailForm /></Suspense>;
}
