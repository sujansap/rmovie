const config = require("config"); // 👈 2

const { initializeLogger } = require("../src/core/logging"); // 👈 2
const Role = require("../src/core/roles"); // 👈 4
const { getPrimsa, tables } = require("../src/data"); // 👈 3 en 4

// 👇 1
module.exports = async () => {
  // Create a database connection
  // 👇 2
  initializeLogger({
    level: config.get("log.level"),
    disabled: config.get("log.disabled"),
  });

  // Insert a test user with password 12345678
  const prisma = getPrimsa(); // 👈 3

  console.log("we have come here!!!! to the send data file");

  await prisma[tables.userTypes].createMany({
    data: [
      {
        userTypeId: 1,
        name: "admin",
      },
      {
        userTypeId: 2,
        name: "user",
      },
    ],
  });

  await prisma[tables.genres].createMany({
    data: [
      {
        genreId: 1,
        genre: "action",
      },
      {
        genreId: 2,
        genre: "comedy",
      },
    ],
  });

  await prisma[tables.users].createMany({
    data: [
      {
        userId: 2,
        username: "Test_User",
        email: "test.user@hogent.be",
        password:
          "$argon2id$v=19$m=131072,t=6,p=4$7A7q0MvdTJ4pWSp/ZZjITw$EmMs3VBVuF5H9vMzsQiKWVYroKHG+j/WxjVmvjJIUmE",
        about: "this is also an admin user",
        userTypeId: 1,
      },
      {
        userId: 1,
        username: "Admin_User",
        email: "admin.user@hogent.be",
        password:
          "$argon2id$v=19$m=131072,t=6,p=4$7A7q0MvdTJ4pWSp/ZZjITw$EmMs3VBVuF5H9vMzsQiKWVYroKHG+j/WxjVmvjJIUmE",
        about: "this is an amdin",
        userTypeId: 1,
      },
    ],
  });
};
