import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getHint, getHintXPCost } from "@/lib/hintSystem";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ problemId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { problemId } = await params;
  const level = parseInt(request.nextUrl.searchParams.get("level") ?? "1", 10);

  if (level < 1 || level > 5) {
    return NextResponse.json({ error: "level must be 1–5" }, { status: 400 });
  }

  const problem = await prisma.problem.findUnique({
    where: { id: problemId },
    select: { hints: true },
  });

  if (!problem) {
    return NextResponse.json({ error: "Problem not found" }, { status: 404 });
  }

  const hint = getHint(problem.hints, level);
  const xpCost = getHintXPCost(level);

  // Deduct XP for paid hints (levels 2–5)
  let xpDeducted = 0;
  if (xpCost > 0) {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { totalXP: { decrement: xpCost } },
    });
    xpDeducted = xpCost;
  }

  return NextResponse.json({ hint, level, xpDeducted });
}
