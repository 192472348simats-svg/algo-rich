import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const totalUsers = await prisma.user.count();
  const newUsers = await prisma.user.count({
    where: {
      createdAt: {
        gte: sevenDaysAgo,
      },
    },
  });
  const totalSubmissions = await prisma.submission.count();
  const completedSessions = await prisma.sessionProgress.count({
    where: {
      completed: true,
    },
  });
  const totalXP = await prisma.user.aggregate({
    _sum: {
      totalXP: true,
    },
  });

  console.log(JSON.stringify({
    totalUsers,
    newUsers,
    totalSubmissions,
    completedSessions,
    totalXP: totalXP._sum.totalXP || 0,
  }, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
