/*
  Warnings:

  - Added the required column `poster` to the `movies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `synopsis` to the `movies` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `movies` ADD COLUMN `poster` VARCHAR(191) NOT NULL,
    ADD COLUMN `synopsis` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `about` VARCHAR(191) NULL;
