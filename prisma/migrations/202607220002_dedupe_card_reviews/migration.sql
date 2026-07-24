-- CardReview represents the current SM-2 schedule for a user/card. Older app
-- versions inserted a new row for every answer. Preserve superseded schedules
-- in an archive table before retaining the newest authoritative row.
CREATE TABLE IF NOT EXISTS "CardReviewArchive" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "cardId" TEXT NOT NULL,
  "correct" BOOLEAN NOT NULL,
  "responseTimeMs" INTEGER,
  "easeFactor" DOUBLE PRECISION NOT NULL,
  "interval" INTEGER NOT NULL,
  "repetitions" INTEGER NOT NULL,
  "nextReviewAt" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL,
  "archivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO "CardReviewArchive" (
  "id", "userId", "cardId", "correct", "responseTimeMs", "easeFactor",
  "interval", "repetitions", "nextReviewAt", "createdAt"
)
SELECT
  older."id", older."userId", older."cardId", older."correct", older."responseTimeMs", older."easeFactor",
  older."interval", older."repetitions", older."nextReviewAt", older."createdAt"
FROM "CardReview" AS older
JOIN "CardReview" AS newer
  ON older."userId" = newer."userId"
  AND older."cardId" = newer."cardId"
  AND (
    older."createdAt" < newer."createdAt"
    OR (older."createdAt" = newer."createdAt" AND older."id" < newer."id")
  )
ON CONFLICT ("id") DO NOTHING;

DELETE FROM "CardReview" AS older
USING "CardReview" AS newer
WHERE older."userId" = newer."userId"
  AND older."cardId" = newer."cardId"
  AND (
    older."createdAt" < newer."createdAt"
    OR (older."createdAt" = newer."createdAt" AND older."id" < newer."id")
  );

CREATE UNIQUE INDEX IF NOT EXISTS "CardReview_userId_cardId_key"
  ON "CardReview"("userId", "cardId");
