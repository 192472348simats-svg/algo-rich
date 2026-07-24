import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { isValidPassword, passwordPolicyMessage } from "@/lib/passwordPolicy";

function isValidTimeZone(value: string): boolean {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: value });
    return true;
  } catch {
    return false;
  }
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, name: true, email: true, timeZone: true, createdAt: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, currentPassword, newPassword, timeZone } = body;

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {};

    // Update name if provided
    if (name && typeof name === "string" && name.trim().length > 0) {
      updateData.name = name.trim();
    }

    if (timeZone !== undefined) {
      if (typeof timeZone !== "string" || !isValidTimeZone(timeZone)) {
        return NextResponse.json({ error: "Invalid timezone" }, { status: 400 });
      }
      updateData.timeZone = timeZone;
    }

    // Update password if provided
    if (currentPassword && newPassword) {
      if (!isValidPassword(newPassword)) {
        return NextResponse.json(
          { error: passwordPolicyMessage },
          { status: 400 }
        );
      }

      if (!user.password) {
        return NextResponse.json(
          { error: "Password change not supported for this account" },
          { status: 400 }
        );
      }

      const isValid = await bcrypt.compare(currentPassword, user.password);
      if (!isValid) {
        return NextResponse.json(
          { error: "Current password is incorrect" },
          { status: 400 }
        );
      }

      updateData.password = await bcrypt.hash(newPassword, 12);
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "No changes provided" }, { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
      select: { id: true, name: true, email: true, timeZone: true },
    });

    return NextResponse.json({ message: "Settings updated", user: updated });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Delete all user data atomically
    await prisma.$transaction([
      prisma.cardReview.deleteMany({ where: { userId: session.user.id } }),
      prisma.submission.deleteMany({ where: { userId: session.user.id } }),
      prisma.progress.deleteMany({ where: { userId: session.user.id } }),
      prisma.patternProgress.deleteMany({ where: { userId: session.user.id } }),
      prisma.flashCard.deleteMany({ where: { userId: session.user.id } }),
      prisma.quizResult.deleteMany({ where: { userId: session.user.id } }),
      prisma.userPreferences.deleteMany({ where: { userId: session.user.id } }),
      prisma.feedback.deleteMany({ where: { userId: session.user.id } }),
      prisma.user.delete({ where: { id: session.user.id } }),
    ]);

    return NextResponse.json({ message: "Account deleted" });
  } catch (error) {
    console.error("Error deleting account:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
