import prisma from "@/lib/prisma";

export interface BossChallengeState {
  available: boolean;
  completed: boolean;
  problem: {
    id: string;
    title: string;
    difficulty: string;
    slug: string;
    patternTags: string;
  } | null;
  nextAvailableAt: Date | null;
  bossProblemsWon: number;
}

const BOSS_COOLDOWN_DAYS = 7;

export async function getBossChallengeState(userId: string): Promise<BossChallengeState> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      lastBossCompletedAt: true,
      bossProblemsWon: true,
      currentPhase: true,
    },
  });

  if (!user) {
    return { available: false, completed: false, problem: null, nextAvailableAt: null, bossProblemsWon: 0 };
  }

  const now = new Date();
  let completed = false;
  let nextAvailableAt: Date | null = null;

  if (user.lastBossCompletedAt) {
    const cooldownEnd = new Date(user.lastBossCompletedAt);
    cooldownEnd.setDate(cooldownEnd.getDate() + BOSS_COOLDOWN_DAYS);
    if (cooldownEnd > now) {
      completed = true;
      nextAvailableAt = cooldownEnd;
    }
  }

  if (completed) {
    return { available: false, completed: true, problem: null, nextAvailableAt, bossProblemsWon: user.bossProblemsWon };
  }

  // Pick a hard problem from the user's current phase that they haven't mastered
  const problem = await prisma.problem.findFirst({
    where: {
      difficulty: "Hard",
      phase: user.currentPhase,
    },
    select: {
      id: true,
      title: true,
      difficulty: true,
      slug: true,
      pattern: true,
    },
    orderBy: { createdAt: "asc" },
  });

  const mappedProblem = problem ? {
    id: problem.id,
    title: problem.title,
    difficulty: problem.difficulty,
    slug: problem.slug,
    patternTags: problem.pattern ?? "",
  } : null;

  return {
    available: !!problem,
    completed: false,
    problem: mappedProblem,
    nextAvailableAt: null,
    bossProblemsWon: user.bossProblemsWon,
  };
}

export async function completeBossChallenge(userId: string): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: {
      lastBossCompletedAt: new Date(),
      bossProblemsWon: { increment: 1 },
    },
  });
}
