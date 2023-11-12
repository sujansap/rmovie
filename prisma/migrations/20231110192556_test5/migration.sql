-- DropForeignKey
ALTER TABLE `genreMovies` DROP FOREIGN KEY `genreMovies_movieId_fkey`;

-- AddForeignKey
ALTER TABLE `genreMovies` ADD CONSTRAINT `genreMovies_movieId_fkey` FOREIGN KEY (`movieId`) REFERENCES `movies`(`movieId`) ON DELETE CASCADE ON UPDATE CASCADE;
