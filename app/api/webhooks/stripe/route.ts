import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import prisma from "@/lib/prisma";
import Stripe from "stripe";

type SubscriptionShape = {
  id: string;
  customer: string | { id: string };
  status: string;
  current_period_end?: number;
  items: { data: Array<{ price: { id: string } }> };
};

function subscriptionIdFromInvoice(invoice: Stripe.Invoice): string | null {
  const subscription = (invoice as unknown as { subscription?: string | { id: string } | null }).subscription;
  if (typeof subscription === "string") return subscription;
  return subscription?.id ?? null;
}

async function syncSubscription(subscription: SubscriptionShape, userId?: string) {
  const customerId = typeof subscription.customer === "string"
    ? subscription.customer
    : subscription.customer.id;
  const user = userId
    ? await prisma.user.findUnique({ where: { id: userId }, select: { id: true } })
    : await prisma.user.findFirst({
        where: {
          OR: [
            { stripeSubscriptionId: subscription.id },
            { stripeCustomerId: customerId },
          ],
        },
        select: { id: true },
      });

  if (!user) {
    throw new Error("No user is linked to this Stripe subscription");
  }

  const entitled = subscription.status === "active" || subscription.status === "trialing";
  if (!entitled) {
    // Do not leave a cancelled, unpaid, or incomplete subscription appearing active.
    await prisma.user.update({
      where: { id: user.id },
      data: {
        stripeSubscriptionId: null,
        stripePriceId: null,
        stripeCurrentPeriodEnd: null,
        stripeCustomerId: customerId,
      },
    });
    return;
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      stripeSubscriptionId: subscription.id,
      stripeCustomerId: customerId,
      stripePriceId: subscription.items.data[0]?.price.id ?? null,
      stripeCurrentPeriodEnd: subscription.current_period_end
        ? new Date(subscription.current_period_end * 1000)
        : null,
    },
  });
}

export async function POST(req: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = (await headers()).get("Stripe-Signature");
  if (!webhookSecret || !signature) {
    return new NextResponse("Webhook configuration or signature is missing", { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(await req.text(), signature, webhookSecret);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid signature";
    return new NextResponse(`Webhook Error: ${message}`, { status: 400 });
  }

  try {
    const existing = await prisma.stripeWebhookEvent.findUnique({
      where: { id: event.id },
      select: { processedAt: true },
    });
    if (existing?.processedAt) {
      return new NextResponse(null, { status: 200 });
    }
    if (existing) {
      // A concurrent delivery is still being handled. Returning 500 asks Stripe
      // to retry instead of silently dropping an event if that request fails.
      return new NextResponse("Webhook is already being processed", { status: 500 });
    }

    await prisma.stripeWebhookEvent.create({
      data: { id: event.id, type: event.type },
    });
  } catch (error) {
    console.error("[stripe webhook] Failed to create event ledger entry", event.id, error);
    return new NextResponse("Webhook event could not be recorded", { status: 500 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const checkout = event.data.object as Stripe.Checkout.Session;
        const userId = checkout.metadata?.userId;
        if (!userId || typeof checkout.subscription !== "string") {
          return new NextResponse("Checkout is missing its user or subscription", { status: 400 });
        }
        const subscription = await stripe.subscriptions.retrieve(checkout.subscription);
        await syncSubscription(subscription as unknown as SubscriptionShape, userId);
        break;
      }
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        await syncSubscription(event.data.object as unknown as SubscriptionShape);
        break;
      }
      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = subscriptionIdFromInvoice(invoice);
        if (subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          await syncSubscription(subscription as unknown as SubscriptionShape);
        }
        break;
      }
      case "invoice.payment_failed":
        // Stripe will retry according to the account's dunning settings. The
        // subscription.updated/deleted events remain the source of entitlement truth.
        break;
    }
    await prisma.stripeWebhookEvent.update({
      where: { id: event.id },
      data: { processedAt: new Date() },
    });
  } catch (error) {
    console.error("[stripe webhook] Failed to apply event", event.id, error);
    // Permit Stripe's retry to claim the event again after a failed attempt.
    await prisma.stripeWebhookEvent.delete({ where: { id: event.id } }).catch(() => undefined);
    // Returning 500 tells Stripe to retry transient database/API failures.
    return new NextResponse("Webhook processing failed", { status: 500 });
  }

  return new NextResponse(null, { status: 200 });
}
