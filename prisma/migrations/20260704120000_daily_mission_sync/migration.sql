-- CreateTable
CREATE TABLE "DailyMissionDay" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "part1" JSONB,
    "part2" JSONB,
    "vocab" JSONB,
    "complete" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DailyMissionDay_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DailyMissionDay_userId_date_idx" ON "DailyMissionDay"("userId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "DailyMissionDay_userId_date_key" ON "DailyMissionDay"("userId", "date");

-- AddForeignKey
ALTER TABLE "DailyMissionDay" ADD CONSTRAINT "DailyMissionDay_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
