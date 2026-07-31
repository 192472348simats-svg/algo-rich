import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getQuestDate, selectDailyQuestTypes } from "@/lib/dailyQuests";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = session.user.id;
    const date = getQuestDate();
    let quests = await prisma.dailyQuest.findMany({ where: { userId, date }, orderBy: { createdAt: "asc" } });

    if (quests.length === 0) {
      const selected = selectDailyQuestTypes(date);
      await prisma.dailyQuest.createMany({
        data: selected.map((quest) => ({ userId, date, questType: quest.type, title: quest.title, target: quest.target, xpReward: quest.xpReward })),
        skipDuplicates: true,
      });
      quests = await prisma.dailyQuest.findMany({ where: { userId, date }, orderBy: { createdAt: "asc" } });
    }

    return NextResponse.json({ quests, canClaim: quests.some((quest) => !quest.claimed && quest.progress >= quest.target) });
  } catch (error) {
    console.error("GET /api/quests error:", error);
    return NextResponse.json({ error: "Failed to load daily quests" }, { status: 500 });
  }
}
