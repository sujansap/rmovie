const Router = require("@koa/router");
const Joi = require("joi");

const movieService = require("../service/movie");
const validate = require("../core/validation");
const { requireAuthentication } = require("../core/auth");

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
  console.log(data);
  ctx.body = data;
};

getMovieGenres.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

const getAllReviewsForMovie = async (ctx) => {
  const data = await movieService.getAllReviewsForMovie(Number(ctx.params.id));
  console.log(data);
  ctx.body = data;
};
getAllReviewsForMovie.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

const deleteMovie = async (ctx) => {
  await movieService.deleteById(Number(ctx.params.id));
  ctx.status = 204;
};

deleteMovie.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

const addMovie = async (ctx) => {
  console.log("someone is trying to add a movie");
  console.log({ ...ctx.request.body });
  const userId = ctx.state.session.userId;
  const d = { ...ctx.request.body, userId };

  //laer the 1 needs to change to the user that is loggedt in at the moment of adding

  const addedMovie = await movieService.addMovie(d);
  console.log(addedMovie);
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
/*
const addReview = async(ctx)=>{
    //wat moet er precies gebeuren als een user al een review heeft voor die film
    const data = {...ctx.request.body};
    console.log("adding a review test: " + Number(ctx.params.id) );
    ctx.body = await movieService.
        addReview(
        1,
        Number(ctx.params.id),
        data.review, 
        Number(data.rating)
        );
}
*/
/*
const updateMovie = async(ctx)=>{
    const id = Number(ctx.params.id);
    const data = {...ctx.request.body};
   ctx.body = await movieService.updateMovie(id, data);
}
*/
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

  router.post(
    "/",
    requireAuthentication,
    validate(addMovie.validationScheme),
    addMovie
  );
  //router.put('/:id', updateMovie);
  router.delete(
    "/:id",
    requireAuthentication,
    validate(deleteMovie.validationScheme),
    deleteMovie
  );

  app.use(router.routes()).use(router.allowedMethods());
};
