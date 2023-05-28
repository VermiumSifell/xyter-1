-- DropForeignKey
ALTER TABLE `ApiCredentials` DROP FOREIGN KEY `ApiCredentials_guildId_fkey`;

-- DropForeignKey
ALTER TABLE `ApiCredentials` DROP FOREIGN KEY `ApiCredentials_guildId_userId_fkey`;

-- DropForeignKey
ALTER TABLE `ApiCredentials` DROP FOREIGN KEY `ApiCredentials_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Cooldown` DROP FOREIGN KEY `Cooldown_guildId_fkey`;

-- DropForeignKey
ALTER TABLE `Cooldown` DROP FOREIGN KEY `Cooldown_guildId_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Cooldown` DROP FOREIGN KEY `Cooldown_userId_fkey`;

-- DropForeignKey
ALTER TABLE `GuildCreditsSettings` DROP FOREIGN KEY `GuildCreditsSettings_id_fkey`;

-- DropForeignKey
ALTER TABLE `GuildMember` DROP FOREIGN KEY `GuildMember_guildId_fkey`;

-- DropForeignKey
ALTER TABLE `GuildMember` DROP FOREIGN KEY `GuildMember_userId_fkey`;

-- DropForeignKey
ALTER TABLE `GuildMemberCredit` DROP FOREIGN KEY `GuildMemberCredit_guildId_userId_fkey`;

-- DropForeignKey
ALTER TABLE `GuildSettings` DROP FOREIGN KEY `GuildSettings_guildCreditsSettingsId_fkey`;

-- DropForeignKey
ALTER TABLE `GuildSettings` DROP FOREIGN KEY `GuildSettings_id_fkey`;

-- DropForeignKey
ALTER TABLE `UserReputation` DROP FOREIGN KEY `UserReputation_id_fkey`;

-- CreateTable
CREATE TABLE `GuildReactionRole` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `messageId` VARCHAR(191) NOT NULL,
    `roleId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `GuildReactionRole_id_key`(`id`),
    UNIQUE INDEX `GuildReactionRole_messageId_roleId_key`(`messageId`, `roleId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `GuildMember` ADD CONSTRAINT `GuildMember_guildId_fkey` FOREIGN KEY (`guildId`) REFERENCES `Guild`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GuildMember` ADD CONSTRAINT `GuildMember_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GuildMemberCredit` ADD CONSTRAINT `GuildMemberCredit_guildId_userId_fkey` FOREIGN KEY (`guildId`, `userId`) REFERENCES `GuildMember`(`guildId`, `userId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserReputation` ADD CONSTRAINT `UserReputation_id_fkey` FOREIGN KEY (`id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GuildSettings` ADD CONSTRAINT `GuildSettings_id_fkey` FOREIGN KEY (`id`) REFERENCES `Guild`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GuildSettings` ADD CONSTRAINT `GuildSettings_guildCreditsSettingsId_fkey` FOREIGN KEY (`guildCreditsSettingsId`) REFERENCES `GuildCreditsSettings`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GuildCreditsSettings` ADD CONSTRAINT `GuildCreditsSettings_id_fkey` FOREIGN KEY (`id`) REFERENCES `Guild`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ApiCredentials` ADD CONSTRAINT `ApiCredentials_guildId_fkey` FOREIGN KEY (`guildId`) REFERENCES `Guild`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ApiCredentials` ADD CONSTRAINT `ApiCredentials_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ApiCredentials` ADD CONSTRAINT `ApiCredentials_guildId_userId_fkey` FOREIGN KEY (`guildId`, `userId`) REFERENCES `GuildMember`(`guildId`, `userId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cooldown` ADD CONSTRAINT `Cooldown_guildId_fkey` FOREIGN KEY (`guildId`) REFERENCES `Guild`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cooldown` ADD CONSTRAINT `Cooldown_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cooldown` ADD CONSTRAINT `Cooldown_guildId_userId_fkey` FOREIGN KEY (`guildId`, `userId`) REFERENCES `GuildMember`(`guildId`, `userId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GuildReactionRole` ADD CONSTRAINT `GuildReactionRole_id_fkey` FOREIGN KEY (`id`) REFERENCES `Guild`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
