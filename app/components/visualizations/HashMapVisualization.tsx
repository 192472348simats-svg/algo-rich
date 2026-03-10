"use client";

import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface HashMapVisualizationProps {
  bucketCount?: number;
  initialEntries?: { key: string; value: string | number }[];
  collisionStrategy?: "chaining" | "openAddressing";
  showHashCalculation?: boolean;
  mode: "explanation" | "interactive";
  className?: string;
}

interface BucketEntry {
  key: string;
  value: string | number;
}

// Simple hash function for visualization
function simpleHash(key: string, bucketCount: number): number {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) % bucketCount;
  }
  return Math.abs(hash);
}

export default function HashMapVisualization({
  bucketCount = 8,
  initialEntries = [],
  collisionStrategy = "chaining",
  showHashCalculation = true,
  mode,
  className = "",
}: HashMapVisualizationProps) {
  const [buckets, setBuckets] = useState<BucketEntry[][]>(() => {
    const b: BucketEntry[][] = Array.from({ length: bucketCount }, () => []);
    initialEntries.forEach((entry) => {
      const idx = simpleHash(entry.key, bucketCount);
      b[idx].push(entry);
    });
    return b;
  });

  const [inputKey, setInputKey] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [lastAction, setLastAction] = useState("");
  const [highlightBucket, setHighlightBucket] = useState<number | null>(null);
  const [hashSteps, setHashSteps] = useState<string[]>([]);

  const handleInsert = useCallback(() => {
    const key = inputKey.trim();
    const value = inputValue.trim();
    if (!key || !value) return;

    const hashValue = simpleHash(key, bucketCount);

    if (showHashCalculation) {
      setHashSteps([
        `hash("${key}")`,
        `→ ${key.split("").map((c) => c.charCodeAt(0)).join(" + ")}`,
        `→ ${hashValue} (mod ${bucketCount})`,
        `→ bucket[${hashValue}]`,
      ]);
    }

    setHighlightBucket(hashValue);
    setBuckets((prev) => {
      const next = prev.map((b) => [...b]);
      // Check for existing key
      const existing = next[hashValue].findIndex((e) => e.key === key);
      if (existing >= 0) {
        next[hashValue][existing] = { key, value };
        setLastAction(`Updated "${key}" = "${value}" in bucket ${hashValue}`);
      } else {
        next[hashValue].push({ key, value });
        const collision = next[hashValue].length > 1;
        setLastAction(
          collision
            ? `Collision! "${key}" = "${value}" chained in bucket ${hashValue}`
            : `Inserted "${key}" = "${value}" into bucket ${hashValue}`
        );
      }
      return next;
    });

    setInputKey("");
    setInputValue("");

    setTimeout(() => setHighlightBucket(null), 2000);
  }, [inputKey, inputValue, bucketCount, showHashCalculation]);

  const handleSearch = useCallback(() => {
    const key = inputKey.trim();
    if (!key) return;

    const hashValue = simpleHash(key, bucketCount);
    setHighlightBucket(hashValue);

    const found = buckets[hashValue].find((e) => e.key === key);
    setLastAction(
      found
        ? `Found "${key}" = "${found.value}" in bucket ${hashValue}`
        : `"${key}" not found (bucket ${hashValue} checked)`
    );

    setTimeout(() => setHighlightBucket(null), 2000);
  }, [inputKey, bucketCount, buckets]);

  return (
    <div className={`card-shiny p-6 ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <div>
          <h3 className="font-bold text-foreground">
            Hash Map — {collisionStrategy === "chaining" ? "Chaining" : "Open Addressing"}
          </h3>
          <p className="text-xs text-muted-foreground">
            {bucketCount} buckets •{" "}
            {buckets.reduce((acc, b) => acc + b.length, 0)} entries
          </p>
        </div>
      </div>

      {/* Hash calculation display */}
      <AnimatePresence>
        {hashSteps.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 p-3 rounded-xl bg-background/80 border border-border font-mono text-xs space-y-1"
          >
            {hashSteps.map((step, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.3 }}
                className="text-primary"
              >
                {step}
              </motion.p>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Buckets visualization */}
      <div className="space-y-2">
        {buckets.map((bucket, index) => (
          <motion.div
            key={index}
            animate={{
              borderColor:
                highlightBucket === index
                  ? "hsl(var(--primary))"
                  : "hsl(var(--border))",
              boxShadow:
                highlightBucket === index
                  ? "0 0 16px hsl(43 96% 56%,0.3)"
                  : "none",
            }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-3 p-2 rounded-lg border border-border"
          >
            {/* Bucket index */}
            <div className="w-8 h-8 flex items-center justify-center rounded bg-card text-xs font-mono text-muted-foreground flex-shrink-0">
              {index}
            </div>

            {/* Entries */}
            <div className="flex gap-1 flex-wrap flex-1 min-h-[32px]">
              {bucket.length === 0 ? (
                <span className="text-xs text-muted-foreground/40 italic self-center">
                  empty
                </span>
              ) : (
                <AnimatePresence>
                  {bucket.map((entry, ei) => (
                    <motion.div
                      key={entry.key}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center gap-1"
                    >
                      {ei > 0 && (
                        <span className="text-muted-foreground/60 text-xs">→</span>
                      )}
                      <div className="px-2 py-1 rounded bg-card/60 border border-border text-xs">
                        <span className="text-primary">{entry.key}</span>
                        <span className="text-muted-foreground/70">: </span>
                        <span className="text-foreground">{entry.value}</span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Action feedback */}
      {lastAction && (
        <motion.div
          key={lastAction}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 p-2.5 rounded-lg bg-card text-center text-sm text-foreground/70 font-mono"
        >
          {lastAction}
        </motion.div>
      )}

      {/* Interactive controls */}
      {mode === "interactive" && (
        <div className="flex gap-3 mt-4">
          <input
            type="text"
            value={inputKey}
            onChange={(e) => setInputKey(e.target.value)}
            placeholder="Key"
            className="flex-1 px-3 py-2.5 rounded-xl bg-card border border-border text-foreground text-sm focus:outline-none focus:border-primary transition-colors"
          />
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Value"
            className="flex-1 px-3 py-2.5 rounded-xl bg-card border border-border text-foreground text-sm focus:outline-none focus:border-primary transition-colors"
          />
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleInsert}
            disabled={!inputKey.trim()}
            className="px-4 py-2.5 rounded-xl font-semibold text-sm disabled:opacity-40"
            style={{
              background: "var(--gradient-gold)",
              color: "hsl(228 100% 7%)",
            }}
          >
            Insert
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleSearch}
            disabled={!inputKey.trim()}
            className="px-4 py-2.5 rounded-xl font-semibold text-sm border border-primary/40 text-primary hover:bg-primary/10 disabled:opacity-30 transition-colors"
          >
            Search
          </motion.button>
        </div>
      )}
    </div>
  );
}
