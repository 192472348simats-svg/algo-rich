import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";
import { sendPasswordResetEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true },
    });

    // Even if user is not found, we don't return an error to prevent email enumeration
    if (user) {
      const resetToken = crypto.randomBytes(32).toString("hex");
      const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
      
      // Token expires in 1 hour
      const resetTokenExpiry = new Date();
      resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1);

      await prisma.$executeRaw`
        UPDATE "User"
        SET "resetToken" = ${hashedToken}, "resetTokenExpiry" = ${resetTokenExpiry}
        WHERE "id" = ${user.id}
      `;

      const appBaseUrl =
        process.env.NEXTAUTH_URL || process.env.AUTH_URL || req.nextUrl.origin;
      const resetUrl = `${appBaseUrl}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;

      const emailResult = await sendPasswordResetEmail(email, resetUrl);

      if (!emailResult.sent) {
        console.warn(
          `[forgot-password] Email not sent via ${emailResult.provider}: ${emailResult.error || "unknown error"}`
        );
        console.log(
          `\n[FORGOT PASSWORD FALLBACK LINK] ${email}\n${resetUrl}\n`
        );
      }
    }

    return NextResponse.json({ success: true, message: "If an account exists, a reset link has been sent." });
  } catch (error) {
    console.error("[forgot-password]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
