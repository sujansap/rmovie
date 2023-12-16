const supertest = require("supertest");

const { tables } = require("../../src/data/index");
const { withServer, login } = require("../supertest.setup");
const { testAuthHeader } = require("../common/auth");

const data = {
  userTypes: [
    {
      name: "user",
    },
    {
      name: "admin",
    },
  ],
  users: [
    {
      userId: 1,
      username: "janmap",
      email: "japmap@example.com",
      password: "password123",
      about: "This is a test user.",
      userTypeId: 1,
    },
    {
      userId: 2,
      username: "jan2map",
      email: "jap2map@example.com",
      password: "password123",
      about: "This is a test 2 user.",
      userTypeId: 1,
    },
  ],
  genres: [
    {
      genre: "action",
    },
    {
      genre: "comedy",
    },
  ],
  movies: [
    {
      movieId: 1,
      title: "Avengers",
      synopsis: "This is a test movie.",
      poster: "testmovie.jpg",
      userId: 1,
    },
    {
      movieId: 2,
      title: "Avengers 2",
      synopsis: "This is a second test movie.",
      poster: "testmovie2.jpg",
      userId: 1,
    },
  ],
  reviews: [
    {
      reviewId: 1,
      userId: 1,
      movieId: 1,
      rating: 100,
      review: "Great movie!",
    },
    {
      reviewId: 2,
      userId: 2,
      movieId: 1,
      rating: 100,
      review: "this movie is amazing",
    },
  ],
  genreMovies: [
    {
      genreId: 1,
      movieId: 1,
    },
    {
      genreId: 2,
      movieId: 1,
    },
  ],
};

const dataToDelete = {
  users: [1, 2],
  movies: [1, 2],
  review: [1, 2],
  genreMovies: [1, 2],
};
describe("Movies", () => {
  let request;
  let prisma;
  let authHeader;

  withServer(({ supertest, prisma: p }) => {
    request = supertest;
    prisma = p;
  });

  beforeAll(async () => {
    authHeader = await login(request); // 👈 3
  });

  const url = "/api/movies";
  describe("GET /api/movies", () => {
    beforeAll(async () => {
      await prisma[tables.movies].createMany({ data: data.movies });
    });

    afterAll(async () => {
      await prisma[tables.movies].deleteMany({
        where: {
          movieId: {
            in: dataToDelete.movies,
          },
        },
      });
    });

    it("should 200 and return all movies", async () => {
      const response = await request.get(url).set("Authorization", authHeader);
      expect(response.status).toBe(200);
      console.log("the amout of items :" + response.body.items.length);
      expect(response.body.items.length).toBe(2);

      expect(response.body.items).toEqual([
        {
          movieId: 1,
          title: "Avengers",
          synopsis: "This is a test movie.",
          poster: "testmovie.jpg",
          userId: 1,
        },
        {
          movieId: 2,
          title: "Avengers 2",
          synopsis: "This is a second test movie.",
          poster: "testmovie2.jpg",
          userId: 1,
        },
      ]);
    });

    it("should 400 when given an argument", async () => {
      const response = await request
        .get(`${url}?invalid=true`)
        .set("Authorization", authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.query).toHaveProperty("invalid");
    });

    testAuthHeader(() => request.get(url));
  });

  describe("GET /api/movies/:id", () => {
    beforeAll(async () => {
      await prisma[tables.movies].createMany({ data: data.movies });
    });

    afterAll(async () => {
      await prisma[tables.movies].deleteMany({
        where: {
          movieId: {
            in: dataToDelete.movies,
          },
        },
      });
    });

    it("should 200 and return the movie", async () => {
      const response = await request
        .get(`${url}/1`)
        .set("Authorization", authHeader);

      expect(response.status).toBe(200);

      expect(response.body.items).toEqual({
        movieId: 1,
        title: "Avengers",
        synopsis: "This is a test movie.",
        poster: "testmovie.jpg",
        userId: 1,
        genreMovies: [],
      });
    });

    it("should 404 when requesting not existing movie", async () => {
      const response = await request
        .get(`${url}/3`)
        .set("Authorization", authHeader);

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: "NOT_FOUND",
        message: "No movie with id 3 exists",
        details: {
          mid: 3,
        },
      });
      expect(response.body.stack).toBeTruthy();
    });

    it("should 400 when given an argument", async () => {
      const response = await request
        .get(`${url}/1?invalid=true`)
        .set("Authorization", authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.query).toHaveProperty("invalid");
    });
  });

  describe("GET /api/movies/:id/genres", () => {
    beforeAll(async () => {
      await prisma[tables.movies].createMany({ data: data.movies });
      //await prisma[tables.reviews].createMany({data:data.reviews});
      await prisma[tables.movieGenres].createMany({ data: data.genreMovies });
    });

    afterAll(async () => {
      await prisma[tables.movies].deleteMany({
        where: {
          movieId: {
            in: dataToDelete.movies,
          },
        },
      });
    });

    it("should 200 and return all the movie genres", async () => {
      const response = await request
        .get(`${url}/1/genres`)
        .set("Authorization", authHeader);

      expect(response.status).toBe(200);

      expect(response.body).toEqual(["action", "comedy"]);
    });

    it("should 400 when given an argument", async () => {
      const response = await request
        .get(`${url}/1/genres?invalid=true`)
        .set("Authorization", authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.query).toHaveProperty("invalid");
    });

    it("should 404 when requesting genres for movies that don't have it", async () => {
      const response = await request
        .get(`${url}/2/genres`)
        .set("Authorization", authHeader);

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: "NOT_FOUND",
        message: "No genres for movie with id 2 exist",
        details: {
          mid: 2,
        },
      });
      expect(response.body.stack).toBeTruthy();
    });

    it("should 404 when requesting not existing movie", async () => {
      const response = await request
        .get(`${url}/3`)
        .set("Authorization", authHeader);

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: "NOT_FOUND",
        message: "No movie with id 3 exists",
        details: {
          mid: 3,
        },
      });
      expect(response.body.stack).toBeTruthy();
    });
  });

  describe("GET /api/movies/:id/rating", () => {
    beforeAll(async () => {
      await prisma[tables.movies].createMany({ data: data.movies });
      await prisma[tables.reviews].createMany({ data: data.reviews });
    });

    afterAll(async () => {
      await prisma[tables.movies].deleteMany({
        where: {
          movieId: {
            in: dataToDelete.movies,
          },
        },
      });
    });

    it("should 200 and return the rating", async () => {
      const response = await request
        .get(`${url}/1/rating`)
        .set("Authorization", authHeader);

      expect(response.status).toBe(200);

      expect(response.body.items).toEqual({ rating: 100 });
    });

    it("should return -1 if no rating yet", async () => {
      const response = await request
        .get(`${url}/2/rating`)
        .set("Authorization", authHeader);

      expect(response.status).toBe(200);

      expect(response.body.items).toEqual({ rating: -1 });
    });
  });

  describe("GET /api/movies/genres", () => {
    it("should 200 and return the rating", async () => {
      const response = await request
        .get(`${url}/genres`)
        .set("Authorization", authHeader);

      expect(response.status).toBe(200);

      expect(response.body.items).toEqual([
        {
          genre: "action",
          genreId: 1,
        },
        {
          genre: "comedy",
          genreId: 2,
        },
      ]);
    });
  });

  describe("GET /api/movies/:id/reviews", () => {
    beforeAll(async () => {
      await prisma[tables.movies].createMany({ data: data.movies });
      await prisma[tables.reviews].createMany({
        data: data.reviews,
      });
    });

    afterAll(async () => {
      await prisma[tables.movies].deleteMany({
        where: {
          movieId: {
            in: dataToDelete.movies,
          },
        },
      });
    });

    it("should 200 and return all the reviews for the movie", async () => {
      const response = await request
        .get(`${url}/1/reviews`)
        .set("Authorization", authHeader);
      expect(response.status).toBe(200);

      const removeDate = (response) => {
        return response.map(({ date, ...rest }) => rest);
      };

      expect(removeDate(response.body.items)).toEqual([
        {
          movie: "Avengers",
          movieId: 1,
          rating: 100,
          poster: "testmovie.jpg",
          review: "Great movie!",
          reviewId: 1,
          user: "Test_User",
          userId: 1,
        },
        {
          movie: "Avengers",
          movieId: 1,
          rating: 100,
          poster: "testmovie.jpg",
          review: "this movie is amazing",
          reviewId: 2,
          user: "Admin_User",
          userId: 2,
        },
      ]);
    });

    it("should 404 when requesting not existing review", async () => {
      const response = await request
        .get(`${url}/2/reviews`)
        .set("Authorization", authHeader);

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: "NOT_FOUND",
        message: "No reviews for movie with id 2 exist",
        details: {
          mid: 2,
        },
      });
      expect(response.body.stack).toBeTruthy();
    });

    it("should 400 when given an argument", async () => {
      const response = await request
        .get(`${url}/1/reviews?invalid=true`)
        .set("Authorization", authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.query).toHaveProperty("invalid");
    });

    testAuthHeader(() => request.get(`${url}/1/reviews`));
  });

  describe("GET /api/movies/:id/review", () => {
    beforeAll(async () => {
      await prisma[tables.movies].createMany({ data: data.movies });
      await prisma[tables.reviews].createMany({
        data: data.reviews,
      });
    });

    afterAll(async () => {
      await prisma[tables.movies].deleteMany({
        where: {
          movieId: {
            in: dataToDelete.movies,
          },
        },
      });
    });

    it("should 200 and return the review for the movie for the logged in user", async () => {
      const response = await request
        .get(`${url}/1/review`)
        .set("Authorization", authHeader);
      expect(response.status).toBe(200);

      const removeDate = (response) => {
        delete response.date;

        return response;
      };
      expect(removeDate(response.body.items)).toEqual({
        //date: "2023-12-09T11:26:33.802Z",
        movieId: 1,
        poster: "testmovie.jpg",
        rating: 100,
        review: "Great movie!",
        reviewId: 1,
        title: "Avengers",
        userId: 1,
        username: "Test_User",
      });
    });

    it("should 404 when requesting not existing review", async () => {
      const response = await request
        .get(`${url}/2/review`)
        .set("Authorization", authHeader);

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: "NOT_FOUND",
        message: "No review for movie with id 2 exists for the user with id 1",
        details: {
          mid: 2,
          uid: 1,
        },
      });
      expect(response.body.stack).toBeTruthy();
    });

    it("should 400 when given an argument", async () => {
      const response = await request
        .get(`${url}/1/review?invalid=true`)
        .set("Authorization", authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.query).toHaveProperty("invalid");
    });

    testAuthHeader(() => request.get(`${url}/1/review`));
  });

  describe("POST /api/movies", () => {
    let toDeleteMovie = 0;
    beforeAll(async () => {});

    afterAll(async () => {
      console.log(toDeleteMovie);

      await prisma[tables.movies].delete({
        where: {
          movieId: toDeleteMovie,
        },
      });
    });

    it("it should have posted movie", async () => {
      const response = await request
        .post(url)
        .set("Authorization", authHeader)
        .send({
          title: "Avengers",
          synopsis: "This is a test movie created to test.",
          poster: "https://img.fruugo.com/product/7/41/14532417_max.jpg",
          genres: ["action", "comedy"],
        });

      toDeleteMovie = response.body.movieId;
      //console.log(toDelete);
      expect(response.status).toBe(201);
      expect(response.body.movieId).toBeTruthy();
      expect(response.body.title).toBe("Avengers");
      expect(response.body.synopsis).toBe(
        "This is a test movie created to test."
      );
      expect(response.body.poster).toBe(
        "https://img.fruugo.com/product/7/41/14532417_max.jpg"
      );
      expect(response.body.userId).toBe(1);
    });

    it("should 500 when genre doesn't exist", async () => {
      const response = await request
        .post(url)
        .set("Authorization", authHeader)
        .send({
          title: "Avengers",
          synopsis: "This is a test movie created to test.",
          poster: "https://img.fruugo.com/product/7/41/14532417_max.jpg",
          genres: ["invalid"],
        });

      expect(response.statusCode).toBe(500);
      expect(response.body.code).toBe("INTERNAL_SERVER_ERROR");
      //expect(response.body.details.body).toHaveProperty("genre");
    });

    it("should 400 when missing title", async () => {
      const response = await request
        .post(url)
        .set("Authorization", authHeader)
        .send({
          synopsis: "This is a test movie created to test.",
          poster: "https://img.fruugo.com/product/7/41/14532417_max.jpg",
          genres: ["action", "comedy"],
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.body).toHaveProperty("title");
    });

    it("should 400 when missing synopsis", async () => {
      const response = await request
        .post(url)
        .set("Authorization", authHeader)
        .send({
          title: "Avengers",
          poster: "https://img.fruugo.com/product/7/41/14532417_max.jpg",
          genres: ["action", "comedy"],
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.body).toHaveProperty("synopsis");
    });

    it("should 400 when missing poster", async () => {
      const response = await request
        .post(url)
        .set("Authorization", authHeader)
        .send({
          title: "Avengers",
          synopsis: "This is a test movie created to test.",
          genres: ["action", "comedy"],
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.body).toHaveProperty("poster");
    });

    it("should 400 when missing genres", async () => {
      const response = await request
        .post(url)
        .set("Authorization", authHeader)
        .send({
          title: "Avengers",
          synopsis: "This is a test movie created to test.",
          poster: "https://img.fruugo.com/product/7/41/14532417_max.jpg",
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.body).toHaveProperty("genres");
    });

    testAuthHeader(() => request.post(url));
  });

  describe("DELETE /api/movies/:id", () => {
    beforeAll(async () => {
      await prisma[tables.movies].createMany({ data: data.movies[0] });
    });

    afterAll(async () => {
      ///
    });

    it("should 204 and return nothing", async () => {
      const response = await request
        .delete(`${url}/1`)
        .set("Authorization", authHeader);
      //console.log(response);
      expect(response.statusCode).toBe(204);
      expect(response.body).toEqual({});
    });

    it("should 404 with not existing movie", async () => {
      const response = await request
        .delete(`${url}/4`)
        .set("Authorization", authHeader);

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: "NOT_FOUND",
        message: "No movie with id 4 exists",
        details: {
          id: 4,
        },
      });
      expect(response.body.stack).toBeTruthy();
    });
  });

  testAuthHeader(() => request.delete(`${url}/1`));
});
