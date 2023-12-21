const Router = require("@koa/router");
const Joi = require("joi");

const movieService = require("../service/movie");
const validate = require("../core/validation");
const { requireAuthentication, makeRequireRole } = require("../core/auth");
const Role = require("../core/roles");

const getAllMovies = async (ctx) => {
  const data = await movieService.getAll();

  ctx.body = data;
};

getAllMovies.validationScheme = null;

const getMovieById = async (ctx) => {
  const data = await movieService.getById(Number(ctx.params.id));

  ctx.body = data;
};

getMovieById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

const getMovieGenres = async (ctx) => {
  const data = await movieService.getMovieGeneres(Number(ctx.params.id));

  ctx.body = data;
};

getMovieGenres.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

const getAllReviewsForMovie = async (ctx) => {
  const data = await movieService.getAllReviewsForMovie(Number(ctx.params.id));

  ctx.body = data;
};
getAllReviewsForMovie.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

const deleteMovie = async (ctx) => {
  const userId = ctx.state.session.userId;
  await movieService.deleteById(Number(ctx.params.id), userId);
  ctx.status = 204;
};

deleteMovie.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

const addMovie = async (ctx) => {
  const userId = ctx.state.session.userId;
  const d = { ...ctx.request.body, userId };

  //laer the 1 needs to change to the user that is loggedt in at the moment of adding

  const addedMovie = await movieService.addMovie(d);

  ctx.status = 201;
  ctx.body = addedMovie;
};

addMovie.validationScheme = {
  body: {
    title: Joi.string().required(),
    poster: Joi.string().uri().required(),
    synopsis: Joi.string().required(),
    genres: Joi.array().items(Joi.string()).required(),
  },
};

const getReviewForMovie = async (ctx) => {
  const userId = ctx.state.session.userId;

  const data = await movieService.getReviewForMovie(
    Number(userId),
    Number(ctx.params.id)
  );

  ctx.body = data;
};

getReviewForMovie.validationScheme = {
  params: {
    id: Joi.number().integer().required(),
  },
};

const getAverageRating = async (ctx) => {
  const data = await movieService.getAverageRating(Number(ctx.params.id));
  ctx.body = data;
};
getAverageRating.validationScheme = {
  params: {
    id: Joi.number().integer().required(),
  },
};

const getAllGenres = async (ctx) => {
  const data = await movieService.getAllGenres();
  ctx.body = data;
};

getAllGenres.validationScheme = null;

module.exports = (app) => {
  const router = new Router({ prefix: "/movies" });

  router.get(
    "/",
    requireAuthentication,
    validate(getAllMovies.validationScheme),
    getAllMovies
  );

  router.get(
    "/genres",
    requireAuthentication,
    validate(getAllMovies.validationScheme),
    getAllGenres
  );

  router.get(
    "/:id",
    requireAuthentication,
    validate(getMovieById.validationScheme),
    getMovieById
  );

  router.get(
    "/:id/genres",
    requireAuthentication,
    validate(getMovieGenres.validationScheme),
    getMovieGenres
  );

  router.get(
    "/:id/reviews",
    requireAuthentication,
    validate(getAllReviewsForMovie.validationScheme),
    getAllReviewsForMovie
  );

  //get the review of a movie for the logged in user
  router.get(
    "/:id/review",
    requireAuthentication,
    validate(getReviewForMovie.validationScheme),
    getReviewForMovie
  );

  router.get(
    "/:id/rating",
    requireAuthentication,
    validate(getAverageRating.validationScheme),
    getAverageRating
  );

  const requireAdmin = makeRequireRole(Role.ADMIN);

  router.post(
    "/",
    requireAuthentication,
    requireAdmin,
    validate(addMovie.validationScheme),
    addMovie
  );
  //router.put('/:id', updateMovie);
  router.delete(
    "/:id",
    requireAuthentication,
    requireAdmin,
    validate(deleteMovie.validationScheme),
    deleteMovie
  );

  app.use(router.routes()).use(router.allowedMethods());
};
