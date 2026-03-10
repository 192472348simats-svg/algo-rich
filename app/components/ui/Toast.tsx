"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { motion, AnimatePresence } from "framer-motion";

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  addToast: (message: string, type?: ToastType) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
  warning: (message: string) => void;
}

const ToastContext = createContext<ToastContextType>({
  addToast: () => {},
  success: () => {},
  error: () => {},
  info: () => {},
  warning: () => {},
});

export const useToast = () => useContext(ToastContext);

const typeStyles: Record<ToastType, string> = {
  success:
    "bg-gradient-to-r from-emerald-500/20 to-emerald-600/10 border-emerald-500/30 text-emerald-300",
  error:
    "bg-gradient-to-r from-red-500/20 to-red-600/10 border-red-500/30 text-red-300",
  info:
    "bg-gradient-to-r from-cyan-500/20 to-cyan-600/10 border-primary/30 text-primary",
  warning:
    "bg-gradient-to-r from-yellow-500/20 to-yellow-600/10 border-yellow-500/30 text-yellow-300",
};

const typeIcons: Record<ToastType, string> = {
  success: "✓",
  error: "✕",
  info: "ℹ",
  warning: "⚠",
};

const iconBg: Record<ToastType, string> = {
  success: "bg-emerald-500/20 text-emerald-400",
  error: "bg-red-500/20 text-red-400",
  info: "bg-primary/20 text-primary",
  warning: "bg-yellow-500/20 text-yellow-400",
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).slice(2, 8);
    setToasts((t) => [...t.slice(-4), { id, message, type }]);
    setTimeout(() => {
      setToasts((t) => t.filter((toast) => toast.id !== id));
    }, 4000);
  }, []);

  const value: ToastContextType = {
    addToast,
    success: (m) => addToast(m, "success"),
    error: (m) => addToast(m, "error"),
    info: (m) => addToast(m, "info"),
    warning: (m) => addToast(m, "warning"),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}

      {/* Toast container */}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md text-sm font-medium shadow-lg max-w-sm ${typeStyles[toast.type]}`}
            >
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${iconBg[toast.type]}`}
              >
                {typeIcons[toast.type]}
              </span>
              <span className="text-white flex-1">{toast.message}</span>
              <button
                onClick={() =>
                  setToasts((t) => t.filter((x) => x.id !== toast.id))
                }
                className="ml-auto text-white/40 hover:text-white/80 transition-colors"
                aria-label="Dismiss"
              >
                ×
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
