import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import PathContent from "./PathContent";

export const dynamic = 'force-dynamic'


interface UserData {
  currentPhase: number;
  currentWeek: number;
  phaseStartedAt?: Date | null;
  phase1CompletedAt?: Date | null;
  phase2CompletedAt?: Date | null;
  phase3CompletedAt?: Date | null;
  phase4CompletedAt?: Date | null;
}

const phaseDefinitions = [
  {
    phase: 1,
    name: "Python Foundations",
    subtitle: "Variables, loops, functions, and data structures",
    weeks: "Weeks 1–4",
    weekRange: [1, 4],
    icon: "🐍",
    color: "from-gold-primary to-gold-light",
    borderColor: "border-gold-primary/40",
    bgColor: "bg-gold-primary/10",
  },
  {
    phase: 2,
    name: "Logic Building",
    subtitle: "The 5-step framework, brute-force thinking",
    weeks: "Weeks 5–8",
    weekRange: [5, 8],
    icon: "🧩",
    color: "from-blue-500 to-blue-600",
    borderColor: "border-blue-500/40",
    bgColor: "bg-blue-500/10",
  },
  {
    phase: 3,
    name: "Data Structures",
    subtitle: "Arrays, linked lists, trees, graphs, heaps",
    weeks: "Weeks 9–16",
    weekRange: [9, 16],
    icon: "🏗️",
    color: "from-emerald-500 to-emerald-600",
    borderColor: "border-emerald-500/40",
    bgColor: "bg-emerald-500/10",
  },
  {
    phase: 4,
    name: "Patterns & Algorithms",
    subtitle: "Two pointers, sliding window, DP, backtracking",
    weeks: "Weeks 17–24",
    weekRange: [17, 24],
    icon: "⚡",
    color: "from-purple-500 to-purple-600",
    borderColor: "border-purple-500/40",
    bgColor: "bg-purple-500/10",
  },
  {
    phase: 5,
    name: "Interview Ready",
    subtitle: "Mock interviews, company prep, time pressure",
    weeks: "Weeks 25–30",
    weekRange: [25, 30],
    icon: "🎯",
    color: "from-red-500 to-red-600",
    borderColor: "border-red-500/40",
    bgColor: "bg-red-500/10",
  },
];

function buildPhases(
  userData: UserData,
  phaseProblems: { phase: number; _count: { id: number } }[],
  solvedIds: Set<string>,
  problemsByPhase: Record<number, Record<number, { id: string; slug: string; title: string; difficulty: string; solved: boolean }[]>>,
  solvedByPhase: Record<number, number>
) {
  return phaseDefinitions.map((p) => {
    const total = phaseProblems.find((pp) => pp.phase === p.phase)?._count.id ?? 0;
    const solved = solvedByPhase[p.phase] ?? 0;
    const completedAtKey = p.phase < 5 ? (`phase${p.phase}CompletedAt` as keyof UserData) : null;

    const weekProblems: Record<number, { id: string; slug: string; title: string; difficulty: string; solved: boolean }[]> = {};
    const phaseData = problemsByPhase[p.phase] || {};
    for (let w = p.weekRange[0]; w <= p.weekRange[1]; w++) {
      weekProblems[w] = phaseData[w] || [];
    }

    return {
      ...p,
      totalProblems: total,
      solvedProblems: solved,
      progress: total > 0 ? Math.round((solved / total) * 100) : 0,
      completedAt: completedAtKey ? (userData[completedAtKey] as Date | null) : null,
      status: (
        p.phase < userData.currentPhase
          ? "completed"
          : p.phase === userData.currentPhase
            ? "current"
            : "locked"
      ) as "completed" | "current" | "locked",
      weekProblems,
    };
  });
}

export default async function LearningPathPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/signin");
  }

  const userId = session.user.id;

  let user: UserData | null = null;
  let phaseProblems: { phase: number; _count: { id: number } }[] = [];
  let solvedSubmissions: { problemId: string }[] = [];
  let allProblemsRaw: {
    id: string;
    slug: string;
    title: string;
    difficulty: string;
    phase: number;
    weekNumber: number;
    order: number;
  }[] = [];

  try {
    [user, phaseProblems, solvedSubmissions, allProblemsRaw] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          currentPhase: true,
          currentWeek: true,
          phaseStartedAt: true,
          phase1CompletedAt: true,
          phase2CompletedAt: true,
          phase3CompletedAt: true,
          phase4CompletedAt: true,
        },
      }),
      prisma.problem.groupBy({
        by: ["phase"],
        _count: { id: true },
      }),
      prisma.submission.findMany({
        where: { userId, status: "accepted" },
        select: { problemId: true },
        distinct: ["problemId"],
      }),
      prisma.problem.findMany({
        where: { isActive: true },
        select: {
          id: true,
          slug: true,
          title: true,
          difficulty: true,
          phase: true,
          weekNumber: true,
          order: true,
        },
        orderBy: [{ phase: "asc" }, { weekNumber: "asc" }, { order: "asc" }],
      }),
    ]);
  } catch (error) {
    console.warn("[LearningPathPage] DB unavailable; using empty path.", error instanceof Error ? error.message : error);
  }

  if (!user) {
    // Default user data if not found — don't redirect, just show phase 1
    const defaultUser = {
      currentPhase: 1,
      currentWeek: 1,
      phaseStartedAt: null,
      phase1CompletedAt: null,
      phase2CompletedAt: null,
      phase3CompletedAt: null,
      phase4CompletedAt: null,
    };
    const phases = buildPhases(defaultUser, phaseProblems, new Set(), {}, {});
    return (
      <PathContent
        phases={phases}
        currentPhase={1}
        currentWeek={1}
      />
    );
  }

  // Ensure defaults for null values
  const safeUser = {
    ...user,
    currentPhase: user.currentPhase ?? 1,
    currentWeek: user.currentWeek ?? 1,
  };

  // Build solved set
  const solvedIds = new Set(solvedSubmissions.map((s) => s.problemId));
  const solvedByPhase: Record<number, number> = {};

  // Organize problems by phase and week, mark solved status
  const problemsByPhase: Record<
    number,
    Record<
      number,
      {
        id: string;
        slug: string;
        title: string;
        difficulty: string;
        solved: boolean;
      }[]
    >
  > = {};

  for (const p of allProblemsRaw) {
    if (!problemsByPhase[p.phase]) problemsByPhase[p.phase] = {};
    if (!problemsByPhase[p.phase][p.weekNumber])
      problemsByPhase[p.phase][p.weekNumber] = [];

    const solved = solvedIds.has(p.id);
    if (solved) {
      solvedByPhase[p.phase] = (solvedByPhase[p.phase] || 0) + 1;
    }

    problemsByPhase[p.phase][p.weekNumber].push({
      id: p.id,
      slug: p.slug,
      title: p.title,
      difficulty: p.difficulty,
      solved,
    });
  }

  const phases = buildPhases(safeUser, phaseProblems, solvedIds, problemsByPhase, solvedByPhase);

  return (
    <PathContent
      phases={phases}
      currentPhase={safeUser.currentPhase}
      currentWeek={safeUser.currentWeek}
    />
  );
}
