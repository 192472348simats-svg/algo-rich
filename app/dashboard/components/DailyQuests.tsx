"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, ExternalLink, Gift, Sparkles } from "lucide-react";
import { triggerConfetti } from "@/app/components/feedback/Confetti";
import { DAILY_QUEST_PROGRESS_EVENT, type DailyQuestKind } from "./dailyQuestEvents";

type QuestType = "SOLVE_EASY_2" | "COMPLETE_STAGE" | "REVIEW_3" | "MAINTAIN_STREAK" | "TRY_MEDIUM" | "ASK_ZYRA";
interface Quest { id: string; questType: QuestType; title: string; target: number; xpReward: number; progress: number; claimed: boolean; }
interface DailyQuestsProps { currentStreak: number; mediumSolved: number; }

const kindToType: Record<DailyQuestKind, QuestType> = {
  easy: "SOLVE_EASY_2", session: "COMPLETE_STAGE", review: "REVIEW_3", streak: "MAINTAIN_STREAK", medium: "TRY_MEDIUM", zyra: "ASK_ZYRA",
};
const links: Record<QuestType, string> = {
  SOLVE_EASY_2: "/dashboard/practice?difficulty=easy", COMPLETE_STAGE: "/dashboard/sessions", REVIEW_3: "/dashboard/review",
  MAINTAIN_STREAK: "/dashboard/path", TRY_MEDIUM: "/dashboard/practice?difficulty=medium", ASK_ZYRA: "/dashboard",
};
const itemVariants = { hidden: { opacity: 0, x: -12 }, visible: { opacity: 1, x: 0, transition: { duration: 0.25 } } };

export default function DailyQuests({ currentStreak, mediumSolved }: DailyQuestsProps) {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [claimedXp, setClaimedXp] = useState(0);

  const loadQuests = async () => {
    const response = await fetch("/api/quests", { cache: "no-store" });
    if (!response.ok) throw new Error("Unable to load quests");
    const data = (await response.json()) as { quests: Quest[] };
    setQuests(data.quests);
    setClaimedXp(data.quests.filter((quest) => quest.claimed).reduce((sum, quest) => sum + quest.xpReward, 0));
  };

  useEffect(() => {
    loadQuests().catch(() => setError("Daily quests are temporarily unavailable."));
  }, []);

  useEffect(() => {
    const seedProgress = async () => {
      const updates: Promise<Response>[] = [];
      if (currentStreak > 0) updates.push(fetch("/api/quests/progress", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ questType: "MAINTAIN_STREAK" }) }));
      if (mediumSolved > 0) updates.push(fetch("/api/quests/progress", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ questType: "TRY_MEDIUM", increment: mediumSolved }) }));
      await Promise.allSettled(updates);
      if (updates.length > 0) await loadQuests().catch(() => undefined);
    };
    void seedProgress();
  }, [currentStreak, mediumSolved]);

  useEffect(() => {
    const handleProgress = (event: Event) => {
      const detail = (event as CustomEvent<{ kind?: DailyQuestKind; amount?: number }>).detail;
      if (!detail?.kind) return;
      const questType = kindToType[detail.kind];
      const increment = Math.max(1, detail.amount ?? 1);
      fetch("/api/quests/progress", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ questType, increment }) })
        .then((response) => { if (response.ok) return response.json(); throw new Error("progress failed"); })
        .then((data: { quest: Quest }) => setQuests((current) => current.map((quest) => quest.id === data.quest.id ? data.quest : quest)))
        .catch(() => undefined);
    };
    window.addEventListener(DAILY_QUEST_PROGRESS_EVENT, handleProgress);
    return () => window.removeEventListener(DAILY_QUEST_PROGRESS_EVENT, handleProgress);
  }, []);

  const claimQuest = async (quest: Quest) => {
    if (quest.claimed || quest.progress < quest.target) return;
    const response = await fetch("/api/quests/claim", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ questType: quest.questType }) });
    if (!response.ok) return;
    const data = (await response.json()) as { quest: Quest; xpGained: number };
    setQuests((current) => current.map((item) => item.id === data.quest.id ? data.quest : item));
    setClaimedXp((value) => value + data.xpGained);
    triggerConfetti({ particleCount: 70, spread: 75 });
    window.dispatchEvent(new CustomEvent("algo-rich:quest-claimed", { detail: data }));
  };

  if (error) return <section className="glass rounded-xl p-5 border border-primary/15 text-sm text-white/50">{error}</section>;
  if (quests.length === 0) return <div className="glass rounded-xl p-5 h-[236px] animate-pulse bg-white/[0.02]" aria-hidden="true" />;

  return (
    <motion.section variants={itemVariants} className="glass rounded-xl p-5 border border-primary/15">
      <div className="flex items-start justify-between gap-3 mb-4"><div><div className="flex items-center gap-2"><Sparkles size={17} className="text-primary" /><h2 className="text-lg font-semibold text-white">Daily Quests</h2></div><p className="text-xs text-muted-foreground mt-1">Small wins add up. Resets at midnight.</p></div>{claimedXp > 0 && <span className="text-xs font-semibold text-primary whitespace-nowrap">+{claimedXp} XP claimed</span>}</div>
      <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.08 } } }} className="space-y-3">
        {quests.map((quest) => { const completed = quest.progress >= quest.target; const percentage = Math.min(100, Math.round((quest.progress / quest.target) * 100)); return (
          <motion.div key={quest.id} variants={itemVariants} className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
            <div className="flex items-center gap-3"><div className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 ${completed ? "border-primary bg-primary text-primary-foreground" : "border-white/20"}`}>{completed && <Check size={13} strokeWidth={3} />}</div><span className={`text-sm flex-1 ${completed ? "text-white" : "text-white/75"}`}>{quest.title}</span><span className="text-[11px] font-semibold text-primary bg-primary/10 border border-primary/20 rounded-full px-2 py-1 whitespace-nowrap">+{quest.xpReward} XP</span></div>
            <div className="ml-8 mt-2 flex items-center gap-2"><div className="h-1.5 flex-1 rounded-full bg-white/10 overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${percentage}%` }} className="h-full rounded-full bg-primary" /></div><span className="text-[11px] text-white/45 tabular-nums">{Math.min(quest.progress, quest.target)}/{quest.target}</span>{completed && !quest.claimed ? <button onClick={() => claimQuest(quest)} className="text-[11px] font-semibold text-primary hover:text-white transition-colors">Claim</button> : quest.claimed ? <span className="text-[11px] text-emerald-400">Claimed</span> : <Link href={links[quest.questType]} className="text-white/35 hover:text-primary transition-colors" aria-label={`Open ${quest.title}`}><ExternalLink size={13} /></Link>}</div>
          </motion.div>
        ); })}
      </motion.div>
      <div className="mt-4 flex items-center gap-2 text-[11px] text-white/35"><Gift size={13} className="text-primary/70" /> Quest rewards are saved to your account.</div>
    </motion.section>
  );
}
