-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('MULTIPLE_CHOICE', 'SINGLE_CHOICE', 'SUPPLY_ANSWER');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'STAFF');

-- CreateTable
CREATE TABLE "user" (
    "id" UUID NOT NULL,
    "email" TEXT,
    "login" TEXT NOT NULL,
    "password" TEXT,
    "full_name" TEXT,
    "role" "Role" NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tests" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "instruction" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "test_scales" (
    "id" UUID NOT NULL,
    "testId" UUID NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "test_scales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scale_interpretations" (
    "id" UUID NOT NULL,
    "min_score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "max_score" DOUBLE PRECISION NOT NULL,
    "interpretation" TEXT NOT NULL,
    "testScaleId" UUID NOT NULL,

    CONSTRAINT "scale_interpretations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questions" (
    "id" UUID NOT NULL,
    "testId" UUID NOT NULL,
    "text" TEXT NOT NULL,
    "order" SMALLINT NOT NULL,
    "type" "QuestionType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scoring_rules" (
    "id" UUID NOT NULL,
    "answerId" UUID,
    "questionId" UUID NOT NULL,
    "testScaleId" UUID NOT NULL,
    "supplyText" TEXT,
    "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "scoring_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "answers" (
    "id" UUID NOT NULL,
    "questionId" UUID NOT NULL,
    "text" TEXT,
    "order" SMALLINT NOT NULL,

    CONSTRAINT "answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attempt" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "testId" UUID NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "attempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_selection" (
    "id" UUID NOT NULL,
    "attemptId" UUID NOT NULL,
    "questionId" UUID NOT NULL,

    CONSTRAINT "user_selection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attempt_scores" (
    "id" UUID NOT NULL,
    "attemptId" UUID NOT NULL,
    "testScaleId" UUID NOT NULL,
    "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "scaleInterpretationId" UUID,

    CONSTRAINT "attempt_scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_selection_answers" (
    "id" UUID NOT NULL,
    "userSelectionId" UUID NOT NULL,
    "answerId" UUID,
    "supplyText" TEXT,

    CONSTRAINT "user_selection_answers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_login_key" ON "user"("login");

-- CreateIndex
CREATE UNIQUE INDEX "scoring_rules_answerId_testScaleId_key" ON "scoring_rules"("answerId", "testScaleId");

-- CreateIndex
CREATE UNIQUE INDEX "attempt_userId_testId_key" ON "attempt"("userId", "testId");

-- CreateIndex
CREATE UNIQUE INDEX "user_selection_attemptId_questionId_key" ON "user_selection"("attemptId", "questionId");

-- AddForeignKey
ALTER TABLE "test_scales" ADD CONSTRAINT "test_scales_testId_fkey" FOREIGN KEY ("testId") REFERENCES "tests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scale_interpretations" ADD CONSTRAINT "scale_interpretations_testScaleId_fkey" FOREIGN KEY ("testScaleId") REFERENCES "test_scales"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_testId_fkey" FOREIGN KEY ("testId") REFERENCES "tests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scoring_rules" ADD CONSTRAINT "scoring_rules_answerId_fkey" FOREIGN KEY ("answerId") REFERENCES "answers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scoring_rules" ADD CONSTRAINT "scoring_rules_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scoring_rules" ADD CONSTRAINT "scoring_rules_testScaleId_fkey" FOREIGN KEY ("testScaleId") REFERENCES "test_scales"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answers" ADD CONSTRAINT "answers_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attempt" ADD CONSTRAINT "attempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attempt" ADD CONSTRAINT "attempt_testId_fkey" FOREIGN KEY ("testId") REFERENCES "tests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_selection" ADD CONSTRAINT "user_selection_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "attempt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_selection" ADD CONSTRAINT "user_selection_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attempt_scores" ADD CONSTRAINT "attempt_scores_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "attempt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attempt_scores" ADD CONSTRAINT "attempt_scores_testScaleId_fkey" FOREIGN KEY ("testScaleId") REFERENCES "test_scales"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attempt_scores" ADD CONSTRAINT "attempt_scores_scaleInterpretationId_fkey" FOREIGN KEY ("scaleInterpretationId") REFERENCES "scale_interpretations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_selection_answers" ADD CONSTRAINT "user_selection_answers_userSelectionId_fkey" FOREIGN KEY ("userSelectionId") REFERENCES "user_selection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_selection_answers" ADD CONSTRAINT "user_selection_answers_answerId_fkey" FOREIGN KEY ("answerId") REFERENCES "answers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
