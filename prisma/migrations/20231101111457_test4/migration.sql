-- AlterTable
ALTER TABLE `movies` MODIFY `poster` LONGTEXT NOT NULL,
    MODIFY `synopsis` LONGTEXT NOT NULL;

-- AlterTable
ALTER TABLE `reviews` MODIFY `review` LONGTEXT NOT NULL;

-- AlterTable
ALTER TABLE `users` MODIFY `about` LONGTEXT NULL;
