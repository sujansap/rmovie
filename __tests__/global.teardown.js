const { shutdownData, getPrimsa, tables } = require("../src/data"); // 👈 2 en 3

// 👇 1
module.exports = async () => {
  const prisma = getPrimsa();
  // Remove any leftover data
  await prisma[tables.movieGenres].deleteMany({});
  await prisma[tables.movies].deleteMany({});
  await prisma[tables.users].deleteMany({});
  await prisma[tables.userTypes].deleteMany({});
  await prisma[tables.genres].deleteMany({});

  //await prisma[tables.genres].deleteMany();

  // Close database connection
  await shutdownData(); // 👈 3
};
