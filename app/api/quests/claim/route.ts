import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getQuestDate } from "@/lib/dailyQuests";
import { getLevelForXP } from "@/lib/xpSystem";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = (await request.json().catch(() => null)) as { questType?: unknown } | null;
    if (typeof body?.questType !== "string") return NextResponse.json({ error: "questType is required" }, { status: 400 });
    const date = getQuestDate();

    const result = await prisma.$transaction(async (tx) => {
      const quest = await tx.dailyQuest.findUnique({ where: { userId_date_questType: { userId: session.user.id, date, questType: body.questType as string } } });
      if (!quest) return { error: "Quest not found", status: 404 as const };
      if (quest.claimed) return { error: "Quest already claimed", status: 409 as const };
      if (quest.progress < quest.target) return { error: "Quest is not complete", status: 400 as const };

      const user = await tx.user.update({ where: { id: session.user.id }, data: { totalXP: { increment: quest.xpReward } }, select: { totalXP: true } });
      const previousLevel = getLevelForXP(user.totalXP - quest.xpReward).current.level;
      const newLevel = getLevelForXP(user.totalXP).current.level;
      const updatedQuest = await tx.dailyQuest.update({ where: { id: quest.id }, data: { claimed: true } });
      return { success: true, quest: updatedQuest, xpGained: quest.xpReward, newXp: user.totalXP, newLevel, didLevelUp: newLevel > previousLevel };
    });

    if ("error" in result) return NextResponse.json({ error: result.error }, { status: result.status });
    return NextResponse.json(result);
  } catch (error) {
    console.error("POST /api/quests/claim error:", error);
    return NextResponse.json({ error: "Failed to claim quest" }, { status: 500 });
  }
}
