import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getSessionDefinition } from "@/lib/sessionDefinitions";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ sessionSlug: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sessionSlug } = await params;

    const definition = getSessionDefinition(sessionSlug);
    if (!definition) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const progress = await prisma.sessionProgress.findUnique({
      where: {
        userId_sessionSlug: {
          userId: session.user.id,
          sessionSlug,
        },
      },
    });

    return NextResponse.json({
      definition,
      progress: progress || {
        currentStageIndex: 0,
        completed: false,
        stageResults: "{}",
      },
    });
  } catch (error) {
    console.error("[SESSION GET] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
