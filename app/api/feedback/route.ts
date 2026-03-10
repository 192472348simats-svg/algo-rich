import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await auth();

    const body = await request.json();
    const { type, message, page } = body;

    if (!message || !type) {
      return NextResponse.json(
        { error: "Type and message are required" },
        { status: 400 }
      );
    }

    // Persist feedback to database
    const userId = session?.user?.id;
    await prisma.feedback.create({
      data: {
        type,
        message,
        page: page || null,
        userId: userId || null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error handling feedback:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
