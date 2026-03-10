import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { generateDailyPlan } from "@/lib/planGenerator";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const plan = await generateDailyPlan(session.user.id);
    return NextResponse.json(plan);
  } catch (error) {
    console.error("[PLAN] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
