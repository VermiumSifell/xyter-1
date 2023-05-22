-- DropIndex
DROP INDEX `GuildMemberCredit_userId_guildId_key` ON `GuildMemberCredit`;

-- AddForeignKey
ALTER TABLE `GuildMember` ADD CONSTRAINT `GuildMember_guildId_fkey` FOREIGN KEY (`guildId`) REFERENCES `Guild`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GuildMember` ADD CONSTRAINT `GuildMember_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
