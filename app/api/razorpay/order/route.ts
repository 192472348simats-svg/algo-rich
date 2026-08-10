import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { razorpay } from "@/lib/razorpay";
import prisma from "@/lib/prisma";

/**
 * POST /api/razorpay/order
 *
 * Creates a Razorpay Order for the authenticated user.
 * The client should use this order to launch the Razorpay Checkout popup.
 *
 * Body (optional):
 *   { planId?: string, amount?: number }
 *   — planId for subscription, or amount (in paise) for one-time payment
 */
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const { planId, amount } = body as { planId?: string; amount?: number };

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      email: true,
      name: true,
      razorpayCustomerId: true,
      razorpaySubscriptionId: true,
      razorpayCurrentPeriodEnd: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // If the user already has an active subscription, don't create another order
  if (
    user.razorpaySubscriptionId &&
    user.razorpayCurrentPeriodEnd &&
    user.razorpayCurrentPeriodEnd.getTime() > Date.now()
  ) {
    return NextResponse.json(
      { error: "You already have an active subscription." },
      { status: 400 }
    );
  }

  try {
    // ── Subscription mode (if planId provided) ────────────────────
    if (planId) {
      const subscription = await razorpay.subscriptions.create({
        plan_id: planId,
        customer_notify: 1,
        total_count: 12, // 12 billing cycles max
        notes: {
          userId: user.id,
          userEmail: user.email,
        },
      });

      return NextResponse.json({
        subscriptionId: subscription.id,
        key: process.env.RAZORPAY_KEY_ID,
        name: user.name,
        email: user.email,
        type: "subscription",
      });
    }

    // ── One-time payment mode (if amount provided) ────────────────
    const paymentAmount = amount || Number(process.env.RAZORPAY_DEFAULT_AMOUNT || "49900"); // Default ₹499

    const order = await razorpay.orders.create({
      amount: paymentAmount,
      currency: "INR",
      receipt: `algo_rich_${user.id}_${Date.now()}`,
      notes: {
        userId: user.id,
        userEmail: user.email,
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
      name: user.name,
      email: user.email,
      type: "order",
    });
  } catch (error) {
    console.error("[Razorpay Order Error]", error);
    return NextResponse.json(
      { error: "Failed to create payment order. Please try again." },
      { status: 500 }
    );
  }
}
