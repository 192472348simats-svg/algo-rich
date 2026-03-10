import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET /api/user/preferences — Get user preferences
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let preferences = await prisma.userPreferences.findUnique({
      where: { userId: session.user.id },
    });

    // Create default preferences if none exist
    if (!preferences) {
      preferences = await prisma.userPreferences.create({
        data: {
          userId: session.user.id,
          experienceLevel: "beginner",
          learningGoal: "both",
        },
      });
    }

    return NextResponse.json(preferences);
  } catch (error) {
    console.error("Error fetching preferences:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH /api/user/preferences — Update user preferences
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const allowedFields = [
      "experienceLevel",
      "learningGoal",
      "dailyGoalMins",
      "onboardingDone",
    ];

    const updateData: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    const preferences = await prisma.userPreferences.upsert({
      where: { userId: session.user.id },
      update: updateData,
      create: {
        userId: session.user.id,
        experienceLevel: (updateData.experienceLevel as string) || "beginner",
        learningGoal: (updateData.learningGoal as string) || "both",
        ...(updateData.dailyGoalMins !== undefined ? { dailyGoalMins: updateData.dailyGoalMins as number } : {}),
        ...(updateData.onboardingDone !== undefined ? { onboardingDone: updateData.onboardingDone as boolean } : {}),
      },
    });

    return NextResponse.json(preferences);
  } catch (error) {
    console.error("Error updating preferences:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
