import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import PracticeContent from "./PracticeContent";

export const dynamic = 'force-dynamic'


export default async function PracticePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/signin");

  const [problems, submissions] = await Promise.all([
    prisma.problem.findMany({
      orderBy: [{ topicOrder: "asc" }, { title: "asc" }],
      include: {
        lessons: {
          include: {
            lesson: {
              select: {
                id: true,
                slug: true,
                title: true,
              },
            },
          },
        },
      },
    }),
    prisma.submission.findMany({
      where: { userId: session.user.id, status: "accepted" },
      select: { problemId: true },
    }),
  ]);

  const solvedIds = new Set(submissions.map((s) => s.problemId));

  const problemsWithStatus = problems.map((p) => ({
    id: p.id,
    title: p.title,
    description: p.description,
    difficulty: p.difficulty,
    category: p.pattern || "DSA",
    phase: p.phase,
    isSolved: solvedIds.has(p.id),
    topics: p.topics ? JSON.parse(p.topics) : [],
    topicOrder: p.topicOrder,
    connectedLessons: p.lessons.map((lp) => lp.lesson),
  }));

  return <PracticeContent problems={problemsWithStatus} />;
}
