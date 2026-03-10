import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import PatternsPageContent from "./PatternsPageContent";

export default async function PatternsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/signin");

  // Fetch user's pattern progress
  const progress = await prisma.patternProgress.findMany({
    where: { userId: session.user.id },
  });

  const patternProgress: Record<
    string,
    {
      status: string;
      visualizationWatched: boolean;
      templateStudied: boolean;
      quizPassed: boolean;
      problemsSolved: number;
    }
  > = {};

  progress.forEach((p) => {
    patternProgress[p.patternSlug] = {
      status: p.status,
      visualizationWatched: p.visualizationWatched,
      templateStudied: p.templateStudied,
      quizPassed: p.quizPassed,
      problemsSolved: p.problemsSolved,
    };
  });

  return <PatternsPageContent patternProgress={patternProgress} />;
}
