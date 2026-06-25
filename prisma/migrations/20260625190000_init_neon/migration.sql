-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VaultWord" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "word" TEXT NOT NULL,
    "lowestAccuracy" INTEGER NOT NULL,
    "lastAccuracy" INTEGER NOT NULL,
    "errorType" TEXT NOT NULL,
    "errorLabel" TEXT NOT NULL,
    "context" TEXT NOT NULL DEFAULT '',
    "timesSeen" INTEGER NOT NULL DEFAULT 1,
    "practiceCount" INTEGER NOT NULL DEFAULT 0,
    "lastSeenAt" TIMESTAMP(3) NOT NULL,
    "lastPracticedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VaultWord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Evaluation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "transcript" TEXT NOT NULL,
    "overallScore" INTEGER NOT NULL,
    "structureScore" INTEGER NOT NULL,
    "contentScore" INTEGER NOT NULL,
    "phraseologyScore" INTEGER NOT NULL,
    "pronunciationScore" INTEGER NOT NULL,
    "icaoLevel" INTEGER,
    "icaoCriteria" TEXT,
    "summary" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Evaluation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE INDEX "VaultWord_userId_idx" ON "VaultWord"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "VaultWord_userId_word_key" ON "VaultWord"("userId", "word");

-- CreateIndex
CREATE INDEX "Evaluation_userId_createdAt_idx" ON "Evaluation"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "VaultWord" ADD CONSTRAINT "VaultWord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evaluation" ADD CONSTRAINT "Evaluation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
