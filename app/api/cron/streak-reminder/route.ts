import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendStreakReminderEmail } from "@/lib/email";

export async function GET(request: Request) {
  // Simple auth check via query param or header
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find users with an email
    const users = await prisma.user.findMany({
      where: {
        email: { not: "" },
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
      take: 100,
    });

    let remindedCount = 0;
    let sentCount = 0;
    let failedCount = 0;

    for (const user of users) {
      if (!user.email) continue;

      // Check if user practiced today via session or submission
      const [todaySession, todaySubmission] = await Promise.all([
        prisma.sessionProgress.findFirst({
          where: {
            userId: user.id,
            completedAt: { gte: today },
          },
        }),
        prisma.submission.findFirst({
          where: {
            userId: user.id,
            createdAt: { gte: today },
          },
        }),
      ]);

      // If they haven't practiced today, send a reminder
      if (!todaySession && !todaySubmission) {
        remindedCount++;
        const result = await sendStreakReminderEmail(
          user.email,
          user.name || "Developer",
          1 // Active streak momentum
        );

        if (result.sent) {
          sentCount++;
        } else {
          failedCount++;
        }
      }
    }

    return NextResponse.json({
      success: true,
      totalChecked: users.length,
      remindedCount,
      sentCount,
      failedCount,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
