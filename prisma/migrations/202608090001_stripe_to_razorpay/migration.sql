-- Migration: Stripe → Razorpay
-- Renames Stripe-related fields to Razorpay equivalents on the User model
-- and renames StripeWebhookEvent table to PaymentWebhookEvent.

-- Drop Stripe unique indexes first
DROP INDEX IF EXISTS "User_stripeCustomerId_key";
DROP INDEX IF EXISTS "User_stripeSubscriptionId_key";

-- Rename User columns from Stripe to Razorpay
ALTER TABLE "User" RENAME COLUMN "stripeCustomerId" TO "razorpayCustomerId";
ALTER TABLE "User" RENAME COLUMN "stripeSubscriptionId" TO "razorpaySubscriptionId";
ALTER TABLE "User" RENAME COLUMN "stripePriceId" TO "razorpayPlanId";
ALTER TABLE "User" RENAME COLUMN "stripeCurrentPeriodEnd" TO "razorpayCurrentPeriodEnd";

-- Recreate unique indexes with new names
CREATE UNIQUE INDEX "User_razorpayCustomerId_key" ON "User"("razorpayCustomerId");
CREATE UNIQUE INDEX "User_razorpaySubscriptionId_key" ON "User"("razorpaySubscriptionId");

-- Rename StripeWebhookEvent → PaymentWebhookEvent
ALTER TABLE "StripeWebhookEvent" RENAME TO "PaymentWebhookEvent";
