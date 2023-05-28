/*
  Warnings:

  - You are about to alter the column `id` on the `GuildReactionRole` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - A unique constraint covering the columns `[guildId,messageId,roleId]` on the table `GuildReactionRole` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `guildId` to the `GuildReactionRole` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `GuildReactionRole` DROP FOREIGN KEY `GuildReactionRole_id_fkey`;

-- DropIndex
DROP INDEX `GuildReactionRole_messageId_roleId_key` ON `GuildReactionRole`;

-- AlterTable
ALTER TABLE `GuildReactionRole` ADD COLUMN `guildId` VARCHAR(191) NOT NULL,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- CreateIndex
CREATE UNIQUE INDEX `GuildReactionRole_guildId_messageId_roleId_key` ON `GuildReactionRole`(`guildId`, `messageId`, `roleId`);

-- AddForeignKey
ALTER TABLE `GuildReactionRole` ADD CONSTRAINT `GuildReactionRole_guildId_fkey` FOREIGN KEY (`guildId`) REFERENCES `Guild`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
