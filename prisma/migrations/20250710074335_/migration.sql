-- AlterTable
ALTER TABLE `user` ADD COLUMN `status` ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active';
