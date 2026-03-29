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
          background: scrolled ? "rgba(10,15,36,0.97)" : "transparent",
          borderBottom: scrolled ? "1px solid #1E3A5F" : "1px solid transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
              style={{ background: "#E5A829", color: "#0a0f24" }}
            >
              AR
            </div>
            <span className="text-base font-bold" style={{ color: "#E5A829" }}>
              Algo Rich
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="text-sm transition-colors hover:text-white"
                style={{ color: "#6b7a99" }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.color = "#fff")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.color = "#6b7a99")
                }
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/signin">
              <button
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{ color: "#c8d0e0" }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.color = "#fff")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.color = "#c8d0e0")
                }
              >
                Sign in
              </button>
            </Link>
            <Link href="/signup">
              <button
                className="px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:opacity-90"
                style={{ background: "#E5A829", color: "#0a0f24" }}
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
