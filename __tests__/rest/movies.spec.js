const supertest = require("supertest");
const createServer = require("../../src/createServer");
const { tables } = require("../../src/data/index");
//const movie = require("../../src/rest/movie");
//    //"test:with-migrate": "yarn test:prisma:migrate && yarn test:prisma:seed && yarn test:coverage"

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
      userId: 1,
      movieId: 7,
      rating: 100,
      review: "Great movie!",
    },
    {
      userId: 2,
      movieId: 7,
      rating: 100,
      review: "this movie is amazing",
    },
  ],
  genreMovies: [
    {
      genreId: 1,
      movieId: 5,
    },
    {
      genreId: 2,
      movieId: 5,
    },
    {
      genreId: 2,
      movieId: 6,
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
  let server;
  let request;
  let prisma;

  beforeAll(async () => {
    server = await createServer();
    request = supertest(server.getApp().callback());
    prisma = getPrimsa();
    await prisma[tables.userTypes].createMany({ data: data.userTypes });
    await prisma[tables.genres].createMany({ data: data.genres });
  });

  afterAll(async () => {
    await server.stop();
  });

  const url = "/api/movies/";
  describe("GET /api/movies", () => {
    beforeAll(async () => {
      await prisma[tables.users].createMany({ data: data.users });
      await prisma[tables.movies].createMany({ data: data.movies });
      //await prisma[tables.reviews].createMany({data:data.reviews});
      //await prisma[tables.movieGenres].createMany({data:data.genreMovies});
    });

    afterAll(async () => {
      await prisma[tables.movies].deleteMany({
        where: {
          movieId: {
            in: dataToDelete.movies,
          },
        },
      });

      /*await prisma[tables.users].deleteMany({
          where:{
            userId:{
              in: dataToDelete.users
            }
          }
        });*/
    });

    it("should 200 and return all movies", async () => {
      const response = await request.get(url);
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
  });

  describe("GET /api/movies/:id", () => {
    beforeAll(async () => {
      //await prisma[tables.users].createMany({data:data.users});
      await prisma[tables.movies].createMany({ data: data.movies });
      //await prisma[tables.reviews].createMany({data:data.reviews});
      //await prisma[tables.movieGenres].createMany({data:data.genreMovies});
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
      const response = await request.get(`${url}1`);
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
  });

  describe("GET /api/movies/:id/genres", () => {
    const toDeleteMovies = [5, 6];
    beforeAll(async () => {
      //await prisma[tables.users].createMany({data:data.users});
      await prisma[tables.movies].createMany({ data: data.movies });
      //await prisma[tables.reviews].createMany({data:data.reviews});
      await prisma[tables.movieGenres].createMany({ data: data.genreMovies });
    });

    afterAll(async () => {
      await prisma[tables.movies].deleteMany({
        where: {
          movieId: {
            in: toDeleteMovies,
          },
        },
      });
    });

    it("should 200 and return all the movie genres", async () => {
      const response = await request.get(`${url}1/genres`);
      expect(response.status).toBe(200);

      expect(response.body).toEqual(["action", "comedy"]);
    });
  });

  //all reviews for a movie
  describe("GET /api/movies/:id/reviews", () => {
    const toDeleteMovies = [7, 8];
    beforeAll(async () => {
      //await prisma[tables.users].createMany({data:data.users});
      await prisma[tables.movies].createMany({ data: data.movies });
      await prisma[tables.reviews].createMany({ data: data.reviews });
      //await prisma[tables.movieGenres].createMany({data:data.genreMovies});
    });

    afterAll(async () => {
      await prisma[tables.movies].deleteMany({
        where: {
          movieId: {
            in: toDeleteMovies,
          },
        },
      });
    });

    it("should 200 and return the movie", async () => {
      const response = await request.get(`${url}7/reviews`);
      expect(response.status).toBe(200);

      const removeDate = (response) => {
        return response.map(({ date, ...rest }) => rest);
      };

      expect(removeDate(response.body.items)).toEqual([
        {
          movie: "Avengers",
          movieId: 7,
          rating: 100,
          review: "Great movie!",
          reviewId: 1,
          user: "janmap",
          userId: 1,
        },
        {
          movie: "Avengers",
          movieId: 7,
          rating: 100,
          review: "this movie is amazing",
          reviewId: 2,
          user: "jan2map",
          userId: 2,
        },
      ]);
    });
  });

  describe("POST /api/movies", () => {
    let toDelete = 0;
    beforeAll(async () => {
      //await prisma[tables.users].createMany({data:data.users});
    });

    afterAll(async () => {
      //test
    });

    it("it should have posted movie", async () => {
      const response = await request.post(url).send({
        title: "Avengers",
        synopsis: "This is a test movie created to test.",
        poster: "testmovie.jpg",
        userId: 1,
        genres: ["action", "comedy"],
      });

      console.log(response.body);

      toDelete = response.body.movieId;

      expect(response.status).toBe(201);
      expect(response.body.movieId).toBeTruthy();
      expect(response.body.title).toBe("Avengers");
      expect(response.body.synopsis).toBe(
        "This is a test movie created to test."
      );
      expect(response.body.poster).toBe("testmovie.jpg");
      expect(response.body.userId).toBe(1);
    });
  });

  describe("DELETE /api/movies/:id", () => {
    beforeAll(async () => {
      await prisma[tables.movies].createMany({ data: data.movies });
    });

    afterAll(async () => {
      ///
    });

    it("should 204 and return nothing", async () => {
      const response = await request.delete(`${url}10`);
      //console.log(response);
      expect(response.statusCode).toBe(204);
      expect(response.body).toEqual({});
    });
  });
});
