/*
  Warnings:

  - You are about to drop the column `reputationsEarned` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Cooldown` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GuildConfigApisCpgg` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GuildConfigAudits` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GuildConfigCounters` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GuildConfigCredits` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GuildConfigEmbeds` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GuildConfigPoints` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GuildConfigReputation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GuildConfigShop` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GuildConfigWelcome` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GuildCounters` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[guildId,userId]` on the table `GuildMember` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[guildId,userId]` on the table `GuildMemberCredit` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `Cooldown` DROP FOREIGN KEY `Cooldown_guildId_fkey`;

-- DropForeignKey
ALTER TABLE `Cooldown` DROP FOREIGN KEY `Cooldown_userId_fkey`;

-- DropForeignKey
ALTER TABLE `GuildConfigApisCpgg` DROP FOREIGN KEY `GuildConfigApisCpgg_id_fkey`;

-- DropForeignKey
ALTER TABLE `GuildConfigAudits` DROP FOREIGN KEY `GuildConfigAudits_id_fkey`;

-- DropForeignKey
ALTER TABLE `GuildConfigCounters` DROP FOREIGN KEY `GuildConfigCounters_id_fkey`;

-- DropForeignKey
ALTER TABLE `GuildConfigCredits` DROP FOREIGN KEY `GuildConfigCredits_id_fkey`;

-- DropForeignKey
ALTER TABLE `GuildConfigEmbeds` DROP FOREIGN KEY `GuildConfigEmbeds_id_fkey`;

-- DropForeignKey
ALTER TABLE `GuildConfigPoints` DROP FOREIGN KEY `GuildConfigPoints_id_fkey`;

-- DropForeignKey
ALTER TABLE `GuildConfigReputation` DROP FOREIGN KEY `GuildConfigReputation_id_fkey`;

-- DropForeignKey
ALTER TABLE `GuildConfigShop` DROP FOREIGN KEY `GuildConfigShop_id_fkey`;

-- DropForeignKey
ALTER TABLE `GuildConfigWelcome` DROP FOREIGN KEY `GuildConfigWelcome_id_fkey`;

-- DropForeignKey
ALTER TABLE `GuildCounters` DROP FOREIGN KEY `GuildCounters_guildId_fkey`;

-- DropForeignKey
ALTER TABLE `GuildMember` DROP FOREIGN KEY `GuildMember_guildId_fkey`;

-- DropForeignKey
ALTER TABLE `GuildMember` DROP FOREIGN KEY `GuildMember_userId_fkey`;

-- DropForeignKey
ALTER TABLE `GuildMemberCredit` DROP FOREIGN KEY `GuildMemberCredit_userId_guildId_fkey`;

-- DropIndex
DROP INDEX `GuildMember_userId_guildId_key` ON `GuildMember`;

-- AlterTable
ALTER TABLE `GuildMember` MODIFY `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `GuildMemberCredit` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `User` DROP COLUMN `reputationsEarned`;

-- DropTable
DROP TABLE `Cooldown`;

-- DropTable
DROP TABLE `GuildConfigApisCpgg`;

-- DropTable
DROP TABLE `GuildConfigAudits`;

-- DropTable
DROP TABLE `GuildConfigCounters`;

-- DropTable
DROP TABLE `GuildConfigCredits`;

-- DropTable
DROP TABLE `GuildConfigEmbeds`;

-- DropTable
DROP TABLE `GuildConfigPoints`;

-- DropTable
DROP TABLE `GuildConfigReputation`;

-- DropTable
DROP TABLE `GuildConfigShop`;

-- DropTable
DROP TABLE `GuildConfigWelcome`;

-- DropTable
DROP TABLE `GuildCounters`;

-- CreateTable
CREATE TABLE `GuildMemberReputation` (
    `guildId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `negative` INTEGER NOT NULL DEFAULT 0,
    `positive` INTEGER NOT NULL DEFAULT 0,

    UNIQUE INDEX `GuildMemberReputation_guildId_userId_key`(`guildId`, `userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `GuildMember_guildId_userId_key` ON `GuildMember`(`guildId`, `userId`);

-- CreateIndex
CREATE UNIQUE INDEX `GuildMemberCredit_guildId_userId_key` ON `GuildMemberCredit`(`guildId`, `userId`);

-- AddForeignKey
ALTER TABLE `GuildMemberCredit` ADD CONSTRAINT `GuildMemberCredit_guildId_userId_fkey` FOREIGN KEY (`guildId`, `userId`) REFERENCES `GuildMember`(`guildId`, `userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GuildMemberReputation` ADD CONSTRAINT `GuildMemberReputation_guildId_userId_fkey` FOREIGN KEY (`guildId`, `userId`) REFERENCES `GuildMember`(`guildId`, `userId`) ON DELETE RESTRICT ON UPDATE CASCADE;
