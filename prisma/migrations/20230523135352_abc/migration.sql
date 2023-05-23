-- CreateTable
CREATE TABLE `ImportOldData` (
    `id` VARCHAR(191) NOT NULL,
    `done` BOOLEAN NOT NULL DEFAULT false,
    `beforeMessageId` VARCHAR(191) NULL,

    UNIQUE INDEX `ImportOldData_id_key`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
