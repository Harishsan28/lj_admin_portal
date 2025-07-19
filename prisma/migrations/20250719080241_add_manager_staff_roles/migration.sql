-- AlterTable
ALTER TABLE `User` MODIFY `role` ENUM('admin', 'user', 'manager', 'staff') NOT NULL DEFAULT 'user';
