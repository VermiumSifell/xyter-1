/*
  Warnings:

  - You are about to drop the column `guildReputationSettingsId` on the `GuildSettings` table. All the data in the column will be lost.
  - You are about to drop the `GuildMemberReputation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GuildReputationSettings` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `GuildMemberReputation` DROP FOREIGN KEY `GuildMemberReputation_guildId_userId_fkey`;

-- DropForeignKey
ALTER TABLE `GuildReputationSettings` DROP FOREIGN KEY `GuildReputationSettings_id_fkey`;

-- DropForeignKey
ALTER TABLE `GuildSettings` DROP FOREIGN KEY `GuildSettings_guildReputationSettingsId_fkey`;

-- AlterTable
ALTER TABLE `GuildSettings` DROP COLUMN `guildReputationSettingsId`;

-- DropTable
DROP TABLE `GuildMemberReputation`;

-- DropTable
DROP TABLE `GuildReputationSettings`;

-- CreateTable
CREATE TABLE `UserReputation` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `negative` INTEGER NOT NULL DEFAULT 0,
    `positive` INTEGER NOT NULL DEFAULT 0,

    UNIQUE INDEX `UserReputation_id_key`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserReputation` ADD CONSTRAINT `UserReputation_id_fkey` FOREIGN KEY (`id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
