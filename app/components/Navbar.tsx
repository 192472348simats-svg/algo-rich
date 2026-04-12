"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Curriculum", href: "#curriculum" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? "rgba(10,15,36,0.8)" : "rgba(10,15,26,0.55)",
          borderBottom: "1px solid rgba(79,157,255,0.2)",
          boxShadow: scrolled ? "0 12px 40px rgba(0,0,0,0.35)" : "0 10px 30px rgba(0,0,0,0.2)",
          backdropFilter: "blur(14px)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shadow-lg"
              style={{ background: "linear-gradient(135deg,#F5B841,#dba11f)", color: "#0a0f24", boxShadow: "0 0 20px rgba(245,184,65,0.35)" }}
            >
              AR
            </div>
            <span className="text-base font-bold logo-breathe" style={{ color: "#F5B841", letterSpacing: "0.04em" }}>
              Algo Rich
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="group relative text-sm font-medium text-white/70"
                style={{ color: "#9fb0d0" }}
              >
                <span className="relative z-10">{l.label}</span>
                <span
                  className="absolute left-0 -bottom-1 h-px w-full scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"
                  style={{ background: "linear-gradient(90deg,#4F9DFF,#F5B841)" }}
                />
              </a>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/signin">
              <button
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={{
                  color: "#c8d0e0",
                  border: "1px solid rgba(255,255,255,0.08)",
                  backdropFilter: "blur(6px)",
                }}
              >
                Sign in
              </button>
            </Link>
            <Link href="/signup">
              <button
                className="px-5 py-2.5 rounded-lg text-sm font-semibold transition-all hover:translate-y-[-2px]"
                style={{
                  background: "linear-gradient(135deg,#F5B841,#d69d1f)",
                  color: "#0B0F1A",
                  boxShadow: "0 8px 30px rgba(245,184,65,0.35)",
                }}
              >
                Start free →
              </button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg"
            style={{ color: "#c8d0e0" }}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="fixed top-16 left-0 right-0 z-40 md:hidden"
            style={{
              background: "#0a0f24",
              borderBottom: "1px solid #1E3A5F",
            }}
          >
            <div className="px-4 py-4 flex flex-col gap-1">
              {NAV_LINKS.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  className="px-4 py-3 rounded-lg text-sm"
                  style={{ color: "#c8d0e0" }}
                  onClick={() => setMobileOpen(false)}
                >
                  {l.label}
                </a>
              ))}
              <div className="border-t mt-2 pt-3 flex flex-col gap-2" style={{ borderColor: "#1E3A5F" }}>
                <Link href="/signin" onClick={() => setMobileOpen(false)}>
                  <button className="w-full py-3 rounded-lg text-sm font-medium" style={{ color: "#c8d0e0", border: "1px solid #1E3A5F" }}>
                    Sign in
                  </button>
                </Link>
                <Link href="/signup" onClick={() => setMobileOpen(false)}>
                  <button className="w-full py-3 rounded-lg text-sm font-semibold" style={{ background: "#E5A829", color: "#0a0f24" }}>
                    Start free →
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
