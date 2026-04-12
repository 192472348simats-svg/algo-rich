# 🔬 Algo Rich — Founder-Level Critique

> If I were the founder shipping this tomorrow, here's every gap that would cost users, credibility, and retention.

---

## 🚨 SHOWSTOPPER BUG: Learning Steps Don't Verify Code

**File:** [GuidedBuildStage.tsx](file:///d:/Projects/DSA/algo-rich/app/components/session/[sessionSlug]/../../components/session/GuidedBuildStage.tsx#L29-L36)

```javascript
function handleRun() {
    // Simulate running — show the expected output
    const simulated = step.expectedOutput ?? "Done!";
    setOutput(simulated);
}
```

**What happens:** When a user clicks "Run Code" in the guided learning steps, the component **ignores what the user typed entirely** and just displays the hardcoded `expectedOutput`. If the step says "Print Hello World" and you type `print("I am a banana")` — it still says ✅ Done!

**Why this kills the product:** This is the *learning* flow — the most important part for beginners. If the app lies about their code being correct, users will:
1. Think they understand something they don't
2. Get destroyed when they hit real practice problems  
3. Lose trust in the platform the moment they realize it

**Fix:** Route the user's code through Pyodide (same engine the practice section uses) and compare actual output against `expectedOutput`.

---

## 🏗️ What's Built Well (Credit Where Due)

| Feature | Verdict |
|---------|---------|
| **SM-2 Spaced Repetition** (`reviewEngine.ts`) | ✅ Genuinely sophisticated — real algorithm, not a gimmick |
| **XP / Level System** (`xpSystem.ts`) | ✅ Clean, scales well |
| **Pattern Tracking** (25 patterns with templates) | ✅ Excellent — better than most competitors |
| **3-Panel IDE** (Monaco + Pyodide) in Practice | ✅ Professional-grade |
| **Server-side Hidden Tests** (Piston API) | ✅ Anti-cheat, production-worthy |
| **Session Player** (Hook → Watch → Predict → Code → Reflect) | ✅ Brilliant pedagogical design |
| **Post-Solve Reflection** (pattern + complexity quiz) | ✅ Unique to this platform — real differentiator |
| **Design System** (Navy + Gold, CSS tokens) | ✅ Premium and consistent |

---

## 🔴 Critical Gaps (Ship-Blockers)

### 1. GuidedBuild Stage = Fake Compiler 🚨
- **Impact:** Users learn nothing in guided steps
- **Fix:** Integrate Pyodide code execution into GuidedBuildStage
- **Effort:** 2 hours

### 2. Lesson Completion = No Verification
- [LessonViewer.tsx](file:///d:/Projects/DSA/algo-rich/app/dashboard/lesson/%5BlessonId%5D/LessonViewer.tsx#L93-L111) has a "Mark as Complete" button with zero checks
- Users can click it without reading a single word
- **Fix:** Require scrolling to 80%+ or spending minimum time, or answering a 1-question quiz before marking complete
- **Effort:** 1.5 hours

### 3. Missing Content Categories
- **Zero** problems for: Backtracking, Greedy, Bit Manipulation, Tries, standalone Heaps/Stacks
- A user following the 16-week plan hits a content wall by week 6-7
- **Fix:** Add 50+ new problems (detailed in data audit)
- **Effort:** 4-6 hours of data entry

### 4. Difficulty Balance Is Wrong
- ~60% Easy, ~35% Medium, ~5% Hard
- Real interviews: 20% Easy, 40% Medium, 40% Hard
- Users arrive at interviews under-prepared for Hard problems
- **Fix:** Add 20+ Medium and 15+ Hard problems

---

## 🟡 Important Gaps (Retention Killers)

### 5. Session Definitions Are Hardcoded & Limited
- Sessions are defined in static TypeScript files, not in the database
- Adding new sessions requires code changes, not an admin panel
- Currently only a handful of sessions exist for a 16-week plan

### 6. No Email Service for Password Reset
- The forgot-password API generates tokens correctly but `console.log`s the reset link instead of emailing it
- **Fix:** Integrate Resend or Nodemailer ($0/mo for \<100 emails)

### 7. Course Content Is Shallow
- 3 courses × 5 lessons = 15 total lessons
- Each lesson is a single markdown article with a code snippet — no interactive elements
- Competitors (Educative, freeCodeCamp) have inline exercises within lessons
- **Fix:** Add inline "Try It" blocks inside lesson content

### 8. Mock Interview Is Under-developed
- No timed constraints
- No company-specific question sets
- No behavioral question prompts
- Pulls from the same general problem pool — not curated for interviews

### 9. No Progress Analytics Page
- User can see XP and streak, but no detailed analytics like:
  - Weak categories heatmap
  - Time-per-problem trends
  - Pattern mastery radar chart
  - Accuracy trending over time

---

## 🟢 Things That Are Unnecessary / Over-engineered

### 10. `seed-problems-complete.ts` vs `seed-problems-50.ts` vs `seed-problems-150.ts`
- **3 separate seed files** that partially overlap
- Nobody knows which ones were actually run or what's in the DB
- **Fix:** Consolidate into one canonical seed file, or use the ingestion tool exclusively

### 11. Session "Watch" Stage with Hardcoded Animations
- [WatchStage.tsx](file:///d:/Projects/DSA/algo-rich/app/components/session/WatchStage.tsx) at **21KB** is one of the largest components
- It contains hardcoded SVG animations that only work for specific topics
- Not scalable — every new topic needs custom animation code
- **Fix:** Either invest in a reusable animation framework or simplify to video embeds

### 12. `Sidebar.tsx` Desktop-Only UX
- The sidebar navigation is hidden on mobile with no replacement
- Mobile users have no way to navigate between sections without going back to dashboard
- **Fix:** Add a bottom navigation bar for mobile

### 13. Streak Freeze / Repair Schema
- DB schema has `streakFreezes`, `streakRepairAvailable`, `streakRepairedAt`
- **Zero UI exists** to purchase or use these — it's dead schema weight
- Either build the feature or remove the columns

---

## 📊 Feature Priority Matrix (If I Were Founder)

| Priority | What | Impact | Effort |
|:--------:|------|:------:|:------:|
| **P0** | Fix GuidedBuild fake compiler | 🔴 Critical | 2h |
| **P0** | Add lesson completion guard | 🔴 Critical | 1.5h |
| **P1** | Add 50 new problems (missing categories) | 🟡 High | 5h |
| **P1** | Add 50 new flashcards | 🟡 High | 2h |
| **P1** | Add 2 new courses (Greedy, Advanced DP) | 🟡 High | 4h |
| **P2** | Mobile bottom nav | 🟡 Medium | 1h |
| **P2** | Progress analytics page | 🟡 Medium | 3h |
| **P2** | Email service integration | 🟢 Medium | 1h |
| **P3** | Mock interview timed mode | 🟢 Low-now | 2h |
| **P3** | Consolidate seed files | 🟢 Low | 1h |
| **P3** | Remove dead streak schema | 🟢 Low | 15m |

---

## 🎯 Bottom Line

**The architecture is A+. The learning verification is F.** The platform looks and feels premium, but the most important part — actually verifying that users learned something — is completely broken in the guided build flow and unguarded in lessons.

**If I was shipping this tomorrow, I'd fix exactly two things first:**
1. Make the guided build compiler actually run code
2. Add a minimum engagement check before "Mark Complete" on lessons

Everything else is content scale-up and polish — important, but not ship-blocking the way a fake compiler is.
