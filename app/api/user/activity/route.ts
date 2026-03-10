import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

interface ActivityItem {
  id: string;
  type: "lesson" | "submission";
  title: string;
  description: string;
  date: string;
  passed?: boolean;
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

  const [progressItems, submissionItems] = await Promise.all([
    prisma.progress.findMany({
      where: { userId, completed: true },
      include: {
        lesson: {
          select: { title: true, course: { select: { title: true } } },
        },
      },
      orderBy: { completedAt: "desc" },
      take: 20,
    }),
    prisma.submission.findMany({
      where: { userId },
      include: {
        problem: { select: { title: true, difficulty: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
  ]);

  const activities: ActivityItem[] = [];

  for (const p of progressItems) {
    activities.push({
      id: `p-${p.id}`,
      type: "lesson",
      title: `Completed: ${p.lesson.title}`,
      description: p.lesson.course.title,
      date: (p.completedAt || new Date()).toISOString(),
    });
  }

  for (const s of submissionItems) {
    activities.push({
      id: `s-${s.id}`,
      type: "submission",
      title: `${s.status === "accepted" ? "Solved" : "Attempted"}: ${s.problem.title}`,
      description: `${s.problem.difficulty} problem`,
      date: s.createdAt.toISOString(),
      passed: s.status === "accepted",
    });
  }

  // Sort by date descending, take 20
  activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return NextResponse.json(activities.slice(0, 20));
  } catch (error) {
    console.error("Error fetching activity:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
