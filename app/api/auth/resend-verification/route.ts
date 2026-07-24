import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import prisma from "@/lib/prisma";
import { sendVerificationCodeEmail } from "@/lib/email";

const attempts = new Map<string, { count: number; resetAt: number }>();
const genericResponse = { success: true, message: "If the account needs verification, a new code has been sent." };

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    if (typeof email !== "string") return NextResponse.json(genericResponse);

    const normalizedEmail = email.toLowerCase().trim();
    const now = Date.now();
    const previous = attempts.get(normalizedEmail);
    if (previous && previous.resetAt > now && previous.count >= 3) {
      return NextResponse.json({ error: "Too many requests. Please wait 15 minutes." }, { status: 429 });
    }
    attempts.set(normalizedEmail, {
      count: previous && previous.resetAt > now ? previous.count + 1 : 1,
      resetAt: now + 15 * 60 * 1000,
    });

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: { id: true, emailVerified: true },
    });
    if (!user || user.emailVerified) return NextResponse.json(genericResponse);

    const code = String(crypto.randomInt(100000, 1000000));
    await prisma.user.update({
      where: { id: user.id },
      data: {
        verificationToken: await bcrypt.hash(code, 12),
        verificationExpiry: new Date(now + 60 * 60 * 1000),
      },
    });
    const delivery = await sendVerificationCodeEmail(normalizedEmail, code);
    if (!delivery.sent) {
      console.error("[resend-verification] Email delivery failed", delivery.error);
      return NextResponse.json({ error: "We could not send a verification email. Please try again shortly." }, { status: 503 });
    }
    return NextResponse.json(genericResponse);
  } catch (error) {
    console.error("[resend-verification]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
