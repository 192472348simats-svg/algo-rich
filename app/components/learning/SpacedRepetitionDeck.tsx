"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FlashCard {
  id: string;
  front: string;
  back: string;
  type: "pattern" | "complexity" | "concept" | "problem";
  ease: number;
  interval: number;
  repetitions: number;
}

interface SpacedRepetitionDeckProps {
  cards: FlashCard[];
  deckType: "patterns" | "complexity" | "concepts" | "problems";
  onReview: (cardId: string, quality: "again" | "hard" | "good" | "easy") => void;
  className?: string;
}

type Quality = "again" | "hard" | "good" | "easy";

const qualityConfig: Record<Quality, { label: string; color: string; key: string }> = {
  again: { label: "Again", color: "text-red-400 border-red-500/40 hover:bg-red-500/10", key: "1" },
  hard: { label: "Hard", color: "text-orange-400 border-orange-500/40 hover:bg-orange-500/10", key: "2" },
  good: { label: "Good", color: "text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/10", key: "3" },
  easy: { label: "Easy", color: "text-primary border-primary/40 hover:bg-primary/10", key: "4" },
};

export default function SpacedRepetitionDeck({
  cards,
  deckType,
  onReview,
  className = "",
}: SpacedRepetitionDeckProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0);
  const [sessionResults, setSessionResults] = useState<{ quality: Quality }[]>([]);

  const currentCard = cards[currentIndex];
  const isComplete = currentIndex >= cards.length;

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === " ") {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      }
      if (isFlipped) {
        const qualityKeys: Record<string, Quality> = {
          "1": "again",
          "2": "hard",
          "3": "good",
          "4": "easy",
        };
        if (qualityKeys[e.key]) {
          handleReview(qualityKeys[e.key]);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFlipped, currentIndex]);

  const handleReview = useCallback(
    (quality: Quality) => {
      if (!currentCard) return;
      onReview(currentCard.id, quality);
      setSessionResults((prev) => [...prev, { quality }]);
      setReviewedCount((prev) => prev + 1);
      setIsFlipped(false);

      // Small delay before next card
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
      }, 200);
    },
    [currentCard, onReview]
  );

  const deckIcon = useMemo(() => {
    switch (deckType) {
      case "patterns":
        return "🎯";
      case "complexity":
        return "📊";
      case "concepts":
        return "💡";
      case "problems":
        return "🧩";
    }
  }, [deckType]);

  if (isComplete) {
    const goodCount = sessionResults.filter(
      (r) => r.quality === "good" || r.quality === "easy"
    ).length;
    const score = Math.round((goodCount / cards.length) * 100);

    return (
      <div className={`card-shiny p-8 text-center ${className}`}>
        <h3 className="text-2xl font-bold text-foreground">
          Deck Complete! 🎉
        </h3>
        <p className="text-muted-foreground mt-2">
          {cards.length} cards reviewed
        </p>
        <div className="flex justify-center gap-6 mt-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-primary">{score}%</p>
            <p className="text-xs text-muted-foreground">Confidence</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-emerald-400">{goodCount}</p>
            <p className="text-xs text-muted-foreground">Confident</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-red-400">
              {cards.length - goodCount}
            </p>
            <p className="text-xs text-muted-foreground">Need Review</p>
          </div>
        </div>
      </div>
    );
  }

  if (!currentCard) return null;

  return (
    <div className={`${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-xl">{deckIcon}</span>
          <div>
            <h3 className="font-bold text-foreground capitalize">
              {deckType} Deck
            </h3>
            <p className="text-xs text-muted-foreground">
              {currentIndex + 1} of {cards.length} • {reviewedCount} reviewed
            </p>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="h-1 bg-card/60 rounded-full mb-6 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: "var(--gradient-gold)" }}
          animate={{
            width: `${((currentIndex + 1) / cards.length) * 100}%`,
          }}
        />
      </div>

      {/* Card */}
      <div className="perspective-1000" style={{ perspective: "1000px" }}>
        <motion.div
          className="relative w-full cursor-pointer"
          style={{ minHeight: "280px", transformStyle: "preserve-3d" }}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          onClick={() => setIsFlipped((prev) => !prev)}
        >
          {/* Front */}
          <div
            className="absolute inset-0 card-shiny p-8 flex flex-col items-center justify-center text-center"
            style={{ backfaceVisibility: "hidden" }}
          >
            <span className="text-xs text-primary uppercase tracking-wider mb-4">
              {currentCard.type}
            </span>
            <p className="text-xl font-semibold text-foreground leading-relaxed">
              {currentCard.front}
            </p>
            <p className="text-xs text-muted-foreground/70 mt-6">
              Click or press Space to flip
            </p>
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 card-shiny p-8 flex flex-col items-center justify-center text-center"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <span className="text-xs text-primary uppercase tracking-wider mb-4">
              Answer
            </span>
            <p className="text-lg text-foreground leading-relaxed whitespace-pre-wrap">
              {currentCard.back}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Review buttons (only when flipped) */}
      <AnimatePresence>
        {isFlipped && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="grid grid-cols-4 gap-3 mt-6"
          >
            {(Object.entries(qualityConfig) as [Quality, typeof qualityConfig.again][]).map(
              ([quality, config]) => (
                <motion.button
                  key={quality}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReview(quality);
                  }}
                  className={`py-3 rounded-xl border text-sm font-semibold transition-colors ${config.color}`}
                >
                  {config.label}
                  <span className="block text-xs opacity-50 mt-0.5">
                    ({config.key})
                  </span>
                </motion.button>
              )
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
