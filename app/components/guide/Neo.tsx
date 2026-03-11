"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { getNeoTip } from "@/lib/neoTips";

/**
 * Neo — A minimal contextual guide. A small collapsible dot
 * that shows one-line placement-focused tips. Users can dismiss
 * it permanently via the × button; it respects localStorage.
 */
export default function Neo() {
  const pathname = usePathname();
  const [tip, setTip] = useState("");
  const [show, setShow] = useState(false);
  const [permanentlyHidden, setPermanentlyHidden] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("neo-hidden") === "true";
    }
    return false;
  });

  const refreshTip = useCallback(() => {
    setTip(getNeoTip(pathname).text);
  }, [pathname]);

  // Refresh tip when path changes
  useEffect(() => {
    setTip(getNeoTip(pathname).text);
  }, [pathname]);

  // Auto-show tip after a delay, but only if not permanently hidden
  useEffect(() => {
    if (permanentlyHidden) return;
    const timer = setTimeout(() => setShow(true), 3000);
    return () => clearTimeout(timer);
  }, [pathname, permanentlyHidden]);

  // Auto-hide after 6 seconds
  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(() => setShow(false), 6000);
    return () => clearTimeout(timer);
  }, [show, tip]);

  const handleClick = () => {
    if (show) {
      setShow(false);
    } else {
      refreshTip();
      setShow(true);
    }
  };

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPermanentlyHidden(true);
    setShow(false);
    localStorage.setItem("neo-hidden", "true");
  };

  if (permanentlyHidden) return null;

  return (
    <div className="fixed bottom-4 right-4 z-40 flex items-end gap-2 lg:bottom-6 lg:right-6">
      {/* Tip bubble */}
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, x: 10, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="max-w-[220px] rounded-lg px-3 py-2 text-xs leading-relaxed relative"
            style={{
              background: "hsl(43 96% 56%, 0.06)",
              border: "1px solid hsl(43 96% 56%, 0.15)",
              color: "hsl(43 96% 56%, 0.8)",
              backdropFilter: "blur(12px)",
            }}
          >
            {tip}
            <button
              onClick={handleDismiss}
              className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-white/10 text-white/40 hover:text-white/80 hover:bg-white/20 text-[10px] flex items-center justify-center transition-colors"
              aria-label="Dismiss tips permanently"
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Glowing dot */}
      <button
        onClick={handleClick}
        aria-label="Toggle contextual tip"
        className="group relative flex h-2.5 w-2.5 items-center justify-center opacity-50 hover:opacity-100 transition-opacity"
      >
        <span
          className="relative h-1.5 w-1.5 rounded-full"
          style={{
            background: "hsl(43 96% 56%)",
            boxShadow: "0 0 4px hsl(43 96% 56%, 0.4)",
          }}
        />
      </button>
    </div>
  );
}
