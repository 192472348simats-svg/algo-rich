import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { buildFailureSummary } from "@/lib/failurePatternAnalysis";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const submissions = await prisma.submission.findMany({
      where: { userId: session.user.id },
      select: {
        status: true,
        problem: {
          select: { difficulty: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 200,
    });

    const summary = buildFailureSummary(submissions);
    return NextResponse.json(summary);
  } catch (error) {
    console.error("[submissions/failure-stats GET]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
