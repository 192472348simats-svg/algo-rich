import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

/**
 * POST /api/user/streak-repair
 * Lets a user repair a recently broken streak (one-time, within 24 h of breaking it).
 * The repair costs 50 XP and sets streakRepairAvailable = false.
 */
export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      streakRepairAvailable: true,
      streakRepairedAt: true,
      totalXP: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (!user.streakRepairAvailable) {
    return NextResponse.json(
      { error: "Streak repair is not available for your account right now." },
      { status: 400 }
    );
  }

  // Check 24-hour window: repair must not have been used in the last 24 h
  if (user.streakRepairedAt) {
    const hoursSince =
      (Date.now() - user.streakRepairedAt.getTime()) / (1000 * 60 * 60);
    if (hoursSince < 24) {
      return NextResponse.json(
        { error: "You can only repair once per 24 hours." },
        { status: 429 }
      );
    }
  }

  const REPAIR_COST = 50;
  if (user.totalXP < REPAIR_COST) {
    return NextResponse.json(
      { error: `Streak repair costs ${REPAIR_COST} XP. You don't have enough.` },
      { status: 400 }
    );
  }

  const updated = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      streakRepairAvailable: false,
      streakRepairedAt: new Date(),
      totalXP: { decrement: REPAIR_COST },
    },
    select: { totalXP: true },
  });

  return NextResponse.json({
    success: true,
    xpDeducted: REPAIR_COST,
    totalXP: updated.totalXP,
    message: "Streak repaired! Keep it going 🔥",
  });
}
