import prisma from "@/lib/prisma";

// ── User helpers ───────────────────────────────────────────────
export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function getUserById(id: string) {
  return prisma.user.findUnique({ where: { id } });
}

// ── Progress helpers ───────────────────────────────────────────
export async function getLessonsCompleted(userId: string) {
  return prisma.progress.count({
    where: { userId, completed: true },
  });
}

export async function getProblemsSolved(userId: string) {
  return prisma.submission.count({
    where: { userId, status: "accepted" },
  });
}

export async function getRecentProgress(userId: string) {
  return prisma.progress.findMany({
    where: { userId },
    include: { lesson: { include: { course: true } } },
    orderBy: { completedAt: "desc" },
    take: 5,
  });
}

// ── Course helpers ─────────────────────────────────────────────
export async function getCourses() {
  return prisma.course.findMany({
    orderBy: { order: "asc" },
    include: {
      lessons: {
        orderBy: { order: "asc" },
      },
    },
  });
}

export async function getCourseProgress(userId: string, courseId: string) {
  const totalLessons = await prisma.lesson.count({
    where: { courseId },
  });
  const completedLessons = await prisma.progress.count({
    where: {
      userId,
      completed: true,
      lesson: { courseId },
    },
  });
  return { totalLessons, completedLessons };
}
