import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import {
  getLessonEngagementCookieConfig,
  getLessonEngagementCookieName,
  getLessonEngagementProgress,
  parseLessonEngagement,
} from "@/lib/lessonEngagement";
import {
  MIN_LESSON_SECONDS,
  MIN_SCROLL_PERCENT,
} from "@/lib/lessonEngagement.shared";

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { lessonId } = await request.json();

    if (!lessonId) {
      return NextResponse.json(
        { error: "lessonId is required" },
        { status: 400 }
      );
    }

    // Verify lesson exists
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
    });

    if (!lesson) {
      return NextResponse.json(
        { error: "Lesson not found" },
        { status: 404 }
      );
    }

    // Check current mastery level to avoid downgrading
    const existing = await prisma.progress.findUnique({
      where: {
        userId_lessonId: {
          userId: session.user.id,
          lessonId,
        },
      },
    });

    if (!existing?.completed) {
      const cookieStore = await cookies();
      const cookieName = getLessonEngagementCookieName(lessonId);
      const engagementState = parseLessonEngagement(
        cookieStore.get(cookieName)?.value
      );

      let engagementProgress = null;
      if (
        engagementState &&
        engagementState.lessonId === lessonId &&
        engagementState.userId === session.user.id
      ) {
        engagementProgress = getLessonEngagementProgress(engagementState);
      }

      if (!engagementProgress?.canComplete) {
        return NextResponse.json(
          {
            error: "Lesson engagement requirements not met",
            progress: engagementProgress ?? {
              elapsedSeconds: 0,
              maxScrollPct: 0,
              canComplete: false,
            },
            requirements: {
              minSeconds: MIN_LESSON_SECONDS,
              minScrollPct: MIN_SCROLL_PERCENT,
            },
          },
          { status: 403 }
        );
      }
    }

    const masteryRank: Record<string, number> = {
      none: 0,
      read: 1,
      practiced: 2,
      mastered: 3,
    };

    // Set mastery to at least "read" when completing a lesson
    const currentMastery = existing?.masteryLevel || "none";
    const newMastery =
      (masteryRank[currentMastery] ?? 0) >= masteryRank["read"]
        ? currentMastery
        : "read";

    // Upsert progress
    const progress = await prisma.progress.upsert({
      where: {
        userId_lessonId: {
          userId: session.user.id,
          lessonId,
        },
      },
      update: {
        completed: true,
        completedAt: new Date(),
        masteryLevel: newMastery,
      },
      create: {
        userId: session.user.id,
        lessonId,
        completed: true,
        completedAt: new Date(),
        masteryLevel: "read",
      },
    });

    const response = NextResponse.json(progress);
    response.cookies.set(
      getLessonEngagementCookieName(lessonId),
      "",
      {
        ...getLessonEngagementCookieConfig(),
        maxAge: 0,
      }
    );

    return response;
  } catch (error) {
    console.error("Error updating progress:", error);
    return NextResponse.json(
      { error: "Failed to update progress" },
      { status: 500 }
    );
  }
}
