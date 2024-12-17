/*
  Warnings:

  - Added the required column `lastUpdate` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `session` ADD COLUMN `lastUpdate` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `verified` BOOLEAN NOT NULL DEFAULT false;
