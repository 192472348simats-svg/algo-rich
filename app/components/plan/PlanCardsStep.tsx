"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { PlanStep, CardsData } from "@/lib/planGenerator";

interface Props {
  step: PlanStep;
  onComplete: (result: {
    score?: number;
    timeSpent?: number;
    skipped?: boolean;
  }) => void;
}

interface FlashCard {
  id: string;
  front: string;
  back: string;
  topic: string;
}

export default function PlanCardsStep({ step, onComplete }: Props) {
  const data = step.data as CardsData;
  const [cards, setCards] = useState<FlashCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [reviewed, setReviewed] = useState(0);
  const [loading, setLoading] = useState(true);
  const [startTime] = useState(() => Date.now());

  useEffect(() => {
    fetch("/api/cards/daily")
      .then((res) => (res.ok ? res.json() : { cards: [] }))
      .then((data) => {
        setCards(data.cards || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleRate = (quality: "easy" | "medium" | "hard") => {
    const card = cards[currentIndex];
    if (card) {
      fetch("/api/cards/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cardId: card.id, quality }),
      }).catch(() => {});
    }

    setReviewed((r) => r + 1);
    setFlipped(false);

    if (currentIndex + 1 >= cards.length) {
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      setTimeout(() => onComplete({ score: reviewed * 5, timeSpent }), 500);
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <motion.div
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="text-white/30 text-sm"
        >
          Loading cards...
        </motion.div>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4 py-12"
      >
        <div className="text-4xl">🎉</div>
        <h2 className="text-lg font-bold text-white">All caught up!</h2>
        <p className="text-sm text-white/30">
          No flashcards due right now. Great job staying on top of reviews.
        </p>
        <button
          onClick={() => onComplete({ skipped: true })}
          className="mt-4 rounded-xl bg-white/[0.06] border border-white/[0.06] px-6 py-2.5 text-sm text-white/60 hover:bg-white/10 transition-colors"
        >
          Continue →
        </button>
      </motion.div>
    );
  }

  const card = cards[currentIndex];
  const progress = ((currentIndex + 1) / cards.length) * 100;

  return (
    <div className="max-w-lg mx-auto space-y-6">
      {/* Progress */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-white/20">
          {currentIndex + 1} / {cards.length}
        </span>
        <div className="flex-1 h-1 bg-white/[0.06] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <span className="text-xs text-white/20">
          {data.topics.join(", ")}
        </span>
      </div>

      {/* Card */}
      <motion.div
        key={card.id}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative"
      >
        <button
          onClick={() => setFlipped(!flipped)}
          className="w-full text-left"
        >
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-8 min-h-[200px] flex flex-col justify-center">
            {!flipped ? (
              <div className="space-y-4">
                <span className="text-[10px] uppercase tracking-widest text-white/15">
                  Question
                </span>
                <p className="text-white text-lg leading-relaxed">{card.front}</p>
                <p className="text-xs text-white/15 mt-4">Tap to reveal answer</p>
              </div>
            ) : (
              <div className="space-y-4">
                <span className="text-[10px] uppercase tracking-widest text-emerald-400/40">
                  Answer
                </span>
                <p className="text-white text-lg leading-relaxed">{card.back}</p>
              </div>
            )}
          </div>
        </button>
      </motion.div>

      {/* Rating buttons (only when flipped) */}
      {flipped && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-3 justify-center"
        >
          <button
            onClick={() => handleRate("hard")}
            className="rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-2.5 text-sm text-red-400 hover:bg-red-500/20 transition-colors"
          >
            Hard
          </button>
          <button
            onClick={() => handleRate("medium")}
            className="rounded-xl border border-yellow-500/20 bg-yellow-500/10 px-5 py-2.5 text-sm text-yellow-400 hover:bg-yellow-500/20 transition-colors"
          >
            Good
          </button>
          <button
            onClick={() => handleRate("easy")}
            className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-5 py-2.5 text-sm text-emerald-400 hover:bg-emerald-500/20 transition-colors"
          >
            Easy
          </button>
        </motion.div>
      )}
    </div>
  );
}
