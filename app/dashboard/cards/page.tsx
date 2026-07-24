"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CardDeck, { type DeckCard, type DeckStats } from "@/app/components/learning/CardDeck";
import { getLevelForXP, type Level } from "@/lib/xpSystem";

export const dynamic = 'force-dynamic'


/* ── Types ─────────────────────────────────── */
interface CardStats {
  totalReviews: number;
  correctReviews: number;
  accuracy: number;
  cardsStudied: number;
  totalCards: number;
  dueForReview: number;
}

/* ──────────────────────────────────────────── */
export default function DailyCardsPage() {
  const [cards, setCards] = useState<DeckCard[]>([]);
  const [stats, setStats] = useState<CardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deckDone, setDeckDone] = useState(false);
  const [deckStats, setDeckStats] = useState<DeckStats | null>(null);

  /* ── Fetch daily cards + stats ─────────── */
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [cardsRes, statsRes] = await Promise.all([
        fetch("/api/cards/daily"),
        fetch("/api/cards/stats"),
      ]);
      if (!cardsRes.ok || !statsRes.ok) throw new Error("Failed to load");
      const cardsData = await cardsRes.json();
      const statsData = await statsRes.json();
      setCards(cardsData.cards ?? []);
      setStats(statsData);
    } catch {
      setError("Couldn't load your daily cards. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  /* ── Deck complete handler ─────────────── */
  const handleComplete = useCallback((s: DeckStats) => {
    setDeckDone(true);
    setDeckStats(s);
  }, []);

  /* ── Topic breakdown ───────────────────── */
  const topicBreakdown = cards.reduce<Record<string, number>>((acc, c) => {
    const label = c.type.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
    acc[label] = (acc[label] || 0) + 1;
    return acc;
  }, {});

  /* ── Skeleton ──────────────────────────── */
  if (loading) {
    return (
      <div className="p-6 md:p-8">
        <div className="animate-pulse space-y-6 max-w-lg mx-auto">
          <div className="h-8 w-52 bg-white/10 rounded" />
          <div className="h-4 w-36 bg-white/5 rounded" />
          <div className="h-64 bg-white/5 rounded-2xl" />
        </div>
      </div>
    );
  }

  /* ── Error state ───────────────────────── */
  if (error) {
    return (
      <div className="p-6 md:p-8 text-center">
        <p className="text-rose-400 mb-4">{error}</p>
        <button onClick={fetchData} className="px-4 py-2 rounded-lg bg-primary text-background text-sm font-medium hover:bg-primary/80 transition-colors">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto space-y-6">
      {/* ── Header ─────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-start justify-between flex-wrap gap-2">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              🃏 Today&apos;s Review
            </h1>
            <p className="text-sm text-white/40 mt-1">
              {cards.length > 0 ? (
                <>
                  {cards.length} card{cards.length !== 1 ? "s" : ""} due
                  <span className="mx-1 opacity-30">·</span>
                  ~{Math.ceil(cards.length * 0.5)} min
                </>
              ) : (
                "No cards due right now"
              )}
            </p>
          </div>

          {/* Stats pill */}
          {stats && (
            <div className="flex items-center gap-3 text-xs text-white/40">
              <span title="Cards studied">📋 {stats.cardsStudied} studied</span>
              <span title="Accuracy">{stats.accuracy}% acc</span>
            </div>
          )}
        </div>
      </motion.div>

      {/* ── Streak banner ──────────────────── */}
      {stats && stats.totalReviews > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl bg-gradient-to-r from-amber-900/20 to-transparent border border-amber-500/10 px-4 py-3 flex items-center gap-3"
        >
          <span className="text-2xl">🔥</span>
          <div>
            <p className="text-sm font-semibold text-amber-300">
              {stats.totalReviews} total reviews
            </p>
            <p className="text-xs text-amber-400/50">
              Keep going — consistency is key!
            </p>
          </div>
        </motion.div>
      )}

      {/* ── Topic breakdown ────────────────── */}
      {Object.keys(topicBreakdown).length > 0 && !deckDone && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap gap-2"
        >
          {Object.entries(topicBreakdown).map(([topic, count]) => (
            <span
              key={topic}
              className="text-[10px] px-2 py-1 rounded-full bg-white/5 border border-white/10 text-white/50"
            >
              {topic} × {count}
            </span>
          ))}
        </motion.div>
      )}

      {/* ── Card Deck ──────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={deckDone ? "done" : "deck"}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
        >
          <CardDeck cards={cards} onComplete={handleComplete} />
        </motion.div>
      </AnimatePresence>

      {/* ── Study more / next review ─────── */}
      {deckDone && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center space-y-3"
        >
          <button
            onClick={() => {
              setDeckDone(false);
              setDeckStats(null);
              fetchData();
            }}
            className="px-5 py-2.5 text-sm font-medium rounded-lg bg-primary text-background hover:bg-primary/80 transition-colors"
          >
            Check for More Cards
          </button>

          <p className="text-xs text-white/30">
            Spaced repetition will schedule your next reviews automatically
          </p>
        </motion.div>
      )}
    </div>
  );
}
