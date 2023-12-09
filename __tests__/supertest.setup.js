const supertest = require("supertest"); // 👈 4
const createServer = require("../src/createServer"); // 👈 3
const { getPrimsa } = require("../src/data"); // 👈 4

// 👇 6
const login = async (supertest) => {
  // 👇 7
  const response = await supertest.post("/api/users/login").send({
    email: "test.user@hogent.be",
    password: "verydifficult",
  });

  // 👇 8
  if (response.statusCode !== 200) {
    throw new Error(response.body.message || "Unknown error occured");
  }

  return `Bearer ${response.body.token}`; // 👈 9
};

// 👇 1
const withServer = (setter) => {
  // 👈 4
  let server; // 👈 2

  beforeAll(async () => {
    server = await createServer(); // 👈 3

    // 👇 4
    setter({
      prisma: getPrimsa(),
      supertest: supertest(server.getApp().callback()),
    });
  });

  afterAll(async () => {
    await server.stop(); // 👈 5
  });
};

module.exports = {
  login,
  withServer,
}; // 👈 1 en 6
