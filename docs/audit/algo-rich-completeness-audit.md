# Algo-Rich Completeness Audit — Phase 1

> **Audit date:** 2026-07-31
> **Scope:** Full-stack review of the `algo-rich` repository — content, data flow, feature completeness, payments, auth security, and hardcoded/fake data.
> **Verdict:** The product has strong foundational engineering but is **not production-ready** due to disconnected payment plumbing, security gaps, and fabricated marketing data.

---

## Table of Contents

1. [Course Content Completeness](#1-course-content-completeness)
2. [Progress Tracking Trace](#2-progress-tracking-trace)
3. [Feature Inventory](#3-feature-inventory)
4. [Payments Gap Analysis](#4-payments-gap-analysis)
5. [Auth & Security Review](#5-auth--security-review)
6. [Fake / Hardcoded Data](#6-fake--hardcoded-data)
7. [Readiness Checklist](#7-readiness-checklist)

---

## 1. Course Content Completeness

### Summary

`prisma/seed-courses-full.ts` defines exactly **3 courses** with **5 lessons each** (15 lessons total). All 15 lessons contain full Markdown content — including headers, prose, and fenced Python code blocks. There are **no empty or placeholder lessons**.

### Lesson Slugs by Course

#### Course 1 — Python & Arrays Fundamentals (`python-arrays-fundamentals`)
| # | Slug |
|---|------|
| 1 | `python-basics-review` |
| 2 | `time-space-complexity` |
| 3 | `array-two-pointers` |
| 4 | `sliding-window-pattern` |
| 5 | `hashmaps-and-sets` |

#### Course 2 — Core Data Structures (`core-data-structures`)
| # | Slug |
|---|------|
| 1 | `stacks-and-queues` |
| 2 | `linked-lists-fundamentals` |
| 3 | `binary-search` |
| 4 | `trees-and-bst` |
| 5 | `recursion-and-backtracking` |

#### Course 3 — DSA Patterns for Interviews (`dsa-patterns-interviews`)
| # | Slug |
|---|------|
| 1 | `fast-slow-pointers` |
| 2 | `merge-intervals` |
| 3 | `bfs-and-dfs-graphs` |
| 4 | `dynamic-programming-intro` |
| 5 | `heap-priority-queue` |

### Legacy Seed Files

> [!WARNING]
> `prisma/seed-phases.ts` and `prisma/seed-phases-3-5.ts` exist in the repository but are **not part of the active seed pipeline** (`seed-master.ts` does not import them). They appear to be legacy/superseded content from an earlier phase-based curriculum model.
>
> **Recommendation:** Remove them or add a `DEPRECATED` header with a note explaining they are retained for reference only.

### Answer

**No lessons are missing content.** All 15 lessons are fully authored with instructional prose, code examples, and exercises.

---

## 2. Progress Tracking Trace

### Read Path (Dashboard → Database)

The data flow for displaying progress on the courses dashboard is:

1. **`app/dashboard/courses/page.tsx`** (server component, `force-dynamic`):
   - Authenticates the user via `auth()` and redirects to `/signin` if unauthenticated.
   - Runs two parallel Prisma queries:
     - `prisma.course.findMany(...)` — fetches all courses with their lesson IDs.
     - `prisma.progress.findMany({ where: { userId, completed: true } })` — fetches the authenticated user's completed progress records.
   - Builds a `completedIds` set and computes per-course `completedLessons` count by filtering each course's lessons against it.
   - Passes the shaped `courses` array into the client component.

2. **`app/dashboard/courses/CoursesListContent.tsx`** (client component):
   - Receives `courses` as props (each with `completedLessons` and `totalLessons`).
   - Renders `{course.completedLessons}/{course.totalLessons} lessons` and an animated progress bar.
   - Displays "Start Course" for 0% and "Continue" for > 0%.

**The display is real and per-user, not hardcoded.** A new user with zero completed lessons will correctly see `0/5` for each course.

### Write Path (Completion Mutation)

1. **Client triggers:** `LessonViewer.tsx` and `PlanLessonStep.tsx` call `POST /api/progress` with `{ lessonId }` when the user clicks "Mark Complete."

2. **Engagement gate (`lib/lessonEngagement.ts`):** Before allowing completion, the API checks a cookie-based engagement state that tracks elapsed time and scroll depth against minimum thresholds (`MIN_LESSON_SECONDS`, `MIN_SCROLL_PERCENT` from `lessonEngagement.shared.ts`). If the engagement requirements are not met, a `403` is returned with the current progress and requirements.

3. **`app/api/progress/route.ts` `POST`:**
   - Authenticates via `auth()`.
   - Validates `lessonId` exists in the database.
   - Checks if progress already exists (to avoid downgrading mastery).
   - Runs `prisma.progress.upsert` on the `userId_lessonId` compound key with `completed: true`, `completedAt: new Date()`, and sets `masteryLevel` to at least `"read"`.
   - Clears the engagement cookie on success.

### Orphaned API Route

> [!NOTE]
> `app/api/courses/route.ts` is a public `GET` endpoint that returns all courses with lesson metadata. It has **no auth check** and returns **no progress data**. It does not power the dashboard (which uses server-side Prisma calls directly).
>
> **Recommendation:** Either add auth + progress data and document its intended consumer, or remove it to reduce attack surface.

### Answer

This is **expected behavior with correct end-to-end wiring**. Progress tracking reads and writes use per-user, auth-gated Prisma queries with engagement verification. The `0/5` display for new users is correct.

---

## 3. Feature Inventory

### ✅ Fully Working End-to-End

| Feature | Notes |
|---------|-------|
| **Lesson progress** | Read/write path verified in Section 2; engagement gating, mastery levels, cookie-based tracking |
| **Submissions / Practice judge** | Judge0 integration for code submission evaluation + server-side Piston re-run for verification |
| **Daily quests** | `lib/dailyQuests.ts` + `app/api/quests/` — generates and tracks daily challenge completion |
| **Readiness score** | `lib/readinessEngine.ts` + `app/api/readiness/` — computes interview readiness from multiple signals |
| **Recommendations** | `app/api/recommendations/` — personalized problem/lesson recommendations |
| **Walkthrough progress** | `lib/guidedWalkthroughs.ts` + `app/api/walkthroughs/` — step-by-step walkthrough tracking |
| **Hints** | `lib/hintSystem.ts` + `app/api/hints/` — progressive hint delivery per problem |
| **Boss challenge** | `lib/bossChallenge.ts` + `app/api/boss-challenge/` — milestone challenge system |
| **Feedback** | `app/api/feedback/` — user feedback collection |
| **Spaced-repetition cards/reviews** | `lib/spacedRepetition.ts` + `lib/reviewEngine.ts` + `app/api/cards/` + `app/api/reviews/` + `app/api/flashcards/` |
| **Interview date countdown** | `lib/interviewCountdown.ts` — computes days remaining from stored interview date |
| **Role-gated admin stats** | `lib/isAdmin.ts` + `app/api/admin/` — admin-only analytics/stats endpoints |

### ⚠️ Partial / Incomplete

| Feature | Issue |
|---------|-------|
| **Zyra chat** | `app/components/Zyra.tsx` + `app/api/zyra/` exists and functions, but capabilities and conversation persistence may be limited; needs QA pass |
| **Achievements (dual-system)** | `lib/achievements.ts` implements a local achievement checker, but the schema also has achievement-related models — two parallel systems exist with unclear canonical source |
| **Mock interview** | `app/dashboard/mock-interview/` has a stub page with basic UI, but `app/api/mock-interview/` has a real API implementation — the frontend page doesn't fully integrate the API |
| **Interview date scheduler** | Users can set an interview date (consumed by countdown), but there is **no settings edit UI** to modify or remove a previously set date |

### ❌ UI-Only / Dead / Orphaned

| Item | Location | Issue |
|------|----------|-------|
| **`LiveDemoSection.tsx`** | `app/components/` | Landing page component with no real demo — renders a static/animated mock terminal; no code execution |
| **`EmailCaptureSection.tsx`** | `app/components/` | Contains an email input and submit button that shows a fake success message; no API call, no mailing list integration |
| **`AvatarStack.tsx`** | `app/components/` | Renders a hardcoded `count = 127` "users online" indicator with no real data source |
| **`public/pyodide-worker.js`** | `public/` | Client-side Python runner worker; unused — actual code execution routes through Judge0/Piston server-side |
| **`lib/services/testRunner.ts`** | `lib/services/` | Alternative test runner service; not imported or used anywhere in the application |
| **Stripe frontend (entire)** | Various | Backend Stripe routes exist (see Section 4) but there is no pricing page, no upgrade button, no billing management UI anywhere in the app |

---

## 4. Payments Gap Analysis

### What Exists (Backend)

The following real Stripe backend components are implemented:

| Component | Path | Description |
|-----------|------|-------------|
| Stripe client | `lib/stripe.ts` | Initializes `Stripe` with `STRIPE_SECRET_KEY`, API version `2026-03-25.dahlia` |
| Checkout session | `app/api/stripe/checkout/route.ts` | `POST` — creates a Stripe Checkout Session for authenticated user; supports `priceId` override; prevents duplicate subscriptions |
| Billing portal | `app/api/stripe/portal/route.ts` | `POST` — creates a Stripe Billing Portal session for subscription management |
| Webhook handler | `app/api/webhooks/stripe/route.ts` | Handles Stripe webhook events with **signature verification**, **idempotency** via `StripeWebhookEvent` model, and `syncSubscription` to update user's Stripe fields |
| Subscription checker | `lib/subscription.ts` | `checkSubscription` (period-end + 1-day grace) and `requireSubscription` (throws 403) utility functions |

### What Is Missing (The Gap)

Despite a complete backend, the payment gateway is **product-dead**:

- ❌ **No pricing page** — there is no `/pricing` or `/upgrade` route in the app.
- ❌ **No upgrade button** — no UI element anywhere calls `POST /api/stripe/checkout`.
- ❌ **No billing management UI** — no link or button calls `POST /api/stripe/portal`.
- ❌ **`lib/subscription.ts` never called** — `requireSubscription` and `checkSubscription` are exported but have zero imports across the codebase.

### Required Additions to Activate Payments

1. **Frontend pricing/upgrade page** — A `/pricing` or `/dashboard/upgrade` page displaying plan details and an "Upgrade" button that calls `POST /api/stripe/checkout`.

2. **Upgrade button** — A prominent CTA (e.g., in the dashboard sidebar or navbar) that initiates the checkout flow.

3. **Manage subscription control** — A "Manage Billing" button calling `POST /api/stripe/portal`, logically placed in `app/dashboard/settings/SettingsContent.tsx` or a dedicated billing section.

4. **Feature gating** — Add `requireSubscription(userId)` or `checkSubscription(userId)` calls to premium API routes and pages to enforce subscription-based access control.

5. **Environment config** — Add the following to `.env.example` and document in README:
   - `STRIPE_PRICE_ID` — the Stripe price ID for the subscription product
   - `STRIPE_SECRET_KEY` — Stripe secret API key
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — Stripe publishable key (for client-side Checkout if needed)
   - `STRIPE_WEBHOOK_SECRET` — webhook signing secret for signature verification

6. **Optional schema addition** — If explicit tier differentiation is needed (e.g., free/pro/premium), add a `tier` or `subscriptionStatus` field on the `User` model with a corresponding Prisma migration. Currently, subscription status is inferred from `stripeCurrentPeriodEnd`, which is sufficient for a single-tier model.

---

## 5. Auth & Security Review

### ✅ Password Hashing

- Uses `bcryptjs` with a **cost factor of 12** — acceptable and within industry norms (10–12 is standard).

### ⚠️ Rate Limiting

| Endpoint | Rate Limiting | Notes |
|----------|---------------|-------|
| `POST /api/auth/signin` (login) | ✅ `enforceRateLimit` (shared/Upstash) | Proper per-IP limiting via `lib/rateLimit.ts` |
| `POST /api/auth/signup` (register) | ✅ `enforceRateLimit` (shared/Upstash) | Same shared limiter |
| `POST /api/auth/forgot-password` | ⚠️ In-memory only | Uses a weaker in-memory `Map`-based limiter, not the shared `enforceRateLimit`; resets on server restart |
| `POST /api/auth/resend-verification` | ⚠️ In-memory only | Same weaker in-memory pattern |
| `POST /api/auth/reset-password` | ❌ **None** | No rate limiting — vulnerable to token brute-force (mitigated by SHA-256 hashed 32-byte tokens, but still a gap) |
| `POST /api/auth/verify-email` | ❌ **None** | No rate limiting on verification token submission |

> [!WARNING]
> `reset-password` and `verify-email` endpoints lack rate limiting entirely. While the 32-byte token space makes brute-force infeasible, rate limiting is still a defense-in-depth requirement.

### ✅ Forgot / Reset Password Flow

Full implementation confirmed:
- **Token generation:** 32 random bytes → hex string
- **Token storage:** SHA-256 hash stored in database (raw token never persisted)
- **Expiry:** 1-hour TTL (`resetTokenExpiry`)
- **Email delivery:** Via Resend (`lib/email.ts`)
- **Anti-enumeration:** Returns identical success response regardless of whether the email exists
- **Timing delay:** Artificial delay to prevent timing-based enumeration
- **Token consumption:** Atomic `updateMany` clears the token on use, preventing replay

### ⚠️ Session / Token Configuration

- Uses **JWT strategy** via NextAuth v5 (beta).
- `AUTH_SECRET` is set implicitly via environment variable.
- Default session expiry is **30 days** (NextAuth default).
- **No explicit `maxAge`** is configured — relies on default. This should be made explicit and potentially shortened for security-sensitive deployments.

### ⚠️ Input Validation

- **No Zod** or equivalent schema validation library is used.
- Validation is manual (e.g., checking for presence of fields, basic string checks).
- **No length caps** on input fields — email, password, and name fields accept unbounded input, which could lead to resource exhaustion or database issues.

### 🐛 Verify-Email Casing Bug

> [!CAUTION]
> The `verify-email` endpoint looks up the user by **raw email** (as submitted in the verification link), while all other auth endpoints normalize email via `toLowerCase().trim()`. If a user registered with `User@Example.com`, the verification token is associated with the normalized `user@example.com`, but the verify endpoint may look up `User@Example.com` — causing a **false 404** and preventing email verification.

### ⚠️ NextAuth v5 Beta Error-Normalization Risk

NextAuth v5 (beta) may normalize or wrap error messages thrown from the `authorize` callback. The signin flow currently relies on **exact string matching** against error messages like `EMAIL_NOT_VERIFIED` and `Too many login attempts`. If NextAuth normalizes these strings in a future beta release, these checks could silently break.

> [!IMPORTANT]
> **Recommendation:** Add runtime smoke tests or integration tests that verify these exact error strings survive the NextAuth error pipeline. Alternatively, switch to error codes or a custom error class that doesn't depend on message string matching.

### ⚠️ UX Gap — Unverified Email Signin

When a user with an unverified email attempts to sign in, they receive a generic error. There is **no redirect to a verification page** and **no inline resend-verification link** in the error UI. The user has no obvious path to resolve the issue.

---

## 6. Fake / Hardcoded Data

### 🔴 Live Homepage — Fabricated Metrics

| Component | Location | Issue | Severity |
|-----------|----------|-------|----------|
| **`HeroSection.tsx`** | `app/components/` | Hardcoded counters: **"2,847 students"**, **"150+ problems"**, **"34-day streak"** — none backed by real data | 🔴 High — visible on live homepage, potentially misleading |
| **`HeroSection.tsx`** | `app/components/` | Claims placement at specific companies with no supporting data or verification | 🔴 High — legal/reputational risk |
| **`SocialProofSection.tsx`** | `app/components/` | Contains **fabricated testimonials** with fake names, fake quotes, and fixed **5-star ratings** — none from real users | 🔴 High — deceptive social proof on live homepage |

### 🟡 Orphaned but Shipped in Repo

| Component | Location | Issue | Severity |
|-----------|----------|-------|----------|
| **`LiveDemoSection.tsx`** | `app/components/` | Renders a fake animated terminal; no real code execution | 🟡 Medium — orphaned but in repo |
| **`AvatarStack.tsx`** | `app/components/` | Hardcoded `count = 127` "users online" — entirely fake | 🟡 Medium — orphaned but in repo |
| **`EmailCaptureSection.tsx`** | `app/components/` | Shows a success message on submit but performs no API call and has no mailing list integration — fakes success | 🟡 Medium — orphaned but in repo |

### 🟡 Unverified Claims

| Component | Location | Issue | Severity |
|-----------|----------|-------|----------|
| **`FeaturesSection.tsx`** | `app/components/` | Claims **"15 core patterns"** | 🟡 Medium — not verified against `lib/patterns/patternDefinitions.ts`; actual count may differ |
| **`LearningPathSection.tsx`** | `app/components/` | Also references **"15 core patterns"** | 🟡 Medium — same unverified claim |

> [!CAUTION]
> The hardcoded student counts, fabricated testimonials, and unbacked placement claims on the **live homepage** represent the highest-priority items. They should be removed, replaced with real data, or clearly marked as aspirational before any public launch.

---

## 7. Readiness Checklist

| Area | Status | Summary |
|------|--------|---------|
| **Landing page** | ⚠️ | Functional layout but contains fabricated metrics, fake testimonials, and unbacked claims |
| **Auth** | ⚠️ | Core flows work (register, login, forgot/reset password) but has rate-limiting gaps, email casing bug, and no input validation library |
| **Dashboard** | ✅ | Real data, per-user progress, responsive layout, proper auth gating |
| **Course content** | ✅ | All 15 lessons fully authored with prose, code blocks, and exercises; no placeholders |
| **Progress tracking** | ✅ | End-to-end verified: server reads from DB, engagement-gated writes, per-user isolation |
| **Mock interview feature** | ⚠️ | API exists but frontend page is a stub; not integrated end-to-end |
| **Interview date scheduler** | ⚠️ | Can set date (powers countdown), but no edit/delete UI in settings |
| **Payments** | ❌ | Complete backend (Stripe checkout, portal, webhooks, subscription checker) but zero frontend integration — no pricing page, no upgrade button, subscription gating never called |
