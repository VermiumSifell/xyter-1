-- AlterTable
ALTER TABLE `GuildCreditsSettings` ADD COLUMN `bonusChance` INTEGER NOT NULL DEFAULT 30,
    ADD COLUMN `penaltyChance` INTEGER NOT NULL DEFAULT 10;
