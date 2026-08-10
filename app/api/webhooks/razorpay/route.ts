import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";

/**
 * POST /api/webhooks/razorpay
 *
 * Handles Razorpay webhook events for subscription lifecycle management.
 * Razorpay sends events like payment.captured, subscription.activated,
 * subscription.charged, subscription.cancelled, etc.
 */
export async function POST(req: Request) {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const signature = req.headers.get("X-Razorpay-Signature");

  if (!webhookSecret || !signature) {
    return new NextResponse("Webhook configuration or signature is missing", { status: 400 });
  }

  const rawBody = await req.text();

  // ── Verify webhook signature ──────────────────────────────────
  const expectedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(rawBody)
    .digest("hex");

  if (expectedSignature !== signature) {
    console.error("[Razorpay Webhook] Signature verification failed");
    return new NextResponse("Invalid signature", { status: 400 });
  }

  let event: {
    event: string;
    payload: {
      payment?: { entity: Record<string, unknown> };
      subscription?: { entity: Record<string, unknown> };
    };
  };

  try {
    event = JSON.parse(rawBody);
  } catch {
    return new NextResponse("Invalid JSON body", { status: 400 });
  }

  try {
    // ── Idempotency check ───────────────────────────────────────
    const eventId = `rzp_${event.event}_${Date.now()}`;
    const existing = await prisma.paymentWebhookEvent.findUnique({
      where: { id: eventId },
      select: { processedAt: true },
    }).catch(() => null);

    if (existing?.processedAt) {
      return new NextResponse(null, { status: 200 });
    }

    await prisma.paymentWebhookEvent.create({
      data: { id: eventId, type: event.event },
    }).catch(() => {
      // Duplicate key — another instance is handling this event
    });

    // ── Handle events ───────────────────────────────────────────
    switch (event.event) {
      case "subscription.activated":
      case "subscription.charged": {
        const sub = event.payload.subscription?.entity;
        if (!sub) break;

        const userId = (sub.notes as Record<string, string>)?.userId;
        if (!userId) {
          console.warn("[Razorpay Webhook] No userId in subscription notes");
          break;
        }

        const currentEnd = typeof sub.current_end === "number"
          ? new Date(sub.current_end * 1000)
          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

        await prisma.user.update({
          where: { id: userId },
          data: {
            razorpaySubscriptionId: sub.id as string,
            razorpayPlanId: (sub.plan_id as string) || null,
            razorpayCurrentPeriodEnd: currentEnd,
          },
        });
        break;
      }

      case "subscription.cancelled":
      case "subscription.expired": {
        const sub = event.payload.subscription?.entity;
        if (!sub) break;

        const userId = (sub.notes as Record<string, string>)?.userId;
        if (!userId) {
          // Try to find user by subscription ID
          const user = await prisma.user.findFirst({
            where: { razorpaySubscriptionId: sub.id as string },
            select: { id: true },
          });
          if (user) {
            await prisma.user.update({
              where: { id: user.id },
              data: {
                razorpaySubscriptionId: null,
                razorpayPlanId: null,
                razorpayCurrentPeriodEnd: null,
              },
            });
          }
          break;
        }

        await prisma.user.update({
          where: { id: userId },
          data: {
            razorpaySubscriptionId: null,
            razorpayPlanId: null,
            razorpayCurrentPeriodEnd: null,
          },
        });
        break;
      }

      case "payment.captured": {
        const payment = event.payload.payment?.entity;
        if (!payment) break;
        const userId = (payment.notes as Record<string, string>)?.userId;
        if (!userId) break;

        // For one-time payments, grant access
        if (!payment.subscription_id) {
          await prisma.user.update({
            where: { id: userId },
            data: {
              razorpayCustomerId: payment.id as string,
              razorpaySubscriptionId: `payment_${payment.id}`,
              razorpayCurrentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
            },
          });
        }
        break;
      }

      case "payment.failed": {
        // Log but don't revoke — subscription lifecycle events handle entitlement
        const payment = event.payload.payment?.entity;
        console.warn("[Razorpay Webhook] Payment failed:", payment?.id);
        break;
      }
    }

    // Mark as processed
    await prisma.paymentWebhookEvent.update({
      where: { id: eventId },
      data: { processedAt: new Date() },
    }).catch(() => {});

  } catch (error) {
    console.error("[Razorpay Webhook] Failed to process event:", error);
    return new NextResponse("Webhook processing failed", { status: 500 });
  }

  return new NextResponse(null, { status: 200 });
}
