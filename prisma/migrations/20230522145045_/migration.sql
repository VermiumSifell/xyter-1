/*
  Warnings:

  - A unique constraint covering the columns `[guildId,apiName]` on the table `ApiCredentials` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,apiName]` on the table `ApiCredentials` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `ApiCredentials_guildId_apiName_key` ON `ApiCredentials`(`guildId`, `apiName`);

-- CreateIndex
CREATE UNIQUE INDEX `ApiCredentials_userId_apiName_key` ON `ApiCredentials`(`userId`, `apiName`);
