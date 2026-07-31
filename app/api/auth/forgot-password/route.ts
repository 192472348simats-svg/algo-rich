import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";
import { sendPasswordResetEmail } from "@/lib/email";
import { clientAddress, enforceRateLimit } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  try {
    const ip = clientAddress(req.headers);

    // Rate limit: 3 attempts per 15 min per IP (shared/Upstash when available)
    const limit = await enforceRateLimit({
      scope: "forgot-password",
      identifier: ip,
      limit: 3,
      windowMs: 15 * 60 * 1000,
    });
    if (!limit.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Try again in 15 minutes." },
        { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
      );
    }

    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Artificial Delay (Timing Attack Mitigation)
    await new Promise(resolve => setTimeout(resolve, 1000));

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: { id: true, email: true },
    });

    // Even if user is not found, we don't return an error to prevent email enumeration
    if (user) {
      const resetToken = crypto.randomBytes(32).toString("hex");
      const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
      
      // Token expires in 1 hour
      const resetTokenExpiry = new Date();
      resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1);

      await prisma.user.update({
        where: { id: user.id },
        data: {
          resetToken: hashedToken,
          resetTokenExpiry: resetTokenExpiry,
        },
      });

      const appBaseUrl =
        process.env.NEXTAUTH_URL || process.env.AUTH_URL || req.nextUrl.origin;
      const resetUrl = `${appBaseUrl}/reset-password?token=${resetToken}&email=${encodeURIComponent(normalizedEmail)}`;

      const emailResult = await sendPasswordResetEmail(normalizedEmail, resetUrl);

      if (!emailResult.sent) {
        console.warn(
          `[forgot-password] Email not sent via ${emailResult.provider}: ${emailResult.error || "unknown error"}`
        );
      }
    }

    return NextResponse.json({ success: true, message: "If an account exists, a reset link has been sent." });
  } catch (error) {
    console.error("[forgot-password]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
