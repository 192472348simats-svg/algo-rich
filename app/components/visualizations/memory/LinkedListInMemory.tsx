"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo, useCallback } from "react";

interface NodeData {
  value: number | string;
  id: string;
}

interface LinkedListInMemoryProps {
  nodes: NodeData[];
  highlightNode?: number;
  showTraversal?: boolean;
  operation?: "traverse" | "insert" | "delete";
  showMemoryMap?: boolean;
  showLogicalView?: boolean;
  className?: string;
}

interface MemoryNode {
  value: number | string;
  address: string;
  nextAddress: string | null;
  id: string;
}

type Scene = {
  id: string;
  title: string;
  description: string;
  guideMessage: string;
};

const SCENES: Scene[] = [
  {
    id: "logical",
    title: "The Logical View",
    description:
      "A linked list looks like a neat chain of nodes connected by arrows. This is how we draw it on paper.",
    guideMessage: "This is how we THINK about it — a tidy chain!",
  },
  {
    id: "physical",
    title: "The Physical Reality",
    description:
      "In actual memory, nodes are scattered everywhere! They're connected only because each node stores the ADDRESS of the next one.",
    guideMessage:
      "Nodes can live ANYWHERE in memory. Pointers are the glue!",
  },
  {
    id: "traversal",
    title: "Following the Chain",
    description:
      "To find an element, we start at the head and follow pointers one by one. Each hop reads one address and jumps there — that's why access is O(n).",
    guideMessage:
      "We have to follow the chain — no shortcuts! That's O(n) access.",
  },
  {
    id: "insertion",
    title: "Why O(1) Insertion?",
    description:
      "To insert, we just allocate a new node anywhere, point it to the next node, and update the previous node's pointer. No shifting needed!",
    guideMessage:
      "Just redirect some pointers — 3 steps, done! O(1) insertion!",
  },
];

// Generate scattered addresses for realism
function generateAddresses(count: number): string[] {
  const addresses: string[] = [];
  const pool = [0x1000, 0x2050, 0x1500, 0x3000, 0x18a0, 0x2f40, 0x0c80, 0x3500];
  for (let i = 0; i < count; i++) {
    addresses.push(
      "0x" +
        (pool[i % pool.length] + (i >= pool.length ? i * 0x100 : 0))
          .toString(16)
          .toUpperCase()
          .padStart(4, "0")
    );
  }
  return addresses;
}

export default function LinkedListInMemory({
  nodes,
  highlightNode,
  showTraversal = false,
  operation = "traverse",
  showMemoryMap: _showMemoryMap = true,
  showLogicalView: _showLogicalView = true,
  className = "",
}: LinkedListInMemoryProps) {
  const [currentScene, setCurrentScene] = useState(0);
  const [traversalStep, setTraversalStep] = useState(-1);
  const [isAnimating, setIsAnimating] = useState(false);

  const addresses = useMemo(() => generateAddresses(nodes.length), [nodes.length]);

  const memoryNodes: MemoryNode[] = useMemo(
    () =>
      nodes.map((n, i) => ({
        value: n.value,
        address: addresses[i],
        nextAddress: i < nodes.length - 1 ? addresses[i + 1] : null,
        id: n.id,
      })),
    [nodes, addresses]
  );

  // Sorted by address for scattered memory view
  const sortedByAddress = useMemo(
    () => [...memoryNodes].sort((a, b) => a.address.localeCompare(b.address)),
    [memoryNodes]
  );

  const scene = SCENES[currentScene];

  const animateTraversal = useCallback(async () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTraversalStep(-1);
    for (let i = 0; i < memoryNodes.length; i++) {
      setTraversalStep(i);
      await new Promise((r) => setTimeout(r, 1000));
    }
    setIsAnimating(false);
  }, [isAnimating, memoryNodes]);

  const animateInsertion = useCallback(async () => {
    if (isAnimating) return;
    setIsAnimating(true);
    // Animate insertion steps
    setTraversalStep(0); // Show "allocate"
    await new Promise((r) => setTimeout(r, 1200));
    setTraversalStep(1); // Show "point new→next"
    await new Promise((r) => setTimeout(r, 1200));
    setTraversalStep(2); // Show "update prev→new"
    await new Promise((r) => setTimeout(r, 1200));
    setTraversalStep(-1);
    setIsAnimating(false);
  }, [isAnimating]);

  return (
    <div
      className={`relative p-6 rounded-2xl bg-background/80/50 backdrop-blur-xl border border-white/10 ${className}`}
    >
      {/* Header */}
      <h3 className="text-lg font-semibold text-white mb-2">
        Linked List in Memory
      </h3>

      {/* Scene tabs */}
      <div className="flex gap-1 mb-4 flex-wrap">
        {SCENES.map((s, i) => (
          <button
            key={s.id}
            onClick={() => {
              setCurrentScene(i);
              setTraversalStep(-1);
            }}
            className={`px-3 py-1 text-xs rounded-full transition-colors ${
              i === currentScene
                ? "bg-primary/20 text-primary border border-primary/30"
                : "bg-white/5 text-white/40 hover:text-white/60"
            }`}
          >
            {s.title}
          </button>
        ))}
      </div>

      {/* Description */}
      <AnimatePresence mode="wait">
        <motion.p
          key={currentScene}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="text-sm text-white/60 mb-6 leading-relaxed"
        >
          {scene.description}
        </motion.p>
      </AnimatePresence>

      {/* === Scene 0: Logical view === */}
      {currentScene === 0 && (
        <div className="flex items-center gap-2 py-4 overflow-x-auto">
          <span className="text-xs font-mono text-primary mr-1">HEAD →</span>
          {memoryNodes.map((node, i) => (
            <div key={node.id} className="flex items-center gap-2">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className={`
                  flex items-center justify-center w-14 h-14 rounded-lg
                  font-mono text-lg border
                  ${
                    highlightNode === i
                      ? "bg-primary/20 border-primary/50 text-white shadow-[0_0_20px_rgba(212,175,55,0.3)]"
                      : "bg-white/5 border-white/10 text-white/80"
                  }
                `}
              >
                {node.value}
              </motion.div>
              {i < memoryNodes.length - 1 ? (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.1 + 0.05 }}
                  className="text-primary text-lg"
                >
                  →
                </motion.span>
              ) : (
                <span className="text-xs font-mono text-white/30 ml-1">
                  null
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* === Scene 1: Scattered memory === */}
      {currentScene === 1 && (
        <div className="space-y-1">
          <div className="grid grid-cols-[auto_1fr_auto_auto] gap-x-4 gap-y-0.5 text-xs font-mono px-2 py-1 text-white/30 border-b border-white/[0.06]">
            <span>Address</span>
            <span>Value</span>
            <span>Next Ptr</span>
            <span></span>
          </div>
          {sortedByAddress.map((node) => {
            const originalIdx = memoryNodes.findIndex((n) => n.id === node.id);
            const isNode = true;
            // Add some "empty" rows between nodes
            return (
              <motion.div
                key={node.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: originalIdx * 0.12 }}
                className={`grid grid-cols-[auto_1fr_auto_auto] gap-x-4 items-center p-2 rounded-lg border ${
                  highlightNode === originalIdx
                    ? "bg-primary/15 border-primary/40"
                    : "bg-white/[0.03] border-white/[0.06]"
                }`}
              >
                <span className="text-primary font-mono text-xs w-16">
                  {node.address}
                </span>
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1 rounded bg-card border border-white/10">
                    <span className="text-white font-mono">{node.value}</span>
                  </div>
                  <span className="text-white/20">|</span>
                  <div className="px-2 py-1 rounded bg-primary/10 border border-primary/20">
                    <span className="text-primary font-mono text-xs">
                      {node.nextAddress ?? "null"}
                    </span>
                  </div>
                </div>
                <span className="text-white/30 text-xs">
                  Node {originalIdx + 1}
                </span>
                {originalIdx === 0 && (
                  <span className="text-xs text-primary">← HEAD</span>
                )}
              </motion.div>
            );
          })}

          {/* Explanation */}
          <div className="mt-4 p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
            <p className="text-xs text-white/50">
              Notice: nodes are <span className="text-primary">NOT contiguous</span>
              . They live at scattered addresses, connected only by pointers.
            </p>
          </div>
        </div>
      )}

      {/* === Scene 2: Traversal animation === */}
      {currentScene === 2 && (
        <div className="space-y-4">
          <button
            onClick={animateTraversal}
            disabled={isAnimating}
            className="px-4 py-1.5 text-xs rounded bg-primary/20 text-primary hover:bg-primary/30 disabled:opacity-40 transition-colors"
          >
            {isAnimating ? "Traversing…" : "▶ Start Traversal"}
          </button>

          <div className="space-y-1">
            {memoryNodes.map((node, i) => {
              const isVisited = traversalStep >= i;
              const isCurrent = traversalStep === i;
              return (
                <motion.div
                  key={node.id}
                  animate={{
                    borderColor: isCurrent
                      ? "rgba(212,175,55,0.6)"
                      : isVisited
                      ? "hsl(43 96% 56%,0.3)"
                      : "rgba(255,255,255,0.06)",
                    backgroundColor: isCurrent
                      ? "rgba(212,175,55,0.1)"
                      : isVisited
                      ? "hsl(43 96% 56%,0.05)"
                      : "rgba(255,255,255,0.02)",
                  }}
                  className="flex items-center gap-3 p-2.5 rounded-lg border"
                >
                  <span className="text-primary font-mono text-xs w-16">
                    {node.address}
                  </span>

                  {/* Value + next */}
                  <div className="flex items-center gap-2 flex-1">
                    <span className="font-mono text-white">{node.value}</span>
                    <span className="text-white/20">→</span>
                    <span className="text-primary font-mono text-xs">
                      {node.nextAddress ?? "null"}
                    </span>
                  </div>

                  {/* Step indicator */}
                  {isCurrent && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center gap-1"
                    >
                      <span className="text-xs text-primary font-semibold">
                        ← Reading
                      </span>
                    </motion.div>
                  )}
                  {isVisited && !isCurrent && (
                    <span className="text-xs text-emerald-400">✓</span>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Step explanation */}
          <AnimatePresence>
            {traversalStep >= 0 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="p-3 rounded-lg bg-primary/10 border border-primary/30"
              >
                <p className="text-xs font-mono text-primary">
                  Step {traversalStep + 1}: At{" "}
                  <span className="text-white">
                    {memoryNodes[traversalStep].address}
                  </span>
                  {" → Read value "}
                  <span className="text-primary">
                    {memoryNodes[traversalStep].value}
                  </span>
                  {memoryNodes[traversalStep].nextAddress
                    ? ` → Follow pointer to ${memoryNodes[traversalStep].nextAddress}`
                    : " → next is null, STOP"}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {!isAnimating && traversalStep >= memoryNodes.length - 1 && (
            <div className="p-3 rounded-lg bg-[var(--warning)]/10 border border-[var(--warning)]/30">
              <p className="text-xs text-[var(--warning)]">
                Total hops: {memoryNodes.length} → O(n) to reach the last node
              </p>
            </div>
          )}
        </div>
      )}

      {/* === Scene 3: Insertion === */}
      {currentScene === 3 && (
        <div className="space-y-4">
          <button
            onClick={animateInsertion}
            disabled={isAnimating}
            className="px-4 py-1.5 text-xs rounded bg-primary/20 text-primary hover:bg-primary/30 disabled:opacity-40 transition-colors"
          >
            {isAnimating ? "Inserting…" : "▶ Insert After Node 2"}
          </button>

          <div className="space-y-3">
            {[
              { step: 0, label: "1. Allocate new node anywhere in memory", color: "text-primary" },
              { step: 1, label: "2. Set new node's 'next' → Node 3's address", color: "text-primary" },
              { step: 2, label: "3. Update Node 2's 'next' → new node's address", color: "text-emerald-400" },
            ].map(({ step, label, color }) => (
              <motion.div
                key={step}
                animate={{
                  opacity: traversalStep >= step ? 1 : 0.3,
                  scale: traversalStep === step ? 1.02 : 1,
                }}
                className={`p-3 rounded-lg border ${
                  traversalStep === step
                    ? "bg-primary/10 border-primary/30"
                    : "bg-white/[0.02] border-white/[0.06]"
                }`}
              >
                <p className={`text-sm font-mono ${color}`}>{label}</p>
              </motion.div>
            ))}
          </div>

          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
            <p className="text-xs text-emerald-400">
              Total pointer changes: 2-3 → <strong>O(1)</strong> (if we have a reference to the insertion point)
            </p>
            <p className="text-xs text-white/40 mt-1">
              No elements need to shift! Compare this to array insertion which is O(n).
            </p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between items-center mt-6 pt-4 border-t border-white/[0.06]">
        <button
          onClick={() => { setCurrentScene((s) => Math.max(0, s - 1)); setTraversalStep(-1); }}
          disabled={currentScene === 0}
          className="px-3 py-1.5 text-sm rounded bg-white/5 text-white/60 hover:bg-white/10 disabled:opacity-30 transition-colors"
        >
          ← Previous
        </button>
        <div className="flex gap-1">
          {SCENES.map((_, i) => (
            <div key={i} className={`w-2 h-2 rounded-full ${i === currentScene ? "bg-primary" : "bg-white/20"}`} />
          ))}
        </div>
        <button
          onClick={() => { setCurrentScene((s) => Math.min(SCENES.length - 1, s + 1)); setTraversalStep(-1); }}
          disabled={currentScene === SCENES.length - 1}
          className="px-3 py-1.5 text-sm rounded bg-primary/20 text-primary hover:bg-primary/30 disabled:opacity-30 transition-colors"
        >
          Next →
        </button>
      </div>

    </div>
  );
}
