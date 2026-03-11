import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

const signupRateLimit = new Map<string, { count: number; resetAt: number }>();

/** Generate a cryptographically adequate 6-digit OTP */
function generateOTP(): string {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return String(array[0] % 1_000_000).padStart(6, "0");
}

export async function POST(request: Request) {
  try {
    const ip =
      (request.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const now = Date.now();
    const window = 15 * 60 * 1000; // 15 minutes
    const entry = signupRateLimit.get(ip);
    if (entry && now < entry.resetAt) {
      if (entry.count >= 5) {
        return Response.json(
          { error: "Too many signup attempts. Try again in 15 minutes." },
          { status: 429 }
        );
      }
      entry.count++;
    } else {
      signupRateLimit.set(ip, { count: 1, resetAt: now + window });
    }

    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate 6-digit OTP (valid for 30 minutes)
    const otp = generateOTP();
    const otpHash = await bcrypt.hash(otp, 10);
    const verificationExpiry = new Date(Date.now() + 30 * 60 * 1000);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        emailVerified: false,
        verificationToken: otpHash,
        verificationExpiry,
      },
    });

    // Create default preferences so dashboard doesn't crash
    await prisma.userPreferences.create({
      data: {
        userId: user.id,
        experienceLevel: "beginner",
        learningGoal: "dsa",
        dailyGoalMins: 30,
        onboardingDone: false,
      },
    });

    return NextResponse.json(
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        verificationRequired: true,
        // In production, send OTP via email. During development, return it directly.
        // TODO: Replace with email delivery (e.g., Resend / SendGrid) before production.
        otp: process.env.NODE_ENV === "development" ? otp : undefined,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
