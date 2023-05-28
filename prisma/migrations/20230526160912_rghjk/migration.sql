/*
  Warnings:

  - Added the required column `replyId` to the `GuildReactionRole` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `GuildReactionRole` ADD COLUMN `replyId` VARCHAR(191) NOT NULL;
