# Algo Rich

Algo Rich is a Next.js learning platform for structured Python and DSA practice. 

**Database Strategy:**
- **Local Development**: PostgreSQL on `localhost` (for fast iteration with no internet dependency)
- **Production (Vercel)**: Neon Postgres serverless (managed, scalable, perfect for many users)

## Stack

- Next.js 16 with App Router
- TypeScript
- Tailwind CSS v4
- Framer Motion
- Prisma ORM
- **Local**: PostgreSQL 15+ on localhost
- **Production**: Neon Postgres on Vercel
- NextAuth v5 credentials auth

---

## Quick Start - Local Development

### Prerequisites

Choose ONE of the following:

#### Option 1: PostgreSQL via Homebrew (macOS)
```bash
brew install postgresql@15
brew services start postgresql@15
createdb algo_rich
```

#### Option 2: PostgreSQL via APT (Linux - Ubuntu/Debian)
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
createdb algo_rich -U postgres
```

#### Option 3: PostgreSQL via Windows Installer
1. Download from https://www.postgresql.org/download/windows/
2. Run installer, set superuser password to `postgres` (or your preference)
3. Open pgAdmin or psql and create database:
   ```sql
   CREATE DATABASE algo_rich;
   ```

#### Option 4: PostgreSQL via Docker (Recommended - all platforms)
```bash
docker run --name algo-rich-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_DB=algo_rich \
  -p 5432:5432 \
  -d postgres:17
```

### Setup Project

1. **Copy environment template:**
   ```bash
   cp .env.example .env.local
   ```

2. **Edit `.env.local` with your PostgreSQL password:**
   ```env
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/algo_rich?schema=public"
   DIRECT_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/algo_rich?schema=public"
   AUTH_SECRET=dev-secret-any-random-32-chars
   NEXTAUTH_URL=http://localhost:3000
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Run database migrations:**
   ```bash
   npm run build
   ```
   This will:
   - Generate Prisma client
   - Run migrations (`prisma migrate deploy`)
   - Build Next.js

5. **Start development server:**
   ```bash
   npm run dev
   ```

6. **Test database connection:**
   ```bash
   npm run db:test
   ```

7. **Check health endpoint:**
   ```bash
   curl http://localhost:3000/api/health/db
   ```
   Should return: `{"ok":true,"timestamp":"2026-03-13T..."}`

---

## Deployment to Vercel

### Step 1: Set Up Neon Database

1. Go to https://neon.tech
2. Create a PostgreSQL project (choose region closest to your users)
3. Copy the connection strings from the Neon dashboard:
   - **Pooler URL** (contains `-pooler` in hostname)
   - **Direct URL** (no `-pooler` in hostname)

### Step 2: Configure Vercel Environment Variables

In Vercel dashboard → Your Algo Rich Project → Settings → Environment Variables

Add these THREE variables:

| Name | Value | Source |
|------|-------|--------|
| `DATABASE_URL` | `postgresql://...{PROJECT}-pooler...@...neon.tech/neondb?...` | From Neon pooler connection string |
| `DIRECT_URL` | `postgresql://...{PROJECT}...@...neon.tech/neondb?...` | From Neon direct connection string (no `-pooler`) |
| `AUTH_SECRET` | Generate with: `openssl rand -base64 32` | Your secure random string |

**Important:**
- `DATABASE_URL` MUST contain `-pooler` in hostname (for serverless concurrency)
- `DIRECT_URL` must NOT contain `-pooler` (for migrations to work)
- Both must be set, or migrations will fail

### Step 3: Deploy

```bash
git push origin main
```

Vercel will automatically:
1. Install dependencies (`npm install`)
2. Generate Prisma client (`prisma generate`)
3. Run migrations (`prisma migrate deploy`)
4. Build app (`next build`)

Migrations run during build step, so schema is always in sync.

---

## Troubleshooting

### Local: "Can't reach database server at localhost:5432"

1. Check PostgreSQL is running:
   ```bash
   # If using Homebrew:
   brew services list
   
   # If using Docker:
   docker ps | grep algo-rich-postgres
   
   # If using native install, check Windows Service (Services.msc)
   ```

2. Verify `.env.local` password matches PostgreSQL:
   ```bash
   npm run db:test
   ```

3. Check database exists:
   ```bash
   psql -U postgres -c "\l"  # Should show 'algo_rich' database
   ```

### Local: "Library not loaded / DLL not found"

This might happen if PostgreSQL binaries are missing. Reinstall:
```bash
# macOS: Completely uninstall and reinstall
brew uninstall postgresql@15
brew install postgresql@15

# Windows: Use Control Panel → Programs & Features → Uninstall → Reinstall
```

### Vercel: "JWTSessionError: no matching decryption secret"

This happens when `AUTH_SECRET` changes between deployments.
- **Expected**: Users must log in again
- **Solution**: Don't change `AUTH_SECRET` after launch unless absolutely necessary
- **Prevention**: Use same secret for all deployments (set once in Vercel, then never change)

### Vercel: "DIRECT_URL is not set"

The `DIRECT_URL` variable must be set in Vercel dashboard. It's separate from `DATABASE_URL`:
- `DATABASE_URL`: For app runtime (uses connection pooling)
- `DIRECT_URL`: For migrations during build (direct connection)

Both are required for Prisma to work on Vercel.

---

## Environment Variables Reference

### Local Development (`.env.local`)

```env
# Local PostgreSQL on your laptop
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/algo_rich?schema=public"
DIRECT_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/algo_rich?schema=public"

# Dev auth secret (doesn't need to match production)
AUTH_SECRET=dev-secret-any-random-32-chars
NEXTAUTH_URL=http://localhost:3000
```

### Production (Vercel Dashboard)

Set these in Vercel → Settings → Environment Variables:

```
DATABASE_URL=postgresql://...neon-pooler...@neon.tech/neondb...
DIRECT_URL=postgresql://...neon-direct...@neon.tech/neondb...
AUTH_SECRET=<random-32-char-string>
NEXTAUTH_URL=https://your-vercel-app.vercel.app
```

**DO NOT** commit these to git. Vercel provides them at build time.

---

## Required Environment Variables

All variables needed by the app:

prisma db seed runs prisma/seed-master.ts, which seeds:

- Courses and lessons
- Problems
- Lesson-problem links

The seed flow is safe to rerun because it uses upserts for the primary content tables and upserts for lesson-problem connections.
