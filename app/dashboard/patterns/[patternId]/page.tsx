import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getPattern } from "@/lib/patterns/patternDefinitions";
import PatternDetailContent from "./PatternDetailContent";

export const dynamic = 'force-dynamic'

interface PatternDetailPageProps {
  params: Promise<{ patternId: string }>;
}

export default async function PatternDetailPage({
  params,
}: PatternDetailPageProps) {
  const session = await auth();
  if (!session?.user?.id) redirect("/signin");

  const { patternId } = await params;
  const pattern = getPattern(patternId);
  if (!pattern) notFound();

  // Fetch user's progress for this pattern
  const progress = await prisma.patternProgress.findUnique({
    where: {
      userId_patternSlug: {
        userId: session.user.id,
        patternSlug: patternId,
      },
    },
  });

  return (
    <PatternDetailContent
      pattern={pattern}
      progress={
        progress
          ? {
              status: progress.status,
              visualizationWatched: progress.visualizationWatched,
              templateStudied: progress.templateStudied,
              quizPassed: progress.quizPassed,
              problemsSolved: progress.problemsSolved,
            }
          : null
      }
      userId={session.user.id}
    />
  );
}
