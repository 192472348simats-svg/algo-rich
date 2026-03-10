"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo, useCallback } from "react";

type CollisionStrategy = "chaining" | "open_addressing";
type Operation = "insert" | "lookup" | "delete";

interface HashMapInMemoryProps {
  entries?: [string, number][];
  bucketCount?: number;
  showHashCalculation?: boolean;
  collisionStrategy?: CollisionStrategy;
  highlightKey?: string;
  operation?: Operation;
  className?: string;
}

interface BucketEntry {
  key: string;
  value: number;
  hash: number;
}

interface Scene {
  id: string;
  title: string;
  description: string;
  guideMessage: string;
  guideState: string;
}

const SCENES: Scene[] = [
  {
    id: "problem",
    title: "The Problem",
    description:
      'We want to store key-value pairs (like a dictionary). How do we find "banana" quickly without checking every item?',
    guideMessage: "Searching every item is O(n)... there must be a faster way!",
    guideState: "thinking",
  },
  {
    id: "hash",
    title: "The Hash Function",
    description:
      "A hash function converts any key into a number. We then use modulo (%) to map it to a bucket index. Different keys usually land in different buckets.",
    guideMessage:
      "The hash function is the MAGIC — it tells us exactly where to look!",
    guideState: "excited",
  },
  {
    id: "buckets",
    title: "The Buckets",
    description:
      "The hash table is an array of buckets. Each key hashes to a specific bucket index. To find a value, just compute hash(key) % size.",
    guideMessage: "Each bucket is like a labeled shelf. Calculate the hash, go directly there!",
    guideState: "explaining",
  },
  {
    id: "collisions",
    title: "Collisions!",
    description:
      "Sometimes different keys hash to the SAME bucket. This is a collision. We handle it via chaining (linked lists in buckets) or open addressing (probe to next slot).",
    guideMessage:
      "Collisions are inevitable — the trick is handling them gracefully!",
    guideState: "encouraging",
  },
  {
    id: "complexity",
    title: "Why O(1)?",
    description:
      "Hash(key) = O(1). Access bucket[index] = O(1). Average case: O(1)! But with many collisions it can degrade to O(n).",
    guideMessage: "O(1) on average! That's the power of hashing!",
    guideState: "celebrating",
  },
];

function simpleHash(key: string): number {
  let h = 0;
  for (let i = 0; i < key.length; i++) {
    h = (h * 31 + key.charCodeAt(i)) >>> 0;
  }
  return h;
}

export default function HashMapInMemory({
  entries = [
    ["apple", 5],
    ["banana", 3],
    ["cherry", 7],
    ["grape", 10],
    ["date", 2],
  ],
  bucketCount = 8,
  showHashCalculation: _showHashCalc = true,
  collisionStrategy = "chaining",
  highlightKey: _highlightKey,
  className = "",
}: HashMapInMemoryProps) {
  const [currentScene, setCurrentScene] = useState(0);
  const [searchKey, setSearchKey] = useState("");
  const [searchResult, setSearchResult] = useState<{ found: boolean; value?: number; steps: string[] } | null>(null);
  const [insertKey, setInsertKey] = useState("");
  const [insertValue, setInsertValue] = useState("");
  const [liveEntries, setLiveEntries] = useState<[string, number][]>(entries);

  // Build buckets
  const buckets = useMemo(() => {
    const b: BucketEntry[][] = Array.from({ length: bucketCount }, () => []);
    for (const [key, value] of liveEntries) {
      const hash = simpleHash(key);
      const idx = hash % bucketCount;
      b[idx].push({ key, value, hash });
    }
    return b;
  }, [liveEntries, bucketCount]);

  const scene = SCENES[currentScene];

  const handleSearch = useCallback(() => {
    if (!searchKey.trim()) return;
    const hash = simpleHash(searchKey);
    const idx = hash % bucketCount;
    const steps: string[] = [
      `hash("${searchKey}") = ${hash}`,
      `${hash} % ${bucketCount} = ${idx}`,
      `Go to bucket[${idx}]`,
    ];
    const bucket = buckets[idx];
    const found = bucket.find((e) => e.key === searchKey);
    if (found) {
      steps.push(`Found "${searchKey}" = ${found.value} ✓`);
      setSearchResult({ found: true, value: found.value, steps });
    } else {
      steps.push(`"${searchKey}" NOT in bucket[${idx}] ✗`);
      setSearchResult({ found: false, steps });
    }
  }, [searchKey, buckets, bucketCount]);

  const handleInsert = useCallback(() => {
    if (!insertKey.trim()) return;
    const val = parseInt(insertValue) || 0;
    setLiveEntries((prev) => {
      const exists = prev.findIndex(([k]) => k === insertKey);
      if (exists >= 0) {
        const next = [...prev];
        next[exists] = [insertKey, val];
        return next;
      }
      return [...prev, [insertKey, val]];
    });
    setInsertKey("");
    setInsertValue("");
  }, [insertKey, insertValue]);

  return (
    <div className={`p-6 rounded-2xl bg-background/80/50 backdrop-blur-xl border border-white/10 ${className}`}>
      <h3 className="text-lg font-semibold text-white mb-2">
        Hash Map in Memory
      </h3>

      {/* Scene tabs */}
      <div className="flex gap-1 mb-4 flex-wrap">
        {SCENES.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setCurrentScene(i)}
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

      {/* === Scene 0: The problem === */}
      {currentScene === 0 && (
        <div className="space-y-2">
          <p className="text-xs text-white/40 font-mono mb-2">Data to store:</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {liveEntries.map(([key, val]) => (
              <div
                key={key}
                className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-xs font-mono"
              >
                <span className="text-primary">&quot;{key}&quot;</span>
                <span className="text-white/30"> → </span>
                <span className="text-white">{val}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-white/40 mt-3">
            To find &quot;banana&quot; naively, we&apos;d check each item one by one → <span className="text-[var(--warning)]">O(n)</span>
          </p>
        </div>
      )}

      {/* === Scene 1: Hash calculation === */}
      {currentScene === 1 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <input
              type="text"
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Type a key..."
              className="flex-1 max-w-xs px-3 py-1.5 text-sm font-mono rounded bg-white/5 border border-white/10 text-white placeholder-white/20 focus:border-primary/50 focus:outline-none"
            />
            <button
              onClick={handleSearch}
              className="px-3 py-1.5 text-xs rounded bg-primary/20 text-primary hover:bg-primary/30 transition-colors"
            >
              Hash it!
            </button>
          </div>

          {/* Hash calculation visual */}
          {searchKey && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-lg bg-white/[0.03] border border-white/[0.06]"
            >
              <div className="flex flex-col items-center gap-2 text-sm font-mono">
                <span className="text-primary">&quot;{searchKey}&quot;</span>
                <span className="text-white/30">↓</span>
                <span className="text-white/50">[Hash Function]</span>
                <span className="text-white/30">↓</span>
                <span className="text-white">{simpleHash(searchKey)}</span>
                <span className="text-white/30">↓</span>
                <span className="text-white/50">% {bucketCount}</span>
                <span className="text-white/30">↓</span>
                <span className="text-primary text-lg font-bold">
                  Bucket [{simpleHash(searchKey) % bucketCount}]
                </span>
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* === Scene 2: Buckets + Scene 3: Collisions + Scene 4: Complexity === */}
      {currentScene >= 2 && (
        <div className="space-y-4">
          {/* Insert controls */}
          {currentScene >= 3 && (
            <div className="flex items-center gap-2 flex-wrap">
              <input
                type="text"
                value={insertKey}
                onChange={(e) => setInsertKey(e.target.value)}
                placeholder="Key"
                className="w-24 px-2 py-1 text-xs font-mono rounded bg-white/5 border border-white/10 text-white placeholder-white/20 focus:border-primary/50 focus:outline-none"
              />
              <input
                type="number"
                value={insertValue}
                onChange={(e) => setInsertValue(e.target.value)}
                placeholder="Value"
                className="w-16 px-2 py-1 text-xs font-mono rounded bg-white/5 border border-white/10 text-white placeholder-white/20 focus:border-primary/50 focus:outline-none"
              />
              <button
                onClick={handleInsert}
                className="px-3 py-1 text-xs rounded bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors"
              >
                + Insert
              </button>
            </div>
          )}

          {/* Bucket visualization */}
          <div className="space-y-1">
            {buckets.map((bucket, i) => {
              const hasCollision = bucket.length > 1;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`flex items-center gap-3 p-2 rounded-lg border ${
                    hasCollision && currentScene >= 3
                      ? "bg-[var(--warning)]/10 border-[var(--warning)]/30"
                      : bucket.length > 0
                      ? "bg-white/[0.03] border-white/[0.08]"
                      : "bg-white/[0.01] border-white/[0.04]"
                  }`}
                >
                  <span className="font-mono text-xs text-primary/60 w-6">
                    {i}
                  </span>
                  <span className="text-white/20">│</span>

                  {bucket.length > 0 ? (
                    <div className="flex items-center gap-1 flex-wrap">
                      {bucket.map((entry, j) => (
                        <div key={entry.key} className="flex items-center gap-1">
                          {j > 0 && (
                            <span className="text-primary/40 text-xs">→</span>
                          )}
                          <div
                            className={`px-2 py-0.5 rounded text-xs font-mono ${
                              hasCollision && currentScene >= 3
                                ? "bg-[var(--warning)]/15 border border-[var(--warning)]/20"
                                : "bg-white/[0.05] border border-white/10"
                            }`}
                          >
                            <span className="text-primary">
                              &quot;{entry.key}&quot;
                            </span>
                            <span className="text-white/30">: </span>
                            <span className="text-white">{entry.value}</span>
                          </div>
                        </div>
                      ))}
                      {collisionStrategy === "chaining" && (
                        <span className="text-white/20 text-xs ml-1">→ null</span>
                      )}
                    </div>
                  ) : (
                    <span className="text-xs text-white/15 font-mono">
                      [empty]
                    </span>
                  )}

                  {hasCollision && currentScene >= 3 && (
                    <span className="ml-auto text-[10px] text-[var(--warning)] font-mono">
                      COLLISION!
                    </span>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Search */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={searchKey}
              onChange={(e) => { setSearchKey(e.target.value); setSearchResult(null); }}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search key..."
              className="flex-1 max-w-xs px-2 py-1 text-xs font-mono rounded bg-white/5 border border-white/10 text-white placeholder-white/20 focus:border-primary/50 focus:outline-none"
            />
            <button
              onClick={handleSearch}
              className="px-3 py-1 text-xs rounded bg-primary/20 text-primary hover:bg-primary/30 transition-colors"
            >
              🔍 Lookup
            </button>
          </div>

          <AnimatePresence>
            {searchResult && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`p-3 rounded-lg border text-xs font-mono space-y-1 ${
                  searchResult.found
                    ? "bg-emerald-500/10 border-emerald-500/30"
                    : "bg-red-500/10 border-red-500/30"
                }`}
              >
                {searchResult.steps.map((step, i) => (
                  <p
                    key={i}
                    className={
                      i === searchResult.steps.length - 1
                        ? searchResult.found
                          ? "text-emerald-400 font-bold"
                          : "text-red-400 font-bold"
                        : "text-white/60"
                    }
                  >
                    {step}
                  </p>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Complexity note (scene 4) */}
          {currentScene === 4 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-lg bg-primary/10 border border-primary/30"
            >
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div>
                  <p className="text-white/40 mb-1">Average Case</p>
                  <p className="text-emerald-400">Insert: O(1)</p>
                  <p className="text-emerald-400">Lookup: O(1)</p>
                  <p className="text-emerald-400">Delete: O(1)</p>
                </div>
                <div>
                  <p className="text-white/40 mb-1">Worst Case (all collide)</p>
                  <p className="text-[var(--warning)]">Insert: O(n)</p>
                  <p className="text-[var(--warning)]">Lookup: O(n)</p>
                  <p className="text-[var(--warning)]">Delete: O(n)</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between items-center mt-6 pt-4 border-t border-white/[0.06]">
        <button
          onClick={() => setCurrentScene((s) => Math.max(0, s - 1))}
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
          onClick={() => setCurrentScene((s) => Math.min(SCENES.length - 1, s + 1))}
          disabled={currentScene === SCENES.length - 1}
          className="px-3 py-1.5 text-sm rounded bg-primary/20 text-primary hover:bg-primary/30 disabled:opacity-30 transition-colors"
        >
          Next →
        </button>
      </div>

    </div>
  );
}
