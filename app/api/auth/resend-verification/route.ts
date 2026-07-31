import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import prisma from "@/lib/prisma";
import { sendVerificationCodeEmail } from "@/lib/email";
import { clientAddress, enforceRateLimit } from "@/lib/rateLimit";

const genericResponse = { success: true, message: "If the account needs verification, a new code has been sent." };

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 3 attempts per 15 min per IP (shared/Upstash when available)
    const limit = await enforceRateLimit({
      scope: "resend-verification",
      identifier: clientAddress(request.headers),
      limit: 3,
      windowMs: 15 * 60 * 1000,
    });
    if (!limit.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please wait 15 minutes." },
        { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
      );
    }

    const { email } = await request.json();
    if (typeof email !== "string") return NextResponse.json(genericResponse);

    const normalizedEmail = email.toLowerCase().trim();

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
        verificationExpiry: new Date(Date.now() + 60 * 60 * 1000),
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
