# Algo Rich — API Audit Report

_Generated: March 2026_

## Summary

All API routes reside under `app/api/`. Every route requires authentication via `auth()` from NextAuth v5 (`lib/auth.ts`). All routes return `{ error: "Unauthorized" }` with status 401 when the session is missing, and wrap their logic in `try/catch` returning 500 on unexpected errors.

---

## Route Inventory

### Auth Routes
| Route | Method | Description |
|-------|--------|-------------|
| `/api/auth/[...nextauth]` | GET/POST | NextAuth v5 handler |
| `/api/auth/signup` | POST | Create new user account |
| `/api/auth/verify-email` | GET | Email verification token |

### User
| Route | Method | Description |
|-------|--------|-------------|
| `/api/user/stats` | GET | Returns `totalXP`, `currentPhase`, `targetInterviewDate`, lesson/problem counts, streak |
| `/api/user/activity` | GET | Returns last 30 days of lesson completions + submissions |
| `/api/user/onboarding` | GET/PUT | Read or update onboarding preferences |

### Onboarding
| Route | Method | Description |
|-------|--------|-------------|
| `/api/onboarding` | GET | Returns onboarding data for flow |
| `/api/onboarding/complete` | POST | Marks onboarding complete, saves `targetInterviewDate` |

### Courses & Lessons
| Route | Method | Description |
|-------|--------|-------------|
| `/api/courses` | GET | Returns all courses with lesson counts |
| `/api/courses/[courseId]` | GET | Course detail with lessons |
| `/api/lessons` | GET | Lesson list (by courseId) |

### Problems
| Route | Method | Description |
|-------|--------|-------------|
| `/api/problems` | GET | Problems with filters: `difficulty`, `phase`, `pattern`, `status`, `company` |
| `/api/problems/[problemId]` | GET | Single problem detail |
| `/api/problems/by-company` | GET | Company list or problems for a company |
| `/api/problems/daily` | GET | Deterministic daily problem + solved status |

### Submissions
| Route | Method | Description |
|-------|--------|-------------|
| `/api/submissions` | POST | Submit solution; awards XP (Easy:25/Medium:50/Hard:100), saves to `totalXP`, triggers pattern discovery + aha moment, enrolls for spaced repetition |
| `/api/submissions/failure-stats` | GET | Failure pattern analysis for last 200 submissions |

### Flashcards (Spaced Repetition)
| Route | Method | Description |
|-------|--------|-------------|
| `/api/cards/daily` | GET | Today's review queue |
| `/api/cards/review` | POST | Submit card review result |
| `/api/cards/stats` | GET | Card review statistics |
| `/api/flashcards` | GET/POST | Manage flashcards |
| `/api/flashcards/[cardId]` | GET/PATCH/DELETE | Single card operations |

### Patterns
| Route | Method | Description |
|-------|--------|-------------|
| `/api/patterns` | GET | All patterns with user progress |
| `/api/patterns/mastery-timeline` | GET | Timeline of pattern mastery events |

### Progress & Analytics
| Route | Method | Description |
|-------|--------|-------------|
| `/api/progress` | GET | Problem progress summary |
| `/api/reflections` | GET/POST | Post-solve reflections |
| `/api/reflections/stats` | GET | Reflection accuracy breakdown |
| `/api/readiness` | GET | Interview readiness score |
| `/api/recommendations` | GET | Personalized problem recommendations |

### Learning Features
| Route | Method | Description |
|-------|--------|-------------|
| `/api/sessions` | GET/POST | Learning session management |
| `/api/quiz` | GET/POST | Quiz for lesson comprehension |
| `/api/hints` | GET | Hints for a problem (tier-based) |
| `/api/walkthroughs` | GET | Guided algorithm walkthroughs |

### Gamification
| Route | Method | Description |
|-------|--------|-------------|
| `/api/boss-challenge` | GET | Boss challenge state (available/completed/cooldown) |
| `/api/boss-challenge` | POST | Mark boss challenge complete |
| `/api/checkpoint` | GET/POST | Phase checkpoint assessment |

### Planning
| Route | Method | Description |
|-------|--------|-------------|
| `/api/plan` | GET | Generated study plan |
| `/api/feedback` | POST | User feedback submission |

### Mock Interview
| Route | Method | Description |
|-------|--------|-------------|
| `/api/mock-interview` | GET | Random unsolved Medium/Hard problem |
| `/api/mock-interview` | POST | Save interview result |

---

## Security Checklist

- [x] All routes authenticate with `auth()` before accessing DB
- [x] User IDs come from `session.user.id` (server-trusted), never from request body
- [x] All routes have `try/catch` with 500 fallback
- [x] Input validation on POST/PATCH routes (required fields checked)
- [x] No raw SQL — all DB access via Prisma (injection-safe)
- [x] No sensitive data in response (passwords, tokens not returned)

---

## XP System

| Difficulty | XP Awarded |
|-----------|-----------|
| Easy | 25 |
| Medium | 50 |
| Hard | 100 |

XP is incremented on `User.totalXP` via `{ increment: xpEarned }` after each accepted submission.

---

## Known Gaps / Future Work

1. **Rate limiting**: No rate limiting on submission endpoint — could be abused for XP farming. Consider adding `@upstash/ratelimit` or similar.
2. **`prisma db push`**: Schema changes (`targetInterviewDate`, `company[]`, etc.) need to be pushed to Atlas when connection is available.
3. **Email verification**: `/api/auth/verify-email` route exists but email sending not yet wired to a provider.
4. **Mock interview**: Currently records using `language: "mock-interview"` — queries filtering by language should exclude these.
5. **`/api/problems/daily`**: Uses skip-based random selection which can be slow on large datasets. Consider adding a `dailyProblemDate` caching field.
