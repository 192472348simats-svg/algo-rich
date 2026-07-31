CREATE TABLE "DailyQuest" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "date" DATE NOT NULL,
  "questType" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "target" INTEGER NOT NULL,
  "xpReward" INTEGER NOT NULL,
  "progress" INTEGER NOT NULL DEFAULT 0,
  "claimed" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "DailyQuest_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "DailyQuest_userId_date_questType_key" ON "DailyQuest"("userId", "date", "questType");
CREATE INDEX "DailyQuest_userId_date_idx" ON "DailyQuest"("userId", "date");

ALTER TABLE "DailyQuest" ADD CONSTRAINT "DailyQuest_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
