# Algo Rich — Persona-Based Platform Audit

> A structured assessment of the Algo Rich learning platform through three target personas, evaluating usefulness and engagement at every touchpoint from landing page to lesson content.

---

## Executive Summary

This audit evaluates Algo Rich through three personas representing the platform's target audience spectrum. Each persona was walked through the full user journey (landing page → sign-up → dashboard → lesson content) and scored on two dimensions: how well the platform serves their learning goal (usefulness) and whether they would stay engaged long enough to get value (engagement).

| Persona | Usefulness | Engagement | Primary Blocker |
|---------|-----------|------------|------------------|
| **Complete Beginner** | 6/10 | 4/10 | Landing-page jargon, dashboard overwhelm, session sequencing conflict [F5] |
| **In-Progress Learner** | 5/10 | 5/10 | Phase-gating [F3], plan generator ignores experience [F1], navigation confusion [F4] |
| **Advanced / Interview Prep** | 3/10 | 2/10 | Patterns/Mock Interview locked, company filter 404 [F6], placeholder interview page [F7] |

**The single highest-impact systemic fix across all three personas is making `experienceLevel` functional** — persisting it from onboarding, mapping it to `currentPhase`, and using it in `planGenerator.ts`. This unblocks the correct default for beginners (Phase 1), skips Python Foundations for intermediate users (Phase 2), and unlocks Patterns + Mock Interview for advanced users (Phase 3).

The audit identified 12 confirmed findings ([F1]–[F12]) with exact file-level evidence, 9 concrete tailored fixes (3 per persona), and 4 cross-persona tradeoffs that must be managed when implementing those fixes.

---

## 1 — Scoring Rubric

### USEFULNESS Scale (1–10)

How well the platform serves this persona's **stated learning goal**.

| Score | Anchor |
|-------|--------|
| **1–2** | Actively harmful — misleading content, broken flows, or wrong difficulty level that wastes the persona's time or teaches incorrect concepts. |
| **3–4** | Minimally useful — some relevant content exists but critical gaps (missing topics, dead features, broken sequencing) prevent meaningful progress toward the goal. |
| **5–6** | Moderately useful — core learning loop works for a subset of the persona's needs; remaining gaps are painful but workaround-able. |
| **7–8** | Highly useful — the platform covers the persona's primary goal with minor friction; gaps are in nice-to-have areas, not core workflow. |
| **9–10** | Exceptionally useful — comprehensive coverage, well-sequenced content, and tooling that anticipates the persona's specific needs. Few or no meaningful gaps. |

### ENGAGEMENT / APPEAL Scale (1–10)

Would this persona **stay engaged** long enough to get value?

| Score | Anchor |
|-------|--------|
| **1–2** | Immediate bounce — the landing page, sign-up friction, or first dashboard impression drives the persona away before they try anything. |
| **3–4** | Tries once, leaves — the persona completes one session or lesson but hits a wall (locked features, confusing navigation, mismatched difficulty) and does not return. |
| **5–6** | Returns a few times — initial experience is promising but engagement decays within days due to lack of variety, progression stalls, or missing feedback loops. |
| **7–8** | Sustained engagement — the persona finds a rhythm (daily streak, weekly sessions) and stays for weeks; minor annoyances don't break the habit. |
| **9–10** | Deeply hooked — the platform becomes the persona's primary study tool; gamification, progression, and content quality create a self-reinforcing loop. |

---

## 2 — Per-Persona Output Structure

Every persona section must produce exactly this structure:

```
### [Persona Name] — [One-line description]

**Usefulness: X/10**
> [2–4 sentence reasoning citing specific findings from the ledger]

**Engagement: X/10**
> [2–4 sentence reasoning citing specific findings from the ledger]

**Top 3 Tailored Fixes**
1. [Fix most impactful for THIS persona, with file reference]
2. [Second fix]
3. [Third fix]

**Tradeoff Flags**
- [Any fix that benefits this persona but hurts another]
- [Any tension between this persona's needs and the current architecture]
```

---

## 3 — Audit Journey Order

Every persona section must evaluate the platform in this fixed order, assessing each touchpoint from the persona's perspective:

1. **Landing page** — First impression, copy relevance, trust signals
   - Files: `app/page.tsx`, `app/components/HeroSection.tsx`, `app/components/FeaturesSection.tsx`, `app/components/SocialProofSection.tsx`, `app/components/LearningPathSection.tsx`
2. **Sign-up & verification** — Friction, email verification flow, first redirect
   - Files: `app/(auth)/signup/page.tsx`, `app/api/auth/signup/route.ts`, `app/(auth)/verify-email/page.tsx`
3. **Dashboard first load** — What the persona sees immediately, navigation clarity, phase-gating impact
   - Files: `app/dashboard/page.tsx`, `app/dashboard/components/DashboardContent.tsx`, `app/dashboard/components/Sidebar.tsx`, `app/dashboard/layout.tsx`
4. **Lesson / session content** — Depth, difficulty match, code execution quality, progression
   - Files: `lib/sessions/*.ts`, `app/dashboard/session/[sessionSlug]/SessionPlayer.tsx`, `app/dashboard/courses/page.tsx`, `prisma/seed-courses-full.ts`

---

## 4 — Findings Ledger

Each finding is a confirmed platform fact with exact file-level evidence. Persona sections reference these by **finding ID** (e.g. `[F1]`).

---

### F1 — Onboarding collects experience/goal but discards them

**Severity:** High — personalization promise is broken

[OnboardingFlow.tsx](file:///d:/Projects/DSA/algo-rich/app/onboarding/OnboardingFlow.tsx) collects `experience` (beginner/intermediate/advanced) and `goal` (dsa/python/both) via multi-step UI.

[complete/route.ts](file:///d:/Projects/DSA/algo-rich/app/api/onboarding/complete/route.ts) destructures `{ experience, goal, phase, targetInterviewDate }` from the request body (line 13) but the `prisma.user.update` call (lines 15–21) only writes:
- `onboardingCompleted: true`
- `currentPhase` (if provided)
- `targetInterviewDate` (if provided)

The `experience` and `goal` values are **silently dropped**.

Meanwhile, `experienceLevel` and `learningGoal` columns DO exist on the User model — they are written by:
- [signup/route.ts](file:///d:/Projects/DSA/algo-rich/app/api/auth/signup/route.ts) (hardcoded to `"beginner"` / `"dsa"`, lines 88–89)
- [preferences/route.ts](file:///d:/Projects/DSA/algo-rich/app/api/user/preferences/route.ts) (POST handler, lines 63–64)

But **no feature in the app reads these fields** to personalize content, difficulty, or recommendations.

---

### F2 — `/onboarding` is orphaned from the live user flow

**Severity:** High — the onboarding page exists but no user ever reaches it

The live user flow is: **signup → verify-email → signin → dashboard**.

- [middleware.ts](file:///d:/Projects/DSA/algo-rich/middleware.ts) protects `/onboarding` behind auth (line 11) but **never redirects to it**.
- [lib/auth.ts](file:///d:/Projects/DSA/algo-rich/lib/auth.ts) and [signin/page.tsx](file:///d:/Projects/DSA/algo-rich/app/(auth)/signin/page.tsx) redirect successful login to `/dashboard`, not `/onboarding`.
- The dashboard shows a [BeginnerOnboardingFlow](file:///d:/Projects/DSA/algo-rich/app/dashboard/components/DashboardContent.tsx#L26) modal (line 1228) as an in-page overlay instead.

The standalone `/onboarding` page with its multi-step wizard (experience picker, goal picker, interview date setter) is **unreachable in normal usage**.

---

### F3 — Phase-gating locks most features for all users

**Severity:** High — effectively all users are stuck at Phase 1

[Sidebar.tsx](file:///d:/Projects/DSA/algo-rich/app/dashboard/components/Sidebar.tsx) filters navigation items by `minPhase` (line 130):
```ts
(item) => !item.minPhase || (currentPhase ?? 1) >= item.minPhase
```

`currentPhase` defaults to `1` (line 114). Since the onboarding flow that sets `currentPhase` is orphaned ([F2]), and no other mechanism advances the phase, **all users remain at Phase 1**.

Features hidden behind phase gates include: **Patterns**, **Mock Interview**, **Review**, **Daily Cards**, and **Achievements**.

The only way to advance `currentPhase` today is a direct database update.

---

### F4 — Dual content systems with inconsistent gating

**Severity:** Medium — confusing parallel paths, overlapping topics

Two independent content delivery systems exist:

| System | Content source | Route | Gating |
|--------|---------------|-------|--------|
| **Static sessions** | `lib/sessions/*.ts` (16 topic files, ~10 sessions each) | `/dashboard/path` → `/dashboard/session/[slug]` | Phase-based (stuck at Phase 1 per [F3]) |
| **Database courses** | `prisma/seed-courses-full.ts` (3 courses, 15 lessons) | `/dashboard/courses` → `/dashboard/courses/[courseId]/lessons/[lessonId]` | No gating — all content accessible |

Both systems cover overlapping topics (e.g. Python fundamentals, arrays, two pointers) with different content, different UX patterns (session stages vs. markdown lessons), and different progress tracking.

A user who completes a topic in one system gets no credit in the other.

---

### F5 — Session sequencing conflict in Python Foundations

**Severity:** Medium — broken learning path creates confusion or prerequisites errors

In [python-foundations.ts](file:///d:/Projects/DSA/algo-rich/lib/sessions/python-foundations.ts):

| Session | `nextSessionSlug` | `prerequisiteSessionSlug` |
|---------|-------------------|--------------------------|
| `variables-basics` (line 185) | `"loops-basics"` | `"first-python-program"` |
| `loops-basics` (line 339) | `"functions-basics"` | **`"if-else-basics"`** |

**Conflict:** `variables-basics` says "go to `loops-basics` next", but `loops-basics` requires `if-else-basics` (not `variables-basics`). A user following the `nextSessionSlug` chain will hit a prerequisite mismatch.

Additionally, `functions-basics` (line 492) has **no `prerequisiteSessionSlug`** at all, but its practice problem `is-prime` (line 601) assumes knowledge of loops — a topic the user may not have covered if they arrived via the broken chain.

The intended order based on prerequisites is:
`first-python-program` → `variables-basics` → `data-types` → `if-else-basics` → `loops-basics` → `functions-basics`

But the `nextSessionSlug` chain skips `data-types` and `if-else-basics`.

---

### F6 — Missing `/api/problems/by-company` API

**Severity:** Medium — feature advertised in UI but returns 404

[PracticeContent.tsx](file:///d:/Projects/DSA/algo-rich/app/dashboard/practice/PracticeContent.tsx) makes two fetch calls:
- `fetch("/api/problems/by-company")` (line 70) — loads company list
- `fetch(/api/problems/by-company?company=...`)` (line 88) — loads problems for a company

**No corresponding API route exists** at `app/api/problems/by-company/route.ts`. These calls return 404. The company filter tab in the practice section is non-functional.

Additionally, the [CompanyTopics](file:///d:/Projects/DSA/algo-rich/app/dashboard/components/DashboardContent.tsx#L771) widget on the dashboard is a static, non-clickable component — it displays company names but the badges lead nowhere.

---

### F7 — Mock Interview page is a placeholder

**Severity:** Low — page exists but is explicitly marked "Coming in Phase 3"

[mock-interview/page.tsx](file:///d:/Projects/DSA/algo-rich/app/dashboard/mock-interview/page.tsx) renders a placeholder card with "Coming in Phase 3" badge (line 27) and descriptive text about what to expect. No actual interview functionality exists on this page.

Note: A **separate** mock-interview API ([app/api/mock-interview/route.ts](file:///d:/Projects/DSA/algo-rich/app/api/mock-interview/route.ts)) does exist with working GET (fetch problem) and POST (verify and record result) handlers — but no frontend page consumes it.

---

### F8 — Interview date only settable at orphaned onboarding

**Severity:** Medium — countdown widget shows "no date set" for all users

`targetInterviewDate` can only be set in [OnboardingFlow.tsx](file:///d:/Projects/DSA/algo-rich/app/onboarding/OnboardingFlow.tsx) (line 133), which is orphaned ([F2]).

The [InterviewCountdownWidget](file:///d:/Projects/DSA/algo-rich/app/dashboard/components/DashboardContent.tsx#L1133) on the dashboard reads `targetInterviewDate` (line 1134) and displays a countdown, but since no user can set this value, it always shows the "no date set" state.

Settings (`SettingsContent.tsx`) does not expose a date picker for this field.

---

### F9 — Always-on gamification with no opt-out

**Severity:** Low — may alienate experienced users

[SettingsContent.tsx](file:///d:/Projects/DSA/algo-rich/app/dashboard/settings/SettingsContent.tsx) exposes only a single toggle: **sound effects** (line 215).

XP popups, streak counters, level-up animations, and celebration modals are always active. There is no way to:
- Disable XP/streak UI
- Hide gamification elements
- Switch to a "minimal" or "professional" mode

This is a non-issue for beginners but may irritate experienced developers who find gamification patronizing.

---

### F10 — Dead subscription guards

**Severity:** Low — no paid features exist, so the dead code causes no user-facing harm

[lib/subscription.ts](file:///d:/Projects/DSA/algo-rich/lib/subscription.ts) exports `checkSubscription()` (line 18) and `requireSubscription()`, but **neither function is called from any route or component** outside the file itself.

The Stripe integration fields (`stripeCustomerId`, `stripeSubscriptionId`, etc.) exist in the User model and are written by the signup route, but no feature gate checks `isSubscribed`. All users have identical access regardless of subscription status.

---

### F11 — Stale "fake compiler" claim in founder_critique.md

**Severity:** Informational — documentation is outdated, not a product bug

[founder_critique.md](file:///d:/Projects/DSA/algo-rich/founder_critique.md) line 47 labels the GuidedBuild stage as "Fake Compiler", claiming `handleRun()` ignores user code and displays hardcoded `expectedOutput`.

This claim is **stale**. [GuidedBuildStage.tsx](file:///d:/Projects/DSA/algo-rich/app/components/session/GuidedBuildStage.tsx) now imports `usePyodide` (line 14), and `handleRun()` (line 35) calls `runCode(trimmedCode)` (line 51), which executes user code via Judge0 CE API through [CodeExecutor.tsx](file:///d:/Projects/DSA/algo-rich/app/components/CodeExecutor.tsx) (`judge0Run`, line 99).

The code is genuinely executed and compared against expected output. The critique should be updated or removed.

---

### F12 — `patternDefinitions.ts` lacks edge cases and pattern variants

**Severity:** Low — content gap, not a functional bug

[patternDefinitions.ts](file:///d:/Projects/DSA/algo-rich/lib/patterns/patternDefinitions.ts) defines 16 core patterns with metadata (`whenToUse`, `template`, `complexity`, `relatedPatterns`). However:

- Templates show only the single canonical variant (e.g. two-pointer on sorted array, never on linked list)
- No edge cases or common pitfalls are documented
- `relatedPatterns` references are present but no UI uses them for cross-pattern discovery

This limits the "pattern recognition" value proposition for intermediate-to-advanced users.

---

## 5 — Persona Audit Sections

## Persona 1: Complete Beginner

> *"I've never written code. I heard Python is a good starting point and want to see if programming is for me."*

### Landing Page

The "From Python basics to interview-ready in 90 days" headline in [HeroSection.tsx](file:///d:/Projects/DSA/algo-rich/app/components/HeroSection.tsx) is partially welcoming — **"Python basics" is the right hook** for someone searching "learn Python". The three feature cards ("Structured courses", "Practice problems", "Streak-driven learning") are non-threatening and clearly communicate value.

However, several elements actively intimidate a true novice:

- **Unexplained jargon.** The hero code demo shows a `two_sum` function with hash-map logic and `O(n²)` vs `O(n)` complexity badges. A beginner doesn't know what Big-O, hash maps, or "patterns" mean. This signals "this isn't for people like me."
- **"90 days" timeline.** For someone who hasn't written a line of code, a fixed aggressive timeline creates anxiety rather than confidence.
- **"DSA" in branding.** The term "Data Structures and Algorithms" (and its abbreviation) is never defined on the landing page. [FeaturesSection.tsx](file:///d:/Projects/DSA/algo-rich/app/components/FeaturesSection.tsx) says "16 core patterns" and lists "Two pointers, sliding window, BFS, DP" — all meaningless to a novice.
- The [LearningPathSection.tsx](file:///d:/Projects/DSA/algo-rich/app/components/LearningPathSection.tsx) "Four phases" roadmap is reassuring (shows a structured journey starting from "Python Foundations"), but Phases 3–4 show locked icons, which can feel exclusionary rather than aspirational.

### Sign-Up & Verification

Sign-up itself is clean — email, name, password. The email verification flow works. No friction issues specific to beginners. The redirect to `/dashboard` after signin is fine.

### Dashboard First Load

The dashboard is **overwhelming for a first-time coder.** [DashboardContent.tsx](file:///d:/Projects/DSA/algo-rich/app/dashboard/components/DashboardContent.tsx) renders a daily plan, streak widget, XP bar, interview countdown (showing "no date set" per [F8]), progress charts, and a CompanyTopics widget — all on first visit, before the user has done anything.

The [Sidebar.tsx](file:///d:/Projects/DSA/algo-rich/app/dashboard/components/Sidebar.tsx) shows 10+ navigation items under "LEARN", "PRACTICE", and "TRACK" headings. Phase-gating [F3] hides Mock Interview, Review, Daily Cards, Patterns, and Achievements, but 7 visible items (Dashboard, Learning Path, Courses, Sessions, Visualizer, Problems, Progress) are still too many for someone who doesn't yet know what a "session" is vs. a "course" vs. a "learning path" [F4].

The `BeginnerOnboardingFlow` modal appears on first load but does not explain the difference between content systems or set expectations for the dashboard.

### Lesson Content

**This is the platform's strongest area for beginners.** [python-foundations.ts](file:///d:/Projects/DSA/algo-rich/lib/sessions/python-foundations.ts) defines sessions for `print()`, variables, loops, functions, data types, conditionals, lists, and strings — all explained in plain language with the 8-stage scaffold (hook → watch → predict → learn → guided-build → code → reflect → summary).

The `GuidedBuildStage` runs real code through Judge0 CE [F11 — the "fake compiler" critique is stale], so beginners get genuine feedback. The `predict` stage asks conceptual questions before coding, which is excellent pedagogy.

**However, the sequencing conflict [F5] is a real risk for beginners:**
- `variables-basics` points to `loops-basics` as the next session, but `loops-basics` requires `if-else-basics`. A beginner following the "Next" button will encounter a prerequisite error or, worse, be thrown into loops without understanding conditionals.
- `functions-basics` has no prerequisite but its challenge problem `is-prime` requires loop knowledge. A beginner who somehow reaches functions without completing loops will be stuck.

---

**Usefulness: 6/10**
> The Python Foundations content is genuinely well-scaffolded and covers the right topics in plain language — a true beginner can learn `print()`, variables, and basic data types effectively. But the sequencing conflict [F5] creates a real risk of confusion mid-path, the dual content systems [F4] make it unclear which "track" to follow, and the phase-gating [F3] means the natural progression beyond fundamentals (Logic Building, Core Data Structures) is hidden in the sidebar while the database courses are simultaneously accessible with no guardrails.

**Engagement: 4/10**
> The landing page's advanced jargon, Big-O badges, and "90 days" framing create a first-impression mismatch that may cause immediate bounce. If the beginner survives to the dashboard, the density of widgets, counters, and navigation items is disorienting before any learning has happened. The 8-stage session scaffold IS engaging once entered, but the path TO entering it is unclear — "Learning Path" vs "Sessions" vs "Courses" are three doors with no explanation of which to open first.

**Top 3 Tailored Fixes**

1. **Define "DSA" and "placement" on the landing page** — Add a one-sentence explainer below the headline in [HeroSection.tsx](file:///d:/Projects/DSA/algo-rich/app/components/HeroSection.tsx) (e.g. "DSA = Data Structures & Algorithms — the problem-solving skills tech companies test in interviews"). Replace or contextualize the Big-O badges in the code demo so a novice isn't immediately alienated.

2. **Fix the Python Foundations sequencing chain** — In [python-foundations.ts](file:///d:/Projects/DSA/algo-rich/lib/sessions/python-foundations.ts), change `variables-basics.nextSessionSlug` from `"loops-basics"` to `"data-types"` to match the prerequisite graph: `first-python-program → variables-basics → data-types → if-else-basics → loops-basics → functions-basics`. Add `prerequisiteSessionSlug: "loops-basics"` (or `"while-loops"`) to `functions-basics`.

3. **Reduce first-dashboard density for new users** — In [DashboardContent.tsx](file:///d:/Projects/DSA/algo-rich/app/dashboard/components/DashboardContent.tsx), detect when the user has zero completed sessions/lessons and render a simplified "start here" view that shows only the first session with a prominent "Begin" button, hiding the streak widget, interview countdown, company topics, and progress charts until the user has completed at least one session.

**Tradeoff Flags**
- Fix 1 (defining jargon) risks making the landing page feel "too basic" for intermediate and advanced users who already know what DSA means. Mitigation: use a collapsible or tooltip-style explainer rather than prominent paragraph text.
- Fix 3 (reducing dashboard density) must not hide the daily plan, streak, or XP widgets permanently — these are the engagement drivers for returning users. The simplified view should only apply to the absolute first visit (zero completions).
- Fixing the sequencing chain (Fix 2) is beginner-specific and does not negatively affect other personas, since the `nextSessionSlug` is advisory and advanced users skip foundations entirely.

---

## Persona 2: In-Progress Learner (Knows Basic Python, New to DSA)

> *"I can write Python — loops, functions, basic data structures. I want to learn DSA systematically for upcoming placement interviews."*

### Landing Page

The landing page speaks directly to this persona. "From Python basics to interview-ready" is exactly their goal. The [LearningPathSection.tsx](file:///d:/Projects/DSA/algo-rich/app/components/LearningPathSection.tsx) four-phase roadmap (Python Foundations → Core Data Structures → Algorithm Patterns → Interview Readiness) maps to their mental model of "I know Phase 1, I need Phases 2–4."

The feature cards ("16 core patterns", "Spaced repetition", "XP and streaks") are appealing — this persona is looking for structure and accountability, which gamification provides. The code demo with `two_sum` and Big-O comparison is impressive rather than intimidating because they understand the basics.

The [SocialProofSection.tsx](file:///d:/Projects/DSA/algo-rich/app/components/SocialProofSection.tsx) illustrative examples (now honestly labeled) describe experiences this persona can relate to — "going from barely understanding recursion to solving sliding window problems."

### Sign-Up & Verification

No issues. Clean flow. This persona is motivated and will tolerate a standard email verification step.

### Dashboard First Load

**Phase-gating [F3] is the critical pain point.** This user arrives knowing Python and wanting DSA, but `currentPhase` defaults to 1 because:
- The onboarding flow that could set `currentPhase` is orphaned [F2].
- `experienceLevel` is hardcoded to `"beginner"` at signup and the onboarding values are discarded [F1].

Result: the sidebar hides Mock Interview (phase 2+), Review (phase 2+), Daily Cards (phase 2+), Patterns (phase 3+), and Achievements (phase 3+). The user sees the same interface as a complete beginner.

Worse, [planGenerator.ts](file:///d:/Projects/DSA/algo-rich/lib/planGenerator.ts) `getNextLesson()` (line 319) returns the **first incomplete lesson in global order**, ignoring `experienceLevel`. This persona's daily plan will start with "Your First Python Program" — the `print("Hello!")` session. Being forced to re-learn `print()` is insulting to someone who already writes Python.

The dual content systems [F4] create navigation confusion:
- **"Learning Path"** → static sessions, phase-gated, starts at Python Foundations
- **"Courses"** → database lessons, no gating, all three courses accessible
- **"Sessions"** → another sessions listing

This user would rationally try "Courses" (the only ungated path to DSA content), but the sessions system has superior pedagogy (8-stage scaffold) while courses offer markdown lessons. There's no signposting about which is the "real" curriculum.

### Lesson Content

If this persona navigates to DSA content (via Courses or by completing enough Python sessions to unlock phase 2), the content quality is good:
- `lib/sessions/` has 16 topic files covering arrays, two-pointers, sliding-window, linked-lists, trees, binary-search, sorting, recursion, stacks-queues, hashmaps, graphs, backtracking, dynamic programming, and greedy — a comprehensive DSA curriculum.
- Each session uses the 8-stage scaffold with real code execution.
- The pattern definitions in [patternDefinitions.ts](file:///d:/Projects/DSA/algo-rich/lib/patterns/patternDefinitions.ts) provide useful templates and `whenToUse` lists.

But **reaching this content is the problem**, not the content itself.

The gamification features (XP, streaks, spaced repetition via [reviewEngine.ts](file:///d:/Projects/DSA/algo-rich/lib/reviewEngine.ts)) are well-suited to this persona's need for daily accountability. The interview countdown widget [F8] would be motivating if they could set a date, but they can't.

---

**Usefulness: 5/10**
> The DSA content exists and is well-structured, but the platform actively blocks this persona from reaching it. Phase-gating [F3] locks the features they need most (Patterns, Review, Mock Interview). The plan generator [F1] forces them through beginner Python sessions they've already mastered. The dual content systems [F4] create a confusing choose-your-own-adventure without guidance. If these barriers were removed, usefulness would jump to 7–8.

**Engagement: 5/10**
> The landing page creates the right expectation, and the gamification (XP, streaks, spaced repetition) matches this persona's need for habit-building. But the first dashboard experience — being told to re-learn `print()` and seeing no clear DSA starting point — is a momentum-killer. This persona will either waste time on fundamentals they already know, or bounce out of frustration. The interview countdown showing "no date set" [F8] is a missed opportunity for the urgency that drives this persona.

**Top 3 Tailored Fixes**

1. **Persist and use `experienceLevel` to set `currentPhase`** — In [complete/route.ts](file:///d:/Projects/DSA/algo-rich/app/api/onboarding/complete/route.ts), write the `experience` value to `experienceLevel` and map it to `currentPhase` (beginner→1, intermediate→2, advanced→3). In `getNextLesson()` in [planGenerator.ts](file:///d:/Projects/DSA/algo-rich/lib/planGenerator.ts), use `experienceLevel` to skip courses below the user's level. Either wire the orphaned `/onboarding` page into the live flow [F2] or add the experience/goal questions to the `BeginnerOnboardingFlow` modal in [DashboardContent.tsx](file:///d:/Projects/DSA/algo-rich/app/dashboard/components/DashboardContent.tsx).

2. **Add a "test out of basics" path** — Offer a short diagnostic quiz (5–8 questions covering Python fundamentals) at first login or in settings. If passed, auto-advance `currentPhase` to 2 and mark Python Foundations lessons as completed. This gives the user a fast track without requiring them to self-report experience level accurately.

3. **Clarify the courses-vs-sessions-vs-path navigation** — In [Sidebar.tsx](file:///d:/Projects/DSA/algo-rich/app/dashboard/components/Sidebar.tsx), either merge "Learning Path", "Courses", and "Sessions" into a single "Learn" entry that routes to a unified curriculum view, or add tooltip/subtitle text explaining the difference (e.g. "Courses: read & practice" vs "Sessions: interactive guided lessons"). At minimum, make one the primary recommendation in the daily plan.

**Tradeoff Flags**
- Fix 1 (skip-ahead via `experienceLevel`) risks stranding a learner who overestimates their level. Mitigation: provide a "go back to fundamentals" link on the dashboard and allow `currentPhase` to be lowered in Settings without penalty.
- Fix 2 (diagnostic quiz) requires careful question design — too easy and it's useless, too hard and intermediate learners fail and feel frustrated. Mitigation: target the quiz at Python proficiency only (not DSA), since that's the boundary this persona is crossing.
- Fix 3 (merging navigation) could reduce discoverability for power users who intentionally want both session-style and course-style learning. Mitigation: keep both accessible but default to one primary path with the other as an explicitly-labeled alternative.

---

## Persona 3: Advanced User (LeetCode-Experienced, Interview Prep)

> *"I've solved 200+ LeetCode problems. I want pattern-based practice, company-specific question sets, and timed mock interviews before my interview in 3 weeks."*

### Landing Page

The landing page undersells the platform to this persona. "From Python basics" signals beginner content. The code demo (`two_sum` with brute-force vs. optimal) is a solved problem they've seen dozens of times. The "Structured courses" and "Practice problems" feature cards are generic — this persona wants to know about **pattern templates, company question sets, and timed interviews**, none of which are prominently featured.

The [LearningPathSection.tsx](file:///d:/Projects/DSA/algo-rich/app/components/LearningPathSection.tsx) shows Phases 3–4 (Algorithm Patterns, Interview Readiness) locked. This is the content they came for, and it appears gated. The "16 core patterns" mention in [FeaturesSection.tsx](file:///d:/Projects/DSA/algo-rich/app/components/FeaturesSection.tsx) is the only landing-page hook that speaks to this persona, and it's buried in a feature grid.

### Sign-Up & Verification

No issues with the mechanics, but this persona is time-sensitive (interview in 3 weeks). Every extra step costs patience. The orphaned onboarding [F2] means they can't set their interview date or declare "advanced" experience at registration.

### Dashboard First Load

**This is where the platform fails this persona most severely.**

Phase-gating [F3] means the sidebar hides:
- **Patterns** (phase 3+) — the feature they came for
- **Mock Interview** (phase 2+) — their primary use case
- **Review** (phase 2+) — spaced repetition on problems they've already solved
- **Achievements** (phase 3+)
- **Daily Cards** (phase 2+)

What remains visible is the same beginner-oriented view: Dashboard, Learning Path, Courses, Sessions, Visualizer, Problems, Progress. The daily plan from [planGenerator.ts](file:///d:/Projects/DSA/algo-rich/lib/planGenerator.ts) will suggest "Your First Python Program" as the next lesson.

The "Problems" tab IS accessible and contains real practice problems, but the **company filter is broken** [F6] — `PracticeContent.tsx` fetches `/api/problems/by-company` which returns 404. For a user who wants to drill TCS or Google-specific questions, this is a dead end.

The [InterviewCountdownWidget](file:///d:/Projects/DSA/algo-rich/app/dashboard/components/DashboardContent.tsx#L1133) shows "no date set" [F8] and there's no way to set it from the dashboard or settings. For a time-pressured user, this is a wasted motivation tool.

### Lesson Content

**Pattern content depth is insufficient for this persona.** [patternDefinitions.ts](file:///d:/Projects/DSA/algo-rich/lib/patterns/patternDefinitions.ts) provides 16 patterns [F12], each with:
- One template (canonical form only — e.g. two-pointer on sorted array, never on linked list)
- One-line time/space complexity
- A `whenToUse` checklist (4–5 bullet points)
- `relatedPatterns` references (present but no cross-linking UI)

This reads as a **cheat-sheet**, not a learning tool. No edge cases, no variant discussion (e.g. "when two-pointer fails and you need sliding window instead"), no complexity proofs.

The pattern quiz in [PatternRecognition.tsx](file:///d:/Projects/DSA/algo-rich/app/components/patterns/PatternRecognition.tsx) is a **single 4-option multiple-choice question** — pick which pattern fits a problem description. For a LeetCode veteran, this is trivially easy and offers no value. There's no multi-step recognition exercise, no "what's wrong with this approach" analysis, and no timed element.

The mock interview page [mock-interview/page.tsx](file:///d:/Projects/DSA/algo-rich/app/dashboard/mock-interview/page.tsx) is a **"Coming in Phase 3" placeholder** [F7]. The backend API exists ([app/api/mock-interview/route.ts](file:///d:/Projects/DSA/algo-rich/app/api/mock-interview/route.ts)) with working GET (fetch unsolved medium/hard problem) and POST (server-verified submission), but no frontend consumes it. This is the most requested feature for this persona and it's unbuilt.

The always-on gamification [F9] (XP popups, streak animations, level-up celebrations) is actively irritating for this persona. They don't need extrinsic motivation — they have an interview in 3 weeks. There's no opt-out.

---

**Usefulness: 3/10**
> The platform has almost nothing to offer this persona in its current state. Patterns are locked behind phase 3, the mock interview is a placeholder, the company filter 404s, and the pattern content that does exist is a shallow cheat-sheet. The practice problems section works and has real server-side verification, which is genuinely valuable — but without company tagging, difficulty filtering, or timed constraints, it's an inferior version of LeetCode. The spaced repetition engine is excellent but is locked behind phase 2.

**Engagement: 2/10**
> This persona will bounce within minutes. The landing page reads as a beginner product. The dashboard suggests re-learning `print()`. Patterns and Mock Interview are hidden. The company filter is broken. The gamification (XP popups, streak counters) feels patronizing to someone who's already solved 200+ problems. The only possible retention path is the raw "Problems" practice tab, but without the company/pattern layer on top, there's no reason to choose this over LeetCode, HackerRank, or NeetCode.

**Top 3 Tailored Fixes**

1. **Allow "advanced" onboarding to set `currentPhase` ≥ 3 and unlock direct access** — Either wire the orphaned [OnboardingFlow.tsx](file:///d:/Projects/DSA/algo-rich/app/onboarding/OnboardingFlow.tsx) into the live flow (with the experience selector mapping to phase), or add a "skip to patterns" fast-path in the `BeginnerOnboardingFlow` modal. When `experienceLevel = "advanced"`, set `currentPhase = 3`, which unlocks Patterns, Mock Interview, Review, Daily Cards, and Achievements in one step. Add a `targetInterviewDate` field to [SettingsContent.tsx](file:///d:/Projects/DSA/algo-rich/app/dashboard/settings/SettingsContent.tsx) so the countdown widget works.

2. **Build the `/api/problems/by-company` route and wire the company filter** — Create `app/api/problems/by-company/route.ts` backed by a `company` field on the Problem model (or a `ProblemCompany` join table). Populate it with company tags from the problem seed data. This makes the company filter in [PracticeContent.tsx](file:///d:/Projects/DSA/algo-rich/app/dashboard/practice/PracticeContent.tsx) functional and gives this persona the "drill company questions" workflow they expect.

3. **Implement a timed mock interview using the existing backend** — Replace the placeholder in [mock-interview/page.tsx](file:///d:/Projects/DSA/algo-rich/app/dashboard/mock-interview/page.tsx) with a working page that: (a) calls `GET /api/mock-interview` to fetch a medium/hard problem, (b) renders a code editor with a visible countdown timer (30/45/60 min options), (c) submits via `POST /api/mock-interview` with the code for server-side verification. The backend is already built — this is a frontend-only task.

**Tradeoff Flags**
- Fix 1 (unlocking skip-ahead) must **not remove the guided path beginners need**. Phase-gating should remain the default for `experienceLevel = "beginner"` — only `"intermediate"` and `"advanced"` users should skip phases. The sidebar items should still exist for advanced users; they just need to be visible from day one.
- Fix 1 (gamification opt-out, implied) — adding a "minimal mode" toggle that hides XP/streak/level-up UI would help this persona but could reduce engagement metrics for beginners who benefit from gamification. Mitigation: make it a Settings toggle, not a global default. This connects to [F9].
- Fix 3 (mock interview) requires careful scoping — a full-featured interview simulator (multiple problems, interviewer chat, whiteboard) is months of work. The minimum viable version (single problem + timer + submit) is achievable in days and covers 80% of this persona's need. Do not over-build.
- Building company-specific problem sets (Fix 2) requires problem curation work beyond just code — someone needs to tag which companies ask which problems. Consider seeding from publicly available sources (LeetCode discuss, company interview guides) rather than fabricating tags.

---

## 6 — Cross-Persona Tradeoffs

The nine tailored fixes across the three personas create four systemic tensions that must be resolved at the product level, not on a per-persona basis.

---

### T1 — Beginner Explanation vs. Advanced Boredom

**The tension:** Beginners need inline definitions ("DSA = Data Structures & Algorithms"), simplified dashboard views, and hand-holding hint copy ("Click 'Run' to test your code!"). Advanced users find these patronizing and cluttered.

**Where it surfaces:**
- Landing page: Defining "DSA", "Big-O", and "placement" helps beginners but adds noise for experienced users who parse those terms instantly.
- Dashboard: A simplified "start here" view (Beginner Fix 3) is essential for first-time coders but would frustrate an advanced user who wants to see their streak, review queue, and pattern progress immediately.
- Session content: The 8-stage scaffold (hook → predict → learn → guided-build → code → reflect) is brilliant pedagogy for beginners but forces advanced users through low-value stages to reach the coding step.

**Recommendation:** Branch on `experienceLevel`. When `experienceLevel = "beginner"`, show inline definitions, the simplified first-visit dashboard, and full session scaffolding. When `experienceLevel = "intermediate"` or `"advanced"`, hide tooltips, show the full dashboard from day one, and allow skipping to the `code` stage within sessions. The branching must be **soft** — an advanced user who wants to review fundamentals should still be able to navigate to the beginner path manually.

---

### T2 — Gamification: Motivation Engine vs. Distraction

**The tension:** Always-on XP popups, streak counters, confetti animations, and level-up celebrations ([F9]) are core engagement drivers for beginners and in-progress learners, but actively irritate advanced users who are time-pressured and intrinsically motivated.

**Where it surfaces:**
- Post-solve celebrations: A beginner solving their first problem deserves a celebratory animation. An advanced user solving their 200th problem finds it interruptive.
- Streak pressure: Beginners benefit from daily streak accountability. Advanced users preparing for a specific interview may study in bursts (4 hours on weekends, nothing on weekdays) and feel the streak mechanic punishes their pattern.
- XP display: XP and level badges give beginners a sense of progression. Advanced users see them as vanity metrics disconnected from interview readiness.

**Recommendation:** Add an experience-driven gamification intensity setting. Default behavior by `experienceLevel`:

| Level | Default Gamification |
|-------|---------------------|
| `beginner` | **Full** — XP popups, streak counter, confetti, level-up celebrations, daily quests |
| `intermediate` | **Standard** — XP in sidebar, streak counter, no confetti, no level-up interruptions |
| `advanced` | **Minimal** — XP visible only in profile/settings, streak counter as a subtle badge, zero interruptions |

Expose this as a "Gamification intensity" setting in [SettingsContent.tsx](file:///d:/Projects/DSA/algo-rich/app/dashboard/settings/SettingsContent.tsx) so any user can override the default. This connects to finding [F9] (currently only a sound toggle exists).

---

### T3 — Skip-Ahead Access vs. Fundamentals-First Safety

**The tension:** Advanced users need `currentPhase ≥ 3` to access Patterns, Mock Interview, and Review from day one (Advanced Fix 1). But removing phase-gating entirely would expose beginners to content they're not ready for, creating frustration and self-doubt.

**Where it surfaces:**
- Sidebar navigation: An advanced user stuck at Phase 1 sees the same nav as a beginner — 5 features are hidden. A beginner with Phase 3 access would see Patterns and Mock Interview before learning what a loop is.
- Plan generator: `getNextLesson()` returns the first incomplete lesson globally. Skipping lessons for advanced users means their "daily plan" starts at the right level, but if they overestimate their experience, they miss foundational context.
- Pattern content: Unlocking Patterns early is critical for advanced users but the pattern definitions [F12] are shallow. An intermediate user who skips to Patterns expecting deep instruction will find only cheat-sheet-level content.

**Recommendation:** Phase-gating should remain the **default for `experienceLevel = "beginner"`** — Phase 1 is the correct start point. For `"intermediate"`, set `currentPhase = 2` (unlocks Review, Daily Cards, Mock Interview). For `"advanced"`, set `currentPhase = 3` (additionally unlocks Patterns and Achievements).

Critically, add a **"go back to fundamentals" escape hatch** — a link in Settings or the dashboard that lets any user lower their `currentPhase` without penalty. This prevents the failure mode where a learner overestimates their level, gets stuck on advanced content, and has no way back.

Also add the "test out of basics" diagnostic quiz (In-Progress Fix 2) as a second validation layer: even if a user self-reports as advanced, offer the quiz to confirm. If they fail, recommend starting at a lower phase with a non-punitive message ("Looks like a quick refresh would help — we'll start you here").

---

### T4 — `experienceLevel` as the Single Branching Control

**The tension resolved:** Tradeoffs T1, T2, and T3 all converge on the same variable — `experienceLevel`. Rather than implementing three independent branching mechanisms (one for copy density, one for gamification, one for phase gating), **persist `experienceLevel` as the single control that drives all three**.

**Implementation shape:**

| `experienceLevel` | `currentPhase` | Copy Density | Gamification | Plan Start |
|-------------------|---------------|-------------|-------------|------------|
| `beginner` | 1 | Full definitions, simplified first-visit dashboard | Full (popups, confetti, quests) | Lesson 1 of Course 1 |
| `intermediate` | 2 | Standard (no inline definitions, full dashboard) | Standard (sidebar XP, no interruptions) | First DSA lesson (skip Python Foundations) |
| `advanced` | 3 | Minimal (no tooltips, full dashboard, stage-skip in sessions) | Minimal (profile-only XP, subtle streak) | First Pattern / first unsolved problem |

**What must change to enable this:**
1. [complete/route.ts](file:///d:/Projects/DSA/algo-rich/app/api/onboarding/complete/route.ts) must write `experience` → `experienceLevel` and map it to `currentPhase`.
2. [planGenerator.ts](file:///d:/Projects/DSA/algo-rich/lib/planGenerator.ts) `getNextLesson()` must skip courses below the user's phase.
3. [DashboardContent.tsx](file:///d:/Projects/DSA/algo-rich/app/dashboard/components/DashboardContent.tsx) must read `experienceLevel` and branch first-visit UI.
4. Gamification components must read `experienceLevel` (or a derived "gamification intensity" setting) to decide popup/animation behavior.
5. [SettingsContent.tsx](file:///d:/Projects/DSA/algo-rich/app/dashboard/settings/SettingsContent.tsx) must allow overriding all three derived settings (phase, copy density, gamification) independently for users who want non-default combinations.

This approach avoids the combinatorial explosion of per-persona feature flags and keeps the mental model simple: **one question at onboarding → three product behaviors branch from the answer**.

---
---

## 7 — Follow-Up Engineering Prompts

Concrete product fixes referenced in this audit, ordered by impact (highest first). Each prompt is scoped to specific files and can be executed as an independent work unit.

---

### P1 — Persist `experienceLevel` and set `currentPhase` at onboarding

**Findings:** [F1], [F2], [F3] · **Personas affected:** All three · **Tradeoff:** [T3], [T4]

**Scope:**
- Update [complete/route.ts](file:///d:/Projects/DSA/algo-rich/app/api/onboarding/complete/route.ts) to write `experience` → `experienceLevel` and derive `currentPhase` (beginner→1, intermediate→2, advanced→3).
- Either wire [OnboardingFlow.tsx](file:///d:/Projects/DSA/algo-rich/app/onboarding/OnboardingFlow.tsx) into the live auth flow (add redirect from signin to `/onboarding` when `onboardingCompleted = false`) or merge the experience/goal questions into the `BeginnerOnboardingFlow` modal in [DashboardContent.tsx](file:///d:/Projects/DSA/algo-rich/app/dashboard/components/DashboardContent.tsx).
- Update `getNextLesson()` in [planGenerator.ts](file:///d:/Projects/DSA/algo-rich/lib/planGenerator.ts) to skip lessons in courses below the user's `currentPhase`.

---

### P2 — Resolve the Python Foundations sequencing conflict

**Finding:** [F5] · **Persona affected:** Complete Beginner · **Tradeoff:** None (beginner-only fix)

**Scope:**
- In [python-foundations.ts](file:///d:/Projects/DSA/algo-rich/lib/sessions/python-foundations.ts), change `variables-basics.nextSessionSlug` from `"loops-basics"` to `"data-types"` (line 185).
- Add `prerequisiteSessionSlug: "loops-basics"` to `functions-basics` (around line 492).
- Verify the resulting chain: `first-python-program → variables-basics → data-types → type-conversion → if-else-basics → loops-basics → while-loops → functions-basics → lists-basics → strings-basics`.

---

### P3 — Build `/api/problems/by-company` and wire the company filter

**Finding:** [F6] · **Persona affected:** Advanced · **Tradeoff:** Requires problem curation data

**Scope:**
- Create `app/api/problems/by-company/route.ts` with two GET behaviors: no query param → return distinct company list; `?company=X` → return problems tagged with that company.
- Add a `company` field (or `ProblemCompany` join table) to the Problem model in [schema.prisma](file:///d:/Projects/DSA/algo-rich/prisma/schema.prisma).
- Populate company tags in the problem seed data.
- Verify [PracticeContent.tsx](file:///d:/Projects/DSA/algo-rich/app/dashboard/practice/PracticeContent.tsx) lines 70 and 88 work with the new API.

---

### P4 — Implement the timed mock interview frontend

**Finding:** [F7] · **Persona affected:** Advanced · **Tradeoff:** Scope carefully (MVP, not full simulator)

**Scope:**
- Replace the placeholder in [mock-interview/page.tsx](file:///d:/Projects/DSA/algo-rich/app/dashboard/mock-interview/page.tsx) with a working page.
- Call `GET /api/mock-interview` to fetch an unsolved medium/hard problem.
- Render a Monaco code editor with a visible countdown timer (30/45/60 min selectable).
- On submit or time expiry, call `POST /api/mock-interview` with the code for server-side Piston verification.
- Display pass/fail result with time taken. The backend ([app/api/mock-interview/route.ts](file:///d:/Projects/DSA/algo-rich/app/api/mock-interview/route.ts)) already exists.

---

### P5 — Add `targetInterviewDate` to Settings

**Finding:** [F8] · **Persona affected:** In-Progress, Advanced · **Tradeoff:** None

**Scope:**
- Add a date picker field to [SettingsContent.tsx](file:///d:/Projects/DSA/algo-rich/app/dashboard/settings/SettingsContent.tsx).
- Save via [preferences/route.ts](file:///d:/Projects/DSA/algo-rich/app/api/user/preferences/route.ts) (add `targetInterviewDate` to the allowed update fields).
- The [InterviewCountdownWidget](file:///d:/Projects/DSA/algo-rich/app/dashboard/components/DashboardContent.tsx#L1133) already reads this field — no dashboard changes needed.

---

### P6 — Add gamification intensity setting

**Finding:** [F9] · **Persona affected:** Advanced (primary), In-Progress (secondary) · **Tradeoff:** [T2]

**Scope:**
- Add a `gamificationIntensity` field to the User model (`"full"` | `"standard"` | `"minimal"`, defaulting based on `experienceLevel`).
- Expose a selector in [SettingsContent.tsx](file:///d:/Projects/DSA/algo-rich/app/dashboard/settings/SettingsContent.tsx) alongside the existing sound toggle.
- Read the field in celebration/popup components and conditionally render based on intensity level.

---

### P7 — Deepen `patternDefinitions.ts` content

**Finding:** [F12] · **Persona affected:** Advanced · **Tradeoff:** None (additive content)

**Scope:**
- For each of the 16 patterns in [patternDefinitions.ts](file:///d:/Projects/DSA/algo-rich/lib/patterns/patternDefinitions.ts), add:
  - At least one variant template (e.g. two-pointer on linked list, not just sorted array).
  - 2–3 common edge cases / pitfalls.
  - A "when this pattern fails" note pointing to the correct alternative pattern.
- Wire the existing `relatedPatterns` field to a cross-linking UI in the pattern detail page.

