-- CreateTable
CREATE TABLE "StudyDay" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "part1Seconds" INTEGER NOT NULL DEFAULT 0,
    "part2Seconds" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudyDay_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "StudyDay_userId_date_idx" ON "StudyDay"("userId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "StudyDay_userId_date_key" ON "StudyDay"("userId", "date");

-- AddForeignKey
ALTER TABLE "StudyDay" ADD CONSTRAINT "StudyDay_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
