# Algo Rich — AI Coding Assistant Context

## Project Overview
Algo Rich is a premium, high-performance DSA interview preparation platform built with a cutting-edge stack. It features interactive visualizations, client-side code execution, and a gamified learning path.

## Core Technology Stack
- **Framework**: Next.js 16 (App Router)
- **UI Logic**: React 19, Framer Motion, GSAP
- **Database**: PostgreSQL (Neon) with Prisma ORM
- **Auth**: NextAuth v5 (Beta) with Credentials & Middleware protection
- **Execution Engine**: Pyodide (WebAssembly-based Python in a Web Worker)
- **Monetization**: Stripe (Subscriptions & Webhooks)
- **Testing**: Vitest + JSDOM

## Architectural Conventions
### 1. Server Components First
- Use React Server Components (RSC) by default.
- Only use `'use client'` for interactive elements, hooks, or animation logic.

### 2. Database & Data Fetching
- **Singleton**: Always use the Prisma singleton from `@/lib/prisma`.
- **Parallelism**: Group independent DB calls in `Promise.all` to avoid serial waterfalls.
- **Caching**: Use `unstable_cache` for expensive global data (e.g., problem counts) with appropriate `revalidateTag`.
- **Invalidation**: Call `revalidateTag` in mutation routes to ensure fresh data.

### 3. API & Security
- **Route Guards**: Validate session via `auth()` in all API routes.
- **Rate Limiting**: Critical auth routes (Signup, Forgot Password) must implement in-memory or Redis-based rate limiting.
- **Input Validation**: Use Zod or strong regex for all user inputs.
- **Admin**: Check admin status via `isAdmin(email)` logic using the `ADMIN_EMAILS` environment variable.

### 4. Browser-Based Execution (Pyodide)
- All user-submitted code runs client-side in `public/pyodide-worker.js`.
- **Safety**: 10s execution timeout, 1MB output cap, and pattern blocking (regex) for dangerous Python imports (`os`, `subprocess`).

## Directory Structure
- `@/app`: Next.js App Router (Pages, Layouts, API)
- `@/lib`: Shared utilities, types, and logic singletons
- `@/components`: Reusable UI components
- `@/prisma`: Schema definition and seed scripts
- `@/public`: Static assets and the Pyodide worker

## Critical Guidelines
- **NEVER** use `eval()` or `exec()` on the server.
- **NEVER** expose sensitive environment variables to the browser (`NEXT_PUBLIC_` only).
- **ALWAYS** wrap high-risk interactive components in an `ErrorBoundary`.
- **ALWAYS** validate API responses on the frontend.
