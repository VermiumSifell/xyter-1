/*
  Warnings:

  - You are about to drop the column `bonusChance` on the `GuildCreditsSettings` table. All the data in the column will be lost.
  - You are about to drop the column `penaltyChance` on the `GuildCreditsSettings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `GuildCreditsSettings` DROP COLUMN `bonusChance`,
    DROP COLUMN `penaltyChance`,
    ADD COLUMN `workBonusChance` INTEGER NOT NULL DEFAULT 30,
    ADD COLUMN `workPenaltyChance` INTEGER NOT NULL DEFAULT 10;
