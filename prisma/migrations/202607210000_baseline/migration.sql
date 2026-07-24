-- CreateTable
CREATE TABLE "AdminAuditLog" (
    "id" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "targetId" TEXT,
    "metadata" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminAuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CardReview" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "correct" BOOLEAN NOT NULL,
    "responseTimeMs" INTEGER,
    "easeFactor" DOUBLE PRECISION NOT NULL DEFAULT 2.5,
    "interval" INTEGER NOT NULL DEFAULT 1,
    "repetitions" INTEGER NOT NULL DEFAULT 0,
    "nextReviewAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CardReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL DEFAULT 'beginner',
    "icon" TEXT NOT NULL DEFAULT 'ðŸ“˜',
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Feedback" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "type" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "page" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FlashCard" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "front" TEXT NOT NULL,
    "back" TEXT NOT NULL,
    "code" TEXT,
    "patternId" TEXT,
    "ease" DOUBLE PRECISION NOT NULL DEFAULT 2.5,
    "interval" INTEGER NOT NULL DEFAULT 1,
    "repetitions" INTEGER NOT NULL DEFAULT 0,
    "nextReview" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FlashCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lesson" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "codeExample" TEXT,
    "order" INTEGER NOT NULL,
    "difficulty" TEXT NOT NULL,
    "estimatedTime" INTEGER NOT NULL,

    CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LessonProblem" (
    "id" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "LessonProblem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pattern" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "whenToUse" TEXT NOT NULL,
    "template" TEXT NOT NULL,
    "timeComplexity" TEXT NOT NULL,
    "spaceComplexity" TEXT NOT NULL,
    "difficulty" INTEGER NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "whenNotToUse" TEXT,
    "commonMistakes" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pattern_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PatternProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "patternSlug" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'locked',
    "visualizationWatched" BOOLEAN NOT NULL DEFAULT false,
    "memoryVisualWatched" BOOLEAN NOT NULL DEFAULT false,
    "templateStudied" BOOLEAN NOT NULL DEFAULT false,
    "quizPassed" BOOLEAN NOT NULL DEFAULT false,
    "recognitionAccuracy" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "problemsSolved" INTEGER NOT NULL DEFAULT 0,
    "averageTime" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PatternProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PredictionCard" (
    "id" TEXT NOT NULL,
    "challengeId" TEXT,
    "type" TEXT NOT NULL,
    "topic" TEXT,
    "difficulty" TEXT NOT NULL,
    "treeValues" TEXT,
    "question" TEXT NOT NULL,
    "visualData" TEXT,
    "options" TEXT,
    "correctAnswer" TEXT NOT NULL,
    "explanation" TEXT NOT NULL,
    "xpReward" INTEGER NOT NULL DEFAULT 10,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PredictionCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Problem" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "pattern" TEXT,
    "topics" TEXT,
    "companies" TEXT,
    "companyTags" TEXT,
    "company" TEXT DEFAULT '',
    "description" TEXT NOT NULL,
    "examples" TEXT,
    "constraints" TEXT,
    "hints" TEXT,
    "starterCode" TEXT NOT NULL,
    "solutionCode" TEXT,
    "solutionExplanation" TEXT,
    "timeComplexity" TEXT,
    "spaceComplexity" TEXT,
    "testCases" TEXT NOT NULL,
    "hiddenTestCases" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "topicOrder" INTEGER NOT NULL DEFAULT 0,
    "category" TEXT DEFAULT 'DSA',
    "solutionApproach" TEXT,
    "visualizationType" TEXT,
    "phase" INTEGER NOT NULL DEFAULT 3,
    "weekNumber" INTEGER NOT NULL DEFAULT 1,
    "prerequisiteProblems" TEXT,
    "conceptTaught" TEXT,
    "correctPattern" TEXT,
    "correctTimeComplexity" TEXT,
    "correctSpaceComplexity" TEXT,
    "isOptimal" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Problem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProblemReview" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,
    "easeFactor" DOUBLE PRECISION NOT NULL DEFAULT 2.5,
    "interval" INTEGER NOT NULL DEFAULT 1,
    "repetitions" INTEGER NOT NULL DEFAULT 0,
    "nextReviewAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastRating" INTEGER,
    "totalReviews" INTEGER NOT NULL DEFAULT 0,
    "lastReviewedAt" TIMESTAMP(3),
    "enrolledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProblemReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Progress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "masteryLevel" TEXT NOT NULL DEFAULT 'none',
    "practicedAt" TIMESTAMP(3),

    CONSTRAINT "Progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuizResult" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "quizType" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "question" TEXT NOT NULL DEFAULT 'book',
    "userAnswer" TEXT NOT NULL DEFAULT 'book',
    "correct" BOOLEAN NOT NULL,
    "timeSpent" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuizResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reflection" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,
    "submissionId" TEXT,
    "patternUsed" TEXT,
    "timeComplexity" TEXT,
    "spaceComplexity" TEXT,
    "canOptimize" TEXT,
    "approachExplanation" TEXT,
    "patternCorrect" BOOLEAN,
    "timeCorrect" BOOLEAN,
    "spaceCorrect" BOOLEAN,
    "optimizeCorrect" BOOLEAN,
    "solveTimeSeconds" INTEGER,
    "skipped" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reflection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SessionProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sessionSlug" TEXT NOT NULL,
    "currentStageIndex" INTEGER NOT NULL DEFAULT 0,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "stageResults" TEXT NOT NULL DEFAULT '{}',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "totalXPEarned" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "SessionProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Submission" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'python',
    "status" TEXT NOT NULL,
    "passedTests" INTEGER NOT NULL DEFAULT 0,
    "totalTests" INTEGER NOT NULL DEFAULT 0,
    "executionTime" INTEGER,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "experienceLevel" TEXT,
    "learningGoal" TEXT,
    "onboardingCompleted" BOOLEAN NOT NULL DEFAULT false,
    "dailyGoalMinutes" INTEGER NOT NULL DEFAULT 20,
    "totalXP" INTEGER NOT NULL DEFAULT 0,
    "firstLessonAt" TIMESTAMP(3),
    "firstSolveAt" TIMESTAMP(3),
    "firstVisualizerAt" TIMESTAMP(3),
    "firstPlanAt" TIMESTAMP(3),
    "currentPhase" INTEGER NOT NULL DEFAULT 1,
    "currentWeek" INTEGER NOT NULL DEFAULT 1,
    "phaseStartedAt" TIMESTAMP(3),
    "phase1CompletedAt" TIMESTAMP(3),
    "phase2CompletedAt" TIMESTAMP(3),
    "phase3CompletedAt" TIMESTAMP(3),
    "phase4CompletedAt" TIMESTAMP(3),
    "targetInterviewDate" TIMESTAMP(3),
    "lastBossCompletedAt" TIMESTAMP(3),
    "bossProblemsWon" INTEGER NOT NULL DEFAULT 0,
    "emailVerified" BOOLEAN NOT NULL DEFAULT true,
    "verificationToken" TEXT,
    "verificationExpiry" TIMESTAMP(3),
    "resetToken" TEXT,
    "resetTokenExpiry" TIMESTAMP(3),
    "stripeCustomerId" TEXT,
    "stripeSubscriptionId" TEXT,
    "stripePriceId" TEXT,
    "stripeCurrentPeriodEnd" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPreferences" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "experienceLevel" TEXT NOT NULL,
    "learningGoal" TEXT NOT NULL,
    "dailyGoalMins" INTEGER NOT NULL DEFAULT 30,
    "onboardingDone" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserPreferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WalkthroughProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "walkthroughId" TEXT NOT NULL,
    "currentStep" INTEGER NOT NULL DEFAULT 0,
    "totalSteps" INTEGER NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "progressData" JSONB DEFAULT '{}',

    CONSTRAINT "WalkthroughProgress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AdminAuditLog_action_createdAt_idx" ON "AdminAuditLog"("action" ASC, "createdAt" ASC);

-- CreateIndex
CREATE INDEX "AdminAuditLog_adminId_createdAt_idx" ON "AdminAuditLog"("adminId" ASC, "createdAt" ASC);

-- CreateIndex
CREATE INDEX "AdminAuditLog_createdAt_idx" ON "AdminAuditLog"("createdAt" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Course_slug_key" ON "Course"("slug" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Lesson_slug_key" ON "Lesson"("slug" ASC);

-- CreateIndex
CREATE INDEX "LessonProblem_lessonId_idx" ON "LessonProblem"("lessonId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "LessonProblem_lessonId_problemId_key" ON "LessonProblem"("lessonId" ASC, "problemId" ASC);

-- CreateIndex
CREATE INDEX "LessonProblem_problemId_idx" ON "LessonProblem"("problemId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Pattern_slug_key" ON "Pattern"("slug" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "PatternProgress_userId_patternSlug_key" ON "PatternProgress"("userId" ASC, "patternSlug" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "PredictionCard_challengeId_key" ON "PredictionCard"("challengeId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Problem_slug_key" ON "Problem"("slug" ASC);

-- CreateIndex
CREATE INDEX "ProblemReview_userId_nextReviewAt_idx" ON "ProblemReview"("userId" ASC, "nextReviewAt" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "ProblemReview_userId_problemId_key" ON "ProblemReview"("userId" ASC, "problemId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Progress_userId_lessonId_key" ON "Progress"("userId" ASC, "lessonId" ASC);

-- CreateIndex
CREATE INDEX "Reflection_userId_createdAt_idx" ON "Reflection"("userId" ASC, "createdAt" ASC);

-- CreateIndex
CREATE INDEX "Reflection_userId_problemId_idx" ON "Reflection"("userId" ASC, "problemId" ASC);

-- CreateIndex
CREATE INDEX "SessionProgress_userId_completed_idx" ON "SessionProgress"("userId" ASC, "completed" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "SessionProgress_userId_sessionSlug_key" ON "SessionProgress"("userId" ASC, "sessionSlug" ASC);

-- CreateIndex
CREATE INDEX "Submission_problemId_idx" ON "Submission"("problemId" ASC);

-- CreateIndex
CREATE INDEX "Submission_userId_idx" ON "Submission"("userId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "User_stripeCustomerId_key" ON "User"("stripeCustomerId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "User_stripeSubscriptionId_key" ON "User"("stripeSubscriptionId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "UserPreferences_userId_key" ON "UserPreferences"("userId" ASC);

-- CreateIndex
CREATE INDEX "WalkthroughProgress_userId_isCompleted_idx" ON "WalkthroughProgress"("userId" ASC, "isCompleted" ASC);

-- CreateIndex
CREATE INDEX "WalkthroughProgress_userId_walkthroughId_idx" ON "WalkthroughProgress"("userId" ASC, "walkthroughId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "WalkthroughProgress_userId_walkthroughId_key" ON "WalkthroughProgress"("userId" ASC, "walkthroughId" ASC);

-- AddForeignKey
ALTER TABLE "CardReview" ADD CONSTRAINT "CardReview_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "PredictionCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardReview" ADD CONSTRAINT "CardReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlashCard" ADD CONSTRAINT "FlashCard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonProblem" ADD CONSTRAINT "LessonProblem_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonProblem" ADD CONSTRAINT "LessonProblem_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatternProgress" ADD CONSTRAINT "PatternProgress_patternSlug_fkey" FOREIGN KEY ("patternSlug") REFERENCES "Pattern"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatternProgress" ADD CONSTRAINT "PatternProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Problem" ADD CONSTRAINT "Problem_pattern_fkey" FOREIGN KEY ("pattern") REFERENCES "Pattern"("slug") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProblemReview" ADD CONSTRAINT "ProblemReview_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProblemReview" ADD CONSTRAINT "ProblemReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Progress" ADD CONSTRAINT "Progress_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Progress" ADD CONSTRAINT "Progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizResult" ADD CONSTRAINT "QuizResult_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reflection" ADD CONSTRAINT "Reflection_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reflection" ADD CONSTRAINT "Reflection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionProgress" ADD CONSTRAINT "SessionProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPreferences" ADD CONSTRAINT "UserPreferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WalkthroughProgress" ADD CONSTRAINT "WalkthroughProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;


