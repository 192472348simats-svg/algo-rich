import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { MAX_STREAK_FREEZES } from "@/lib/streakFreeze";

/** GET /api/user/streak-freeze — return freeze count */
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { streakFreezes: true },
  });

  return NextResponse.json({ streakFreezes: user?.streakFreezes ?? 0, max: MAX_STREAK_FREEZES });
}

/** POST /api/user/streak-freeze — apply a freeze to protect the current streak */
export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { streakFreezes: true },
  });

  if (!user || user.streakFreezes <= 0) {
    return NextResponse.json({ error: "No streak freezes available" }, { status: 400 });
  }

  const updated = await prisma.user.update({
    where: { id: session.user.id },
    data: { streakFreezes: { decrement: 1 } },
    select: { streakFreezes: true },
  });

  return NextResponse.json({
    success: true,
    streakFreezes: updated.streakFreezes,
    message: "Freeze applied — your streak is safe for today!",
  });
}
