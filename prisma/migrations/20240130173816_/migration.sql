/*
  Warnings:

  - A unique constraint covering the columns `[type,providerAccountId]` on the table `Account` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Account_provider_providerAccountId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Account_type_providerAccountId_key" ON "Account"("type", "providerAccountId");
