"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

interface CardPreview {
  front: string;
  topic?: string;
}

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

export default function DailyCardsPreview() {
  const router = useRouter();
  const [previewCards, setPreviewCards] = useState<CardPreview[]>([]);
  const [cardsDueToday, setCardsDueToday] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCards() {
      try {
        const res = await fetch("/api/cards/daily");
        if (res.ok) {
          const data = await res.json();
          const cards = data.cards ?? [];
          setCardsDueToday(cards.length);
          setPreviewCards(
            cards.slice(0, 3).map((c: { question?: string; front?: string; topic?: string; type?: string }) => ({
              front: c.question || c.front || "Review card",
              topic: c.topic || c.type || "",
            }))
          );
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }
    fetchCards();
  }, []);

  if (loading) return null;

  return (
    <motion.div variants={itemVariants} className="glass rounded-xl p-5 mt-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-base">📝</span>
          <h3 className="text-sm font-semibold text-white">Daily Cards</h3>
        </div>
        <div className="flex items-center gap-2">
          {cardsDueToday > 0 && (
            <span className="text-xs text-primary/60 bg-primary/10 rounded-full px-2.5 py-0.5">
              {cardsDueToday} cards today
            </span>
          )}
          <Link
            href="/dashboard/cards"
            className="text-xs text-white/20 hover:text-white/40"
          >
            View all →
          </Link>
        </div>
      </div>

      {previewCards.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {previewCards.map((card, i) => (
              <div
                key={i}
                className="rounded-lg border border-white/[0.04] bg-white/[0.01] p-3 hover:bg-white/[0.03] transition-colors cursor-pointer"
                onClick={() => router.push("/dashboard/cards")}
              >
                <p className="text-xs text-white/50 line-clamp-2 leading-relaxed">
                  {card.front}
                </p>
                {card.topic && (
                  <p className="text-[10px] text-white/15 mt-2">{card.topic}</p>
                )}
              </div>
            ))}
          </div>

          {cardsDueToday > 0 && (
            <Link href="/dashboard/cards">
              <div className="mt-3 rounded-lg bg-primary/10 border border-primary/20 py-2 text-center text-xs text-primary/70 hover:bg-primary/20 transition-colors cursor-pointer">
                Start Card Session →
              </div>
            </Link>
          )}
        </>
      ) : (
        <p className="text-xs text-white/20 text-center py-4">
          All caught up! New cards tomorrow. 🎉
        </p>
      )}
    </motion.div>
  );
}
