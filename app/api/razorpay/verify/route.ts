import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";

/**
 * POST /api/razorpay/verify
 *
 * Verifies a Razorpay payment after the client-side checkout completes.
 * The client sends the payment details from the Razorpay popup callback.
 *
 * Body:
 *   For orders:
 *     { razorpay_order_id, razorpay_payment_id, razorpay_signature }
 *   For subscriptions:
 *     { razorpay_subscription_id, razorpay_payment_id, razorpay_signature }
 */
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_subscription_id,
    razorpay_signature,
  } = body as {
    razorpay_order_id?: string;
    razorpay_payment_id?: string;
    razorpay_subscription_id?: string;
    razorpay_signature?: string;
  };

  if (!razorpay_payment_id || !razorpay_signature) {
    return NextResponse.json({ error: "Missing payment verification fields" }, { status: 400 });
  }

  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }

  try {
    // ── Verify signature ──────────────────────────────────────────
    let expectedSignature: string;

    if (razorpay_subscription_id) {
      // Subscription payment verification
      expectedSignature = crypto
        .createHmac("sha256", secret)
        .update(`${razorpay_payment_id}|${razorpay_subscription_id}`)
        .digest("hex");
    } else if (razorpay_order_id) {
      // One-time order payment verification
      expectedSignature = crypto
        .createHmac("sha256", secret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");
    } else {
      return NextResponse.json({ error: "Missing order_id or subscription_id" }, { status: 400 });
    }

    if (expectedSignature !== razorpay_signature) {
      console.error("[Razorpay Verify] Signature mismatch");
      return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
    }

    // ── Payment verified — update user subscription ──────────────
    const updateData: Record<string, unknown> = {
      razorpayCustomerId: razorpay_payment_id, // Track payment reference
    };

    if (razorpay_subscription_id) {
      // Subscription: set a 30-day period (webhooks will keep it updated)
      updateData.razorpaySubscriptionId = razorpay_subscription_id;
      updateData.razorpayCurrentPeriodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    } else {
      // One-time payment: grant lifetime or 1-year access
      updateData.razorpaySubscriptionId = `order_${razorpay_order_id}`;
      updateData.razorpayCurrentPeriodEnd = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
    });

    return NextResponse.json({ success: true, message: "Payment verified and subscription activated!" });
  } catch (error) {
    console.error("[Razorpay Verify Error]", error);
    return NextResponse.json(
      { error: "Payment verification failed. Please contact support." },
      { status: 500 }
    );
  }
}
