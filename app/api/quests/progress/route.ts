import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getQuestDate, type DailyQuestType } from "@/lib/dailyQuests";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = (await request.json().catch(() => null)) as { questType?: unknown; increment?: unknown } | null;
    const questType = body?.questType;
    if (typeof questType !== "string") return NextResponse.json({ error: "questType is required" }, { status: 400 });
    const increment = typeof body?.increment === "number" && Number.isFinite(body.increment) ? Math.max(1, Math.floor(body.increment)) : 1;
    const date = getQuestDate();
    const quest = await prisma.dailyQuest.findUnique({ where: { userId_date_questType: { userId: session.user.id, date, questType } } });
    if (!quest) return NextResponse.json({ error: "Quest not found" }, { status: 404 });
    const updated = await prisma.dailyQuest.update({ where: { id: quest.id }, data: { progress: Math.min(quest.target, quest.progress + increment) } });
    return NextResponse.json({ quest: updated, canClaim: !updated.claimed && updated.progress >= updated.target });
  } catch (error) {
    console.error("POST /api/quests/progress error:", error);
    return NextResponse.json({ error: "Failed to update quest progress" }, { status: 500 });
  }
}
