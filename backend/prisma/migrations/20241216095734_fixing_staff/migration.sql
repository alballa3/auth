/*
  Warnings:

  - Added the required column `password_without_hash` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `password_without_hash` VARCHAR(191) NOT NULL;
