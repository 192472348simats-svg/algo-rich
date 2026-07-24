-- These indexes are non-destructive and support the production query paths for
-- due reviews, daily flashcards, and a user's accepted submissions.
CREATE INDEX IF NOT EXISTS "Submission_userId_status_createdAt_idx"
  ON "Submission"("userId", "status", "createdAt");

CREATE INDEX IF NOT EXISTS "FlashCard_userId_nextReview_idx"
  ON "FlashCard"("userId", "nextReview");

CREATE INDEX IF NOT EXISTS "CardReview_userId_nextReviewAt_idx"
  ON "CardReview"("userId", "nextReviewAt");

CREATE INDEX IF NOT EXISTS "CardReview_userId_cardId_createdAt_idx"
  ON "CardReview"("userId", "cardId", "createdAt");
