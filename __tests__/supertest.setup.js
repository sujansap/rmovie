const supertest = require("supertest");

const createServer = require("../src/createServer");
const { getPrimsa } = require("../src/data");

const login = async (supertest) => {
  const response = await supertest.post("/api/users/login").send({
    email: "admin.user@hogent.be",
    password: "verydifficult",
  });

  if (response.statusCode !== 200) {
    throw new Error(response.body.message || "Unknown error occured");
  }

  return `Bearer ${response.body.token}`;
};

const withServer = (setter) => {
  let server;

  beforeAll(async () => {
    server = await createServer();

    setter({
      prisma: getPrimsa(),
      supertest: supertest(server.getApp().callback()),
    });
  });

  afterAll(async () => {
    await server.stop();
  });
};

module.exports = {
  login,
  withServer,
};
