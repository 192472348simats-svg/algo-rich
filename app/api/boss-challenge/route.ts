import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getBossChallengeState, completeBossChallenge } from "@/lib/bossChallenge";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const state = await getBossChallengeState(session.user.id);
    return NextResponse.json(state);
  } catch (error) {
    console.error("[boss-challenge GET]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await completeBossChallenge(session.user.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[boss-challenge POST]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
