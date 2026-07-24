import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { isValidPassword, passwordPolicyMessage } from "@/lib/passwordPolicy";
import crypto from "crypto";
import { sendVerificationCodeEmail } from "@/lib/email";
import { clientAddress, enforceRateLimit } from "@/lib/rateLimit";

export async function POST(request: Request) {
  try {
    const limit = await enforceRateLimit({
      scope: "signup",
      identifier: clientAddress(request.headers),
      limit: 5,
      windowMs: 15 * 60 * 1000,
    });
    if (!limit.allowed) {
      return NextResponse.json(
        { error: "Too many signup attempts. Try again in 15 minutes." },
        { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
      );
    }

    const { name, email, password } = await request.json();

    if (typeof name !== "string" || typeof email !== "string" || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    // Block temporary email domains
    const blockedDomains = [
      "tempmail.com", "throwawaymail.com", "guerrillamail.com", 
      "mailinator.com", "10minutemail.com", "yopmail.com"
    ];
    const normalizedEmail = email.toLowerCase().trim();
    const domain = normalizedEmail.split("@")[1];
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail) || !domain) {
      return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 });
    }
    if (blockedDomains.includes(domain)) {
      return NextResponse.json(
        { error: "Please use a permanent email address." },
        { status: 400 }
      );
    }

    if (!isValidPassword(password)) {
      return NextResponse.json(
        { error: passwordPolicyMessage },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const verificationCode = String(crypto.randomInt(100000, 1000000));
    const verificationToken = await bcrypt.hash(verificationCode, 12);
    const verificationExpiry = new Date(Date.now() + 60 * 60 * 1000);

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        emailVerified: false,
        verificationToken,
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

    const verificationEmail = await sendVerificationCodeEmail(normalizedEmail, verificationCode);
    if (!verificationEmail.sent) {
      await prisma.user.delete({ where: { id: user.id } });
      console.error("[signup] Verification email failed", verificationEmail.error);
      return NextResponse.json(
        { error: "We could not send a verification email. Please try again shortly." },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        success: true,
        verificationRequired: true,
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


