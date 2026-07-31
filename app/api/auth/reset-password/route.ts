import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { isValidPassword, passwordPolicyMessage } from "@/lib/passwordPolicy";
import { clientAddress, enforceRateLimit } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  try {
    // Rate limit: 5 attempts per 15 min per IP
    const limit = await enforceRateLimit({
      scope: "reset-password",
      identifier: clientAddress(req.headers),
      limit: 5,
      windowMs: 15 * 60 * 1000,
    });
    if (!limit.allowed) {
      return NextResponse.json(
        { error: "Too many attempts. Please try again later." },
        { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
      );
    }

    const { email, token, password } = await req.json();

    if (typeof email !== "string" || typeof token !== "string" || !isValidPassword(password)) {
      if (typeof password === "string" && !isValidPassword(password)) {
        return NextResponse.json({ error: passwordPolicyMessage }, { status: 400 });
      }
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const hashedIncomingToken = crypto.createHash("sha256").update(token).digest("hex");
    const newHashedPassword = await bcrypt.hash(password, 12);

    // The token comparison and consumption happen in one database write, so two
    // concurrent reset requests cannot both succeed with the same token.
    const updated = await prisma.user.updateMany({
      where: {
        email: email.toLowerCase().trim(),
        resetToken: hashedIncomingToken,
        resetTokenExpiry: { gte: new Date() },
      },
      data: {
        password: newHashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    if (updated.count !== 1) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[reset-password]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
