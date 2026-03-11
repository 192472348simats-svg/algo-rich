import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

/**
 * POST /api/auth/verify-email
 * Body: { email: string; otp: string }
 * Validates the 6-digit OTP and marks the user as emailVerified.
 */
export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp || typeof otp !== "string" || otp.length !== 6) {
      return NextResponse.json(
        { error: "email and a 6-digit otp are required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        emailVerified: true,
        verificationToken: true,
        verificationExpiry: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.emailVerified) {
      return NextResponse.json({ message: "Email already verified" });
    }

    if (!user.verificationToken || !user.verificationExpiry) {
      return NextResponse.json(
        { error: "No pending verification. Request a new code." },
        { status: 400 }
      );
    }

    if (new Date() > user.verificationExpiry) {
      return NextResponse.json(
        { error: "Verification code has expired. Please sign up again." },
        { status: 400 }
      );
    }

    const otpValid = await bcrypt.compare(otp, user.verificationToken);
    if (!otpValid) {
      return NextResponse.json(
        { error: "Invalid verification code." },
        { status: 400 }
      );
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verificationToken: null,
        verificationExpiry: null,
      },
    });

    return NextResponse.json({ success: true, message: "Email verified successfully!" });
  } catch (error) {
    console.error("verify-email error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
