import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { parseAndNormalizeTestCases } from "@/lib/types/problem";
import ProblemSolver from "./ProblemSolver";
import { ErrorBoundary } from "@/app/components/ErrorBoundary";

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ problemId: string }>;
}

export default async function ProblemPage({ params }: Props) {
  const session = await auth();
  if (!session?.user?.id) redirect("/signin");

  const { problemId } = await params;

  const problem = await prisma.problem.findUnique({
    where: { id: problemId },
    include: {
      lessons: {
        orderBy: { order: "asc" },
        include: {
          lesson: {
            select: {
              id: true,
              slug: true,
              title: true,
              difficulty: true,
              courseId: true,
              course: {
                select: { title: true, category: true },
              },
            },
          },
        },
      },
    },
  });

  if (!problem) redirect("/dashboard/practice");

  // Check if user has already solved it
  const [solved, userRecord] = await Promise.all([
    prisma.submission.findFirst({
      where: { userId: session.user.id, problemId, status: "accepted" },
    }),
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { currentPhase: true },
    }),
  ]);

  // Find next problem in topic order
  let nextProblem = null;
  if (problem.topicOrder > 0) {
    nextProblem = await prisma.problem.findFirst({
      where: {
        topicOrder: { gt: problem.topicOrder },
        isActive: true,
      },
      orderBy: { topicOrder: "asc" },
      select: {
        id: true,
        slug: true,
        title: true,
        difficulty: true,
      },
    });
  }

  const testCases = parseAndNormalizeTestCases(problem.testCases);

  const hasHidden = problem.hiddenTestCases !== null && problem.hiddenTestCases !== "[]" && problem.hiddenTestCases !== "";

  const relatedLessons = problem.lessons.map((lp) => lp.lesson);

  return (
    <ErrorBoundary componentName="ProblemSolver">
      <ProblemSolver
        problem={{
          id: problem.id,
          title: problem.title,
          description: problem.description,
          difficulty: problem.difficulty,
          category: problem.pattern || "DSA",
          starterCode: problem.starterCode,
          testCases,
          hasHiddenTests: hasHidden,
          hints: problem.hints ?? undefined,
          correctPattern: problem.correctPattern ?? undefined,
          solutionApproach: problem.solutionApproach ?? undefined,
        }}
        isSolved={!!solved}
        userId={session.user.id}
        relatedLessons={relatedLessons}
        nextProblem={nextProblem}
        currentPhase={userRecord?.currentPhase ?? 3}
      />
    </ErrorBoundary>
  );
}
