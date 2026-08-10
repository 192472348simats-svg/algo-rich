# Production-Readiness Review

**Review date:** 2026-08-03  
**Verdict:** **Not yet.** The application has useful security controls and functional core learning flows, but production launch should wait for global failure handling, durable operational controls, consistent request validation, and execution-path cleanup.

## Verification record

The following items were re-checked before drawing the conclusions in this document.

| Area | Confirmed evidence | Assessment |
| --- | --- | --- |
| Client Python execution | `public/pyodide-worker.js` is a Web Worker (`self.onmessage`) and has a `StepLimiter` using `sys.settrace`, a 100,000-step ceiling, and a 10-second trace-based deadline. The worker closes itself only when its memory monitor fires. `rg` finds no `new Worker`, no `worker.terminate()`, and no importer for this worker in the live app. | The legacy worker has an in-worker limit but no caller-owned hard termination/interrupt mechanism. It is currently dead code, so live execution instead relies on server-side Piston timeouts. |
| Legacy test runner | `lib/services/testRunner.ts` exports helpers, but repository-wide search finds no importer. | Dead code; remove it or make it the supported, tested runner. |
| Global rendering failure handling | `app/components/ErrorBoundary.tsx` renders a real fallback with refresh control. `app/layout.tsx` places `{children}` under providers only and does not import or render `ErrorBoundary`. | A component-level boundary exists, but there is no global error boundary around the application. |
| Submissions API | `app/api/submissions/route.ts` wraps POST/GET in `try/catch`; validates authenticated user, `problemId`, code, Python-only language, and 100 KB code. It partially validates each visible test result, but has no request-size cap or schema validator. It always creates a submission; accepted duplicates are stored (and get reduced XP), not deduplicated. | Basic protection, inconsistent payload validation, no duplicate-attempt policy, and an N+1 persistence path. |
| Quiz API | `app/api/quiz/route.ts` has `try/catch` and `{ error: ... }` responses, but only checks truthiness of `quizType`/`topic` and presence of `correct`. Strings, booleans, and `timeSpent` lack type/length/range checks; GET accepts an unbounded client `limit`. Every POST inserts a record. | Insufficient request validation and no duplicate policy. |
| Mock-interview API | `app/api/mock-interview/route.ts` has `try/catch`, `{ error: ... }` errors, auth, and checks only `problemId` and `clientPassed`. `code`, `notes`, and `timeTakenSeconds` have no type/size/range limits; each POST creates another submission. Server validation has a 5-second Piston abort but falls back to client-reported pass on verification failure. | Better execution timeout than the client runner, but weak body validation and a documented trust gap. |
| Client storage and sign-out | `TimezoneSync.tsx` stores `algo-rich-timezone` without JSON parsing. `Zyra.tsx` writes JSON to `zyra_state` but contains no restore/read path; it also reads `algo-rich:last-solved-date`. `Sidebar.tsx` calls `signOut({ callbackUrl: "/" })` without clearing either local or session storage. `Navbar.tsx` and `OnboardingFlow.tsx` do not use browser storage. | No unsafe `JSON.parse` was found in the named clients, but persistent client state leaks across logout and Zyra persistence is write-only. |
| Stripe | `app/api/webhooks/stripe/route.ts` calls `stripe.webhooks.constructEvent(await req.text(), signature, webhookSecret)`, creates a `StripeWebhookEvent` ledger row by Stripe event ID, marks it processed only after success, and removes the row on processing failure for retry. Repository search finds backend checkout/portal routes but no frontend call to `/api/stripe/checkout` or `/api/stripe/portal`. | Webhook integrity and idempotency are present; the payment UI is not wired. |

## 1. Overall App Health

### Architecture — needs consolidation

- Prisma has three materially different schema files: `prisma/schema.prisma`, `prisma/schema-fixed.prisma`, and `prisma/schema.postgres.generated.prisma` (different file hashes). This creates migration and generated-client ambiguity.
- Authentication is repeatedly implemented as per-route `auth()` plus a manual `session.user.id` guard. There is no shared route wrapper, so error and authorization behavior can drift.
- `lib/adminAudit.ts` defines `logAdminAction`, but repository search finds no invocation from an admin route. The audit table exists but administrative activity is not recorded.
- `lib/services/testRunner.ts` and `public/pyodide-worker.js` are unreferenced alternatives to the Piston-backed server execution path. Keeping all three models makes safety and correctness harder to reason about.

### Security — useful controls, important gaps

- Login limiting is keyed by normalized **email**, not IP (`lib/auth.ts`); an attacker can distribute guesses across many addresses without an IP-level brake.
- `lib/rateLimit.ts` falls back to a process-local `Map` whenever Upstash is absent or unavailable. In a multi-instance deployment, that fallback is not distributed.
- No schema-validation library is installed; the reviewed routes use hand-written checks with inconsistent coverage.
- `.env.example` documents Stripe secret/publishable/webhook keys but omits `STRIPE_PRICE_ID`; it also omits both `GEMINI_API_KEY` and `GOOGLE_GENERATIVE_AI_API_KEY`, which the Zyra route reads.
- `app/api/cron/streak-reminder/route.ts` allows the endpoint when `CRON_SECRET` is unset because it only rejects a request when a secret exists and does not match. This can send reminder email to up to 100 users per call.
- Stripe webhook verification and event-ledger idempotency are correctly implemented and should be retained.

**Revalidation note:** the previously reported verify-email casing bug is **not confirmed in this checkout**. `app/api/auth/verify-email/route.ts` lowercases and trims the submitted email before lookup, matching signup. It should not remain an open production finding without a reproducible mixed-case database record.

### Error handling — partial, not global

- API routes reviewed return a consistent basic `{ error: string }` shape and have top-level `try/catch` coverage.
- `ErrorBoundary` has an accessible fallback, but the root layout does not wrap `{children}`. An unhandled render error can therefore escape the intended UI fallback.
- Piston calls in submissions and mock interviews use a five-second `AbortController`, but mock interviews deliberately accept client-reported success when server verification is unavailable.

### Performance — acceptable at small scale, not ready to grow

- `app/api/submissions/route.ts` loops connected lessons and makes several progress, lesson-problem, submission-count, and distinct-solve queries per lesson. This is an N+1 query pattern after a successful submission.
- `app/api/admin/stats/route.ts` performs one `problem.findUnique` per member of a five-item grouped list. This is bounded N+1 today, but should become one `findMany({ id: { in: ... } })` query.
- The `Problem` model declares no `@@index` entries despite frequent filters and sorts over fields such as phase, week, difficulty, pattern, active state, and topic order. Confirm query plans before choosing the exact composite indexes.

### Data handling — validation is uneven

- Submission code is capped at 100 KB and language is constrained to Python, but nested test-result payload size and shape are only partially constrained.
- Quiz and mock-interview bodies lack comprehensive type, length, and numeric bounds. Quiz history can request an uncontrolled limit.
- Duplicate submissions are intentionally retained rather than prevented. That is legitimate for attempt history, but the product needs an explicit idempotency key or a clear duplicate-attempt policy to protect retries and client double-submits.
- Client storage is not cleared on sign-out. Zyra saves conversation state but never restores it, so it gets the privacy cost without the user benefit.

### Testing — insufficient evidence for critical paths

- No tests were found for the Zyra route or component.
- The dead client runner and test-runner service have no proven production call path.
- Add focused route tests for malformed/oversized payloads, Piston failures, duplicate requests, Stripe ledger concurrency, and root error fallback.

### Dependencies and configuration — deployable only with stricter configuration

- The project depends on external Piston, Gemini, Stripe, Upstash, Resend, and a Pyodide CDN. Each needs explicit production configuration, observability, and failure expectations.
- Current configuration documentation is incomplete for the Gemini and Stripe price variables consumed by code.
- The in-memory rate-limit fallback and unprotected-by-default cron route make a partial deployment unsafe.

## Release blockers and priority

### Must fix before production

1. Require `CRON_SECRET` and fail closed when it is absent; protect every scheduled endpoint equivalently.
2. Add a root-level error boundary (and Next.js route-level `error.tsx` coverage where appropriate) so an application rendering failure has a real fallback.
3. Introduce shared, schema-based request validation with request-size and field limits for submissions, quizzes, mock interviews, and other mutable APIs.
4. Make rate limiting reliably distributed in production; require Upstash/Redis rather than silently accepting a per-instance fallback. Add an IP-based login dimension.
5. Resolve Prisma schema drift, designate `schema.prisma` as the only source of truth, and delete/generated-file-exclude the others.
6. Remove the mock-interview client-result fallback for any outcome that grants credit, or mark the attempt unverified and do not award a pass.

### Should do soon after launch

1. Batch the successful-submission progression work and the admin top-problem lookup; measure and add the required `Problem` indexes.
2. Define idempotency/duplicate behavior for all attempt-writing routes.
3. Wire or remove Pyodide and the legacy test runner; if retaining a browser runner, create/own the worker and terminate it on a wall-clock timeout.
4. Call `logAdminAction` from every state-changing admin route.
5. Complete `.env.example` with Gemini variables and `STRIPE_PRICE_ID`, then validate required production settings at startup.
6. Clear app-owned local/session storage at sign-out and either restore Zyra state safely or stop writing it.

### Can wait

1. Build a frontend checkout/portal flow after subscription entitlement paths are exercised in staging.
2. Replace the bounded admin N+1 with a batched lookup as part of admin analytics refinement.
3. Expand error reporting from console logging to an operational error-monitoring service.

## 2. Zyra assessment

**Maturity rating: beta-level.** Zyra has authenticated access, server-side rate limiting, payload bounds, a local fallback persona, and a component error boundary. It is not ready to be relied on as a context-aware tutoring service.

Evidence:

- Responses are non-streaming.
- The route tries up to three Gemini models serially, each with an eight-second timeout, before falling back; a degraded request can therefore occupy roughly 24 seconds before a reply.
- `maxOutputTokens` is 350, which can truncate useful tutoring replies.
- The component owns separate greeting, hint, stuck, and “naughty” personality banks, while the server has its own system prompt and fallback bank; these can drift in tone and policy.
- Zyra accepts `problemTitle`, `problemDescription`, `userCode`, and `lastError`, but the dashboard layout renders only `<Zyra context="dashboard" />`; `ProblemSolver.tsx` does not render Zyra or supply those props. Context-aware problem tutoring is therefore dead code in the current integration.
- `zyra_state` is saved to `localStorage` but never restored.
- The client fetch has no client timeout, retry policy, or special handling for a `429`/`Retry-After` response.
- No Zyra component or API-route tests were found.

### Must do before any real users touch this

1. Wire problem title, description, current code, and last execution error from the problem-solving surface into Zyra; remove unused props if the feature is not intended.
2. Add client timeout/cancellation, bounded retry with backoff, and explicit `429`/`Retry-After` user feedback.
3. Add route and component tests for auth, validation limits, Gemini timeout/fallback, rate limiting, and rendering failure.
4. Set a single shared personality/policy source for client fallback and server replies.
5. Decide whether conversation data is retained: safely restore bounded state per authenticated user, or stop writing it and clear it on sign-out.

### Should do soon after launch

1. Stream model output so users receive feedback before the full generation completes.
2. Replace serial model fallback with a shorter, measured policy and record per-provider latency/failure telemetry.
3. Tune output limits after observing real tutor exchanges; protect against truncation with an explicit completion strategy.
4. Add contextual prompt redaction and a clear user explanation of what code/problem data is sent to Gemini.

### Would be nice eventually

1. Let Zyra cite the learner’s own failed test case and lesson progress.
2. Add conversation quality feedback and offline evaluation sets for tutoring usefulness and policy adherence.
3. Provide opt-out controls for proactive nudges and personality intensity.

## Summary

**Overall verdict: not yet.** **Zyra is beta-level.** The single biggest risk is that mutable, credit-bearing learning flows combine inconsistent request validation and fallback-to-client trust with no global failure containment. Fix those controls before exposing the product to real users.
