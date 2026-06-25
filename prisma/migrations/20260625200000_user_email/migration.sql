-- AlterTable
ALTER TABLE "User" RENAME COLUMN "username" TO "email";

-- RenameIndex
ALTER INDEX "User_username_key" RENAME TO "User_email_key";
