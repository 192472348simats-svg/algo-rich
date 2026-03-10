import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { calculateReadiness } from "@/lib/readinessEngine";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const readiness = await calculateReadiness(session.user.id);
    return NextResponse.json(readiness);
  } catch (error) {
    console.error("Readiness API error:", error);
    return NextResponse.json(
      { error: "Failed to calculate readiness" },
      { status: 500 }
    );
  }
}
