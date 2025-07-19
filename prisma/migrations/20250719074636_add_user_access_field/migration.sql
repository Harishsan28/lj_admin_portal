-- AlterTable
ALTER TABLE `User` ADD COLUMN `access` ENUM('full', 'partial') NOT NULL DEFAULT 'full';
