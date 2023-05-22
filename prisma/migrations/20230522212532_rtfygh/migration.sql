/*
  Warnings:

  - You are about to drop the column `guildAuditsSettingsId` on the `GuildSettings` table. All the data in the column will be lost.
  - You are about to drop the column `guildCountersSettingsId` on the `GuildSettings` table. All the data in the column will be lost.
  - You are about to drop the column `guildEmbedSettingsId` on the `GuildSettings` table. All the data in the column will be lost.
  - You are about to drop the column `guildPointsSettingsId` on the `GuildSettings` table. All the data in the column will be lost.
  - You are about to drop the column `guildShopSettingsId` on the `GuildSettings` table. All the data in the column will be lost.
  - You are about to drop the column `guildWelcomeSettingsId` on the `GuildSettings` table. All the data in the column will be lost.
  - You are about to drop the `GuildAuditsSettings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GuildCountersSettings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GuildEmbedSettings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GuildPointsSettings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GuildShopSettings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GuildWelcomeSettings` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `GuildAuditsSettings` DROP FOREIGN KEY `GuildAuditsSettings_id_fkey`;

-- DropForeignKey
ALTER TABLE `GuildCountersSettings` DROP FOREIGN KEY `GuildCountersSettings_id_fkey`;

-- DropForeignKey
ALTER TABLE `GuildEmbedSettings` DROP FOREIGN KEY `GuildEmbedSettings_id_fkey`;

-- DropForeignKey
ALTER TABLE `GuildPointsSettings` DROP FOREIGN KEY `GuildPointsSettings_id_fkey`;

-- DropForeignKey
ALTER TABLE `GuildSettings` DROP FOREIGN KEY `GuildSettings_guildAuditsSettingsId_fkey`;

-- DropForeignKey
ALTER TABLE `GuildSettings` DROP FOREIGN KEY `GuildSettings_guildCountersSettingsId_fkey`;

-- DropForeignKey
ALTER TABLE `GuildSettings` DROP FOREIGN KEY `GuildSettings_guildEmbedSettingsId_fkey`;

-- DropForeignKey
ALTER TABLE `GuildSettings` DROP FOREIGN KEY `GuildSettings_guildPointsSettingsId_fkey`;

-- DropForeignKey
ALTER TABLE `GuildSettings` DROP FOREIGN KEY `GuildSettings_guildShopSettingsId_fkey`;

-- DropForeignKey
ALTER TABLE `GuildSettings` DROP FOREIGN KEY `GuildSettings_guildWelcomeSettingsId_fkey`;

-- DropForeignKey
ALTER TABLE `GuildShopSettings` DROP FOREIGN KEY `GuildShopSettings_id_fkey`;

-- DropForeignKey
ALTER TABLE `GuildWelcomeSettings` DROP FOREIGN KEY `GuildWelcomeSettings_id_fkey`;

-- AlterTable
ALTER TABLE `GuildSettings` DROP COLUMN `guildAuditsSettingsId`,
    DROP COLUMN `guildCountersSettingsId`,
    DROP COLUMN `guildEmbedSettingsId`,
    DROP COLUMN `guildPointsSettingsId`,
    DROP COLUMN `guildShopSettingsId`,
    DROP COLUMN `guildWelcomeSettingsId`;

-- DropTable
DROP TABLE `GuildAuditsSettings`;

-- DropTable
DROP TABLE `GuildCountersSettings`;

-- DropTable
DROP TABLE `GuildEmbedSettings`;

-- DropTable
DROP TABLE `GuildPointsSettings`;

-- DropTable
DROP TABLE `GuildShopSettings`;

-- DropTable
DROP TABLE `GuildWelcomeSettings`;
