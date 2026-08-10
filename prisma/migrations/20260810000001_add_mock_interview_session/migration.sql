-- Migration: Add MockInterviewSession table
-- Phase 3: Mock Interview feature

CREATE TABLE "MockInterviewSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "problemIds" TEXT NOT NULL,
    "timeLimitMins" INTEGER NOT NULL DEFAULT 45,
    "submissions" TEXT NOT NULL DEFAULT '{}',
    "score" INTEGER,
    "aiFeedback" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),

    CONSTRAINT "MockInterviewSession_pkey" PRIMARY KEY ("id")
);

-- Indexes
CREATE INDEX "MockInterviewSession_userId_status_idx" ON "MockInterviewSession"("userId", "status");
CREATE INDEX "MockInterviewSession_userId_startedAt_idx" ON "MockInterviewSession"("userId", "startedAt");

-- Foreign key to User
ALTER TABLE "MockInterviewSession" ADD CONSTRAINT "MockInterviewSession_userId_fkey" 
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
