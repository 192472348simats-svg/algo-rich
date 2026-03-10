"use client";

import { motion } from "framer-motion";

interface EmptyStateProps {
  icon?: string;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  actionHref?: string;
}

/**
 * Friendly empty state with illustration, message, and optional CTA.
 * Use when a list is empty, no search results, no data yet, etc.
 */
export default function EmptyState({
  icon = "📭",
  title,
  message,
  actionLabel,
  onAction,
  actionHref,
}: EmptyStateProps) {
  const ActionTag = actionHref ? "a" : "button";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      {/* Floating icon */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="text-5xl mb-6"
      >
        {icon}
      </motion.div>

      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      {message && (
        <p className="text-sm text-gray-light/50 max-w-sm mb-6">{message}</p>
      )}

      {actionLabel && (onAction || actionHref) && (
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <ActionTag
            onClick={onAction}
            {...(actionHref ? { href: actionHref } : {})}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gold-primary/15 border border-gold-primary/30 text-gold-primary rounded-lg text-sm font-medium hover:bg-gold-primary/25 transition-all duration-200"
          >
            {actionLabel}
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
              />
            </svg>
          </ActionTag>
        </motion.div>
      )}
    </motion.div>
  );
}
