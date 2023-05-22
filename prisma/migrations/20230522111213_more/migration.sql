-- CreateTable
CREATE TABLE `GuildSettings` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `guildEmbedSettingsId` VARCHAR(191) NULL,
    `guildCreditsSettingsId` VARCHAR(191) NULL,
    `guildPointsSettingsId` VARCHAR(191) NULL,
    `guildReputationSettingsId` VARCHAR(191) NULL,
    `guildCountersSettingsId` VARCHAR(191) NULL,
    `guildAuditsSettingsId` VARCHAR(191) NULL,
    `guildShopSettingsId` VARCHAR(191) NULL,
    `guildWelcomeSettingsId` VARCHAR(191) NULL,

    UNIQUE INDEX `GuildSettings_id_key`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GuildEmbedSettings` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `successColor` VARCHAR(191) NULL DEFAULT '#22bb33',
    `waitColor` VARCHAR(191) NULL DEFAULT '#f0ad4e',
    `errorColor` VARCHAR(191) NULL DEFAULT '#bb2124',
    `footerText` VARCHAR(191) NULL DEFAULT 'https://github.com/ZynerOrg/xyter',
    `footerIcon` VARCHAR(191) NULL DEFAULT 'https://github.com/ZynerOrg.png',

    UNIQUE INDEX `GuildEmbedSettings_id_key`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GuildCreditsSettings` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT false,
    `rate` INTEGER NOT NULL DEFAULT 1,
    `timeout` INTEGER NOT NULL DEFAULT 5,
    `workRate` INTEGER NOT NULL DEFAULT 25,
    `workTimeout` INTEGER NOT NULL DEFAULT 86400,
    `minimumLength` INTEGER NOT NULL DEFAULT 5,

    UNIQUE INDEX `GuildCreditsSettings_id_key`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GuildPointsSettings` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT false,
    `rate` INTEGER NOT NULL DEFAULT 1,
    `timeout` INTEGER NOT NULL DEFAULT 5,
    `minimumLength` INTEGER NOT NULL DEFAULT 5,

    UNIQUE INDEX `GuildPointsSettings_id_key`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GuildReputationSettings` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `GuildReputationSettings_id_key`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GuildCountersSettings` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `GuildCountersSettings_id_key`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GuildAuditsSettings` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT false,
    `channelId` VARCHAR(191) NULL,

    UNIQUE INDEX `GuildAuditsSettings_id_key`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GuildShopSettings` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `GuildShopSettings_id_key`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GuildWelcomeSettings` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT false,
    `joinChannelId` VARCHAR(191) NULL,
    `joinChannelMessage` VARCHAR(191) NULL,
    `leaveChannelId` VARCHAR(191) NULL,
    `leaveChannelMessage` VARCHAR(191) NULL,

    UNIQUE INDEX `GuildWelcomeSettings_id_key`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ApiCredentials` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `guildId` VARCHAR(191) NULL,
    `userId` VARCHAR(191) NULL,
    `apiName` VARCHAR(191) NOT NULL,
    `credentials` JSON NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `GuildSettings` ADD CONSTRAINT `GuildSettings_id_fkey` FOREIGN KEY (`id`) REFERENCES `Guild`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GuildSettings` ADD CONSTRAINT `GuildSettings_guildEmbedSettingsId_fkey` FOREIGN KEY (`guildEmbedSettingsId`) REFERENCES `GuildEmbedSettings`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GuildSettings` ADD CONSTRAINT `GuildSettings_guildCreditsSettingsId_fkey` FOREIGN KEY (`guildCreditsSettingsId`) REFERENCES `GuildCreditsSettings`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GuildSettings` ADD CONSTRAINT `GuildSettings_guildPointsSettingsId_fkey` FOREIGN KEY (`guildPointsSettingsId`) REFERENCES `GuildPointsSettings`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GuildSettings` ADD CONSTRAINT `GuildSettings_guildReputationSettingsId_fkey` FOREIGN KEY (`guildReputationSettingsId`) REFERENCES `GuildReputationSettings`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GuildSettings` ADD CONSTRAINT `GuildSettings_guildCountersSettingsId_fkey` FOREIGN KEY (`guildCountersSettingsId`) REFERENCES `GuildCountersSettings`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GuildSettings` ADD CONSTRAINT `GuildSettings_guildAuditsSettingsId_fkey` FOREIGN KEY (`guildAuditsSettingsId`) REFERENCES `GuildAuditsSettings`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GuildSettings` ADD CONSTRAINT `GuildSettings_guildShopSettingsId_fkey` FOREIGN KEY (`guildShopSettingsId`) REFERENCES `GuildShopSettings`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GuildSettings` ADD CONSTRAINT `GuildSettings_guildWelcomeSettingsId_fkey` FOREIGN KEY (`guildWelcomeSettingsId`) REFERENCES `GuildWelcomeSettings`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GuildEmbedSettings` ADD CONSTRAINT `GuildEmbedSettings_id_fkey` FOREIGN KEY (`id`) REFERENCES `Guild`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GuildCreditsSettings` ADD CONSTRAINT `GuildCreditsSettings_id_fkey` FOREIGN KEY (`id`) REFERENCES `Guild`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GuildPointsSettings` ADD CONSTRAINT `GuildPointsSettings_id_fkey` FOREIGN KEY (`id`) REFERENCES `Guild`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GuildReputationSettings` ADD CONSTRAINT `GuildReputationSettings_id_fkey` FOREIGN KEY (`id`) REFERENCES `Guild`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GuildCountersSettings` ADD CONSTRAINT `GuildCountersSettings_id_fkey` FOREIGN KEY (`id`) REFERENCES `Guild`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GuildAuditsSettings` ADD CONSTRAINT `GuildAuditsSettings_id_fkey` FOREIGN KEY (`id`) REFERENCES `Guild`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GuildShopSettings` ADD CONSTRAINT `GuildShopSettings_id_fkey` FOREIGN KEY (`id`) REFERENCES `Guild`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GuildWelcomeSettings` ADD CONSTRAINT `GuildWelcomeSettings_id_fkey` FOREIGN KEY (`id`) REFERENCES `Guild`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ApiCredentials` ADD CONSTRAINT `ApiCredentials_guildId_fkey` FOREIGN KEY (`guildId`) REFERENCES `Guild`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ApiCredentials` ADD CONSTRAINT `ApiCredentials_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ApiCredentials` ADD CONSTRAINT `ApiCredentials_guildId_userId_fkey` FOREIGN KEY (`guildId`, `userId`) REFERENCES `GuildMember`(`guildId`, `userId`) ON DELETE SET NULL ON UPDATE CASCADE;
