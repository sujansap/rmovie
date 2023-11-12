/*
  Warnings:

  - A unique constraint covering the columns `[genre]` on the table `genres` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `userTypes` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `genres_genre_key` ON `genres`(`genre`);

-- CreateIndex
CREATE UNIQUE INDEX `userTypes_name_key` ON `userTypes`(`name`);
