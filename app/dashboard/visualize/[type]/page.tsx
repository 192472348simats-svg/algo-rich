"use client";

export const dynamic = 'force-dynamic'

import { use, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import nextDynamic from "next/dynamic";
import { ErrorBoundary } from "@/app/components/ErrorBoundary";

const GuidedMode = nextDynamic(
  () => import("@/app/components/visualizations/GuidedMode"),
  { ssr: false }
);

/* Dynamic imports to avoid SSR issues with SVG / canvas code */
const TreePlayground = nextDynamic(
  () => import("@/app/components/visualizations/interactive/TreePlayground"),
  { ssr: false, loading: () => <Skeleton /> }
);
const ArrayPlayground = nextDynamic(
  () => import("@/app/components/visualizations/interactive/ArrayPlayground"),
  { ssr: false, loading: () => <Skeleton /> }
);
const LinkedListPlayground = nextDynamic(
  () =>
    import(
      "@/app/components/visualizations/interactive/LinkedListPlayground"
    ),
  { ssr: false, loading: () => <Skeleton /> }
);
const StackQueuePlayground = nextDynamic(
  () =>
    import(
      "@/app/components/visualizations/interactive/StackQueuePlayground"
    ),
  { ssr: false, loading: () => <Skeleton /> }
);
const TreePredictionChallenge = nextDynamic(
  () => import("@/app/components/learning/TreePredictionChallenge"),
  { ssr: false, loading: () => <Skeleton /> }
);

/* ── meta lookup ──────────────────────────── */
const meta: Record<
  string,
  { title: string; icon: string; desc: string }
> = {
  tree: {
    title: "Binary Search Tree",
    icon: "🌳",
    desc: "Insert, delete, search and traverse a BST with step-by-step animation.",
  },
  array: {
    title: "Array & Sorting",
    icon: "📊",
    desc: "Visualize array operations and classic sorting algorithms.",
  },
  "linked-list": {
    title: "Linked List",
    icon: "🔗",
    desc: "Insert, delete, search, and reverse a singly linked list.",
  },
  "stack-queue": {
    title: "Stack & Queue",
    icon: "📚",
    desc: "Push/pop, enqueue/dequeue, and balanced-parentheses challenge.",
  },
};

/* ── page component ───────────────────────── */
export default function VisualizeTypePage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = use(params);
  const searchParams = useSearchParams();
  const showChallenges = searchParams.get("tab") === "challenges" && type === "tree";
  const [tab, setTab] = useState<"playground" | "challenges">(
    showChallenges ? "challenges" : "playground"
  );

  const [guidedOpen, setGuidedOpen] = useState(false);

  const guidedTypeMap: Record<string, "tree" | "array" | "stack" | "linked-list"> = {
    tree: "tree",
    array: "array",
    "linked-list": "linked-list",
    "stack-queue": "stack",
  };

  const info = meta[type];

  if (!info) {
    return (
      <div className="max-w-3xl mx-auto text-center py-20">
        <p className="text-lg text-muted-foreground">
          Unknown visualizer type: <code>{type}</code>
        </p>
        <Link
          href="/dashboard/visualize"
          className="text-sm text-primary hover:underline mt-4 inline-block"
        >
          ← Back to visualizers
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground/70 mb-4">
        <Link
          href="/dashboard/visualize"
          className="hover:text-foreground/70 transition-colors"
        >
          Visualizers
        </Link>
        <span>/</span>
        <span className="text-foreground/70">{info.title}</span>
      </div>

      {/* header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{info.icon}</span>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {info.title}
            </h1>
            <p className="text-sm text-muted-foreground">{info.desc}</p>
          </div>
        </div>
        <button
          onClick={() => setGuidedOpen((o) => !o)}
          className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-colors`}
          style={guidedOpen
            ? { background: '#1a1400', border: '1px solid #E5A82950', color: '#E5A829' }
            : { borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }
          }
        >
          {guidedOpen ? "✕ Close Guide" : "🎓 Guided Mode"}
        </button>
      </div>

      {/* tree: tab toggle */}
      {type === "tree" && (
        <div className="flex gap-1 bg-white/5 rounded-lg p-1 w-fit mt-4 mb-4">
          {(
            [
              { key: "playground", label: "Playground" },
              { key: "challenges", label: "🧠 Challenges" },
            ] as const
          ).map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                tab === t.key
                  ? "bg-primary text-background"
                  : "text-white/60 hover:text-white"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      {/* content */}
      <ErrorBoundary componentName="Visualizer Playground">
        <motion.div
          key={`${type}-${tab}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mt-4"
        >
          {type === "tree" && tab === "playground" && <TreePlayground />}
          {type === "tree" && tab === "challenges" && (
            <TreePredictionChallenge />
          )}
          {type === "array" && <ArrayPlayground />}
          {type === "linked-list" && <LinkedListPlayground />}
          {type === "stack-queue" && <StackQueuePlayground />}
        </motion.div>
      </ErrorBoundary>

      {/* Guided Mode overlay */}
      <AnimatePresence>
        {guidedOpen && guidedTypeMap[type] && (
          <ErrorBoundary componentName="GuidedMode">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="mt-6"
            >
              <GuidedMode
                visualizerType={guidedTypeMap[type]}
                onClose={() => setGuidedOpen(false)}
              />
            </motion.div>
          </ErrorBoundary>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Loading skeleton ─────────────────────── */
function Skeleton() {
  return (
    <div className="animate-pulse rounded-xl bg-white/5 border border-white/10 h-[300px] flex items-center justify-center">
      <span className="text-white/20 text-sm">Loading visualizer…</span>
    </div>
  );
}
