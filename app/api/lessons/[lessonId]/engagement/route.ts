import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import {
  createLessonEngagementState,
  getLessonEngagementCookieConfig,
  getLessonEngagementCookieName,
  getLessonEngagementProgress,
  mergeLessonEngagementState,
  parseLessonEngagement,
  serializeLessonEngagement,
} from "@/lib/lessonEngagement";
import {
  clampScrollPercent,
  MIN_LESSON_SECONDS,
  MIN_SCROLL_PERCENT,
} from "@/lib/lessonEngagement.shared";

interface RouteContext {
  params: Promise<{ lessonId: string }>;
}

export async function POST(request: Request, { params }: RouteContext) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { lessonId } = await params;
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      select: { id: true },
    });

    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    const body = await request.json().catch(() => ({}));
    const requestedScroll = clampScrollPercent(Number(body?.maxScrollPct ?? 0));

    const cookieStore = await cookies();
    const cookieName = getLessonEngagementCookieName(lessonId);
    const existing = parseLessonEngagement(cookieStore.get(cookieName)?.value);

    const baseState =
      existing?.lessonId === lessonId && existing.userId === session.user.id
        ? existing
        : createLessonEngagementState({
            lessonId,
            userId: session.user.id,
          });

    const nextState = mergeLessonEngagementState(baseState, requestedScroll);
    const response = NextResponse.json({
      progress: getLessonEngagementProgress(nextState),
      requirements: {
        minSeconds: MIN_LESSON_SECONDS,
        minScrollPct: MIN_SCROLL_PERCENT,
      },
    });

    response.cookies.set(
      cookieName,
      serializeLessonEngagement(nextState),
      getLessonEngagementCookieConfig()
    );

    return response;
  } catch (error) {
    console.error("Error syncing lesson engagement:", error);
    return NextResponse.json(
      { error: "Failed to sync lesson engagement" },
      { status: 500 }
    );
  }
}
