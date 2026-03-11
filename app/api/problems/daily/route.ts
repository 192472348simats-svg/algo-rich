import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// Deterministic daily seed — same problem for all users on the same day
function getDailySeed(): number {
  const d = new Date();
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Count all problems; use daily seed to pick one deterministically
    const count = await prisma.problem.count();
    if (count === 0) {
      return NextResponse.json({ problem: null });
    }

    const seed = getDailySeed();
    const skip = seed % count;

    const problem = await prisma.problem.findFirst({
      skip,
      select: {
        id: true,
        title: true,
        difficulty: true,
        slug: true,
        pattern: true,
        phase: true,
      },
    });

    // Check if user already solved it today
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const alreadySolved = problem
      ? await prisma.submission.findFirst({
          where: {
            userId: session.user.id,
            problemId: problem.id,
            status: "accepted",
            createdAt: { gte: todayStart },
          },
        })
      : null;

    return NextResponse.json({
      problem,
      alreadySolved: !!alreadySolved,
    });
  } catch (error) {
    console.error("[problems/daily GET]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
