import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

/**
 * GET /api/reviews/[problemId]/solution
 * Returns the user's most recent accepted solution for review reference.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ problemId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { problemId } = await params;

    // Get the most recent accepted submission
    const submission = await prisma.submission.findFirst({
      where: {
        userId: session.user.id,
        problemId,
        status: "accepted",
      },
      orderBy: { createdAt: "desc" },
      select: {
        code: true,
        language: true,
        createdAt: true,
      },
    });

    if (!submission) {
      return NextResponse.json(
        { error: "No accepted solution found" },
        { status: 404 }
      );
    }

    return NextResponse.json(submission);
  } catch (error) {
    console.error("Error fetching solution:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
