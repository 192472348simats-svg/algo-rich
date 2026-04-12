import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";
import bcrypt from "bcryptjs";

interface ResetUserRow {
  id: string;
  resetToken: string | null;
  resetTokenExpiry: Date | null;
}

export async function POST(req: NextRequest) {
  try {
    const { email, token, password } = await req.json();

    if (!email || !token || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const users = await prisma.$queryRaw<ResetUserRow[]>`
      SELECT "id", "resetToken", "resetTokenExpiry"
      FROM "User"
      WHERE "email" = ${email}
      LIMIT 1
    `;
    const user = users[0] ?? null;

    if (!user || !user.resetToken || !user.resetTokenExpiry) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
    }

    if (new Date() > user.resetTokenExpiry) {
      return NextResponse.json({ error: "Token has expired" }, { status: 400 });
    }

    const hashedIncomingToken = crypto.createHash("sha256").update(token).digest("hex");

    if (hashedIncomingToken !== user.resetToken) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
    }

    const newHashedPassword = await bcrypt.hash(password, 12);

    await prisma.$executeRaw`
      UPDATE "User"
      SET
        "password" = ${newHashedPassword},
        "resetToken" = NULL,
        "resetTokenExpiry" = NULL
      WHERE "id" = ${user.id}
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[reset-password]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
