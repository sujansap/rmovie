const Router = require("@koa/router");
const Joi = require("joi");

const reviewService = require("../service/review");
const { requireAuthentication } = require("../core/auth");
const Role = require("../core/roles");
const validate = require("../core/validation");

const { checkUserId } = require("./user");

const getAllReviews = async (ctx) => {
  const userId = ctx.state.session.userId;

  const data = await reviewService.getAll(Number(userId));

  ctx.body = data;
};
getAllReviews.validationScheme = null;

const getById = async (ctx) => {
  ctx.body = await reviewService.getById(Number(ctx.params.id));
};
getById.validationScheme = {
  params: {
    id: Joi.number().integer().required(),
  },
};

const addReview = async (ctx) => {
  const userId = ctx.state.session.userId;

  let data = { ...ctx.request.body };

  ctx.body = await reviewService.add(
    Number(userId),
    Number(data.movieId),
    data.review,
    Number(data.rating)
  );
};
addReview.validationScheme = {
  body: {
    movieId: Joi.number().integer().positive().required(),
    review: Joi.string().required(),
    rating: Joi.number().integer().min(0).max(100).required(),
  },
};

const deleteById = async (ctx) => {
  await reviewService.deleteById(Number(ctx.params.id));
  ctx.status = 204;
};
deleteById.validationScheme = {
  params: {
    id: Joi.number().integer().required(),
  },
};

const updateReview = async (ctx) => {
  console.log("here");
  const userId = ctx.state.session.userId;
  console.log("here1");
  let data = { ...ctx.request.body };
  const rid = Number(ctx.params.id);

  data.movieId = Number(data.movieId);
  ctx.body = await reviewService.updateReview(rid, data, userId);
};
updateReview.validationScheme = {
  params: {
    id: Joi.number().integer().required(),
  },
  body: {
    movieId: Joi.number().integer().required(),
    review: Joi.string().required(),
    rating: Joi.number().integer().min(0).max(100).required(),
  },
};

module.exports = (app) => {
  const router = new Router({
    prefix: "/reviews",
  });

  //geef alle reviews van een bepaalde gebruiker
  router.get(
    "/",
    requireAuthentication,
    validate(getAllReviews.validationScheme),
    getAllReviews
  );
  //geef een bepaalde review van een bepaalde gebruiker

  router.get(
    "/:id",
    requireAuthentication,
    validate(getById.validationScheme),
    getById
  );

  //post een review
  router.post(
    "/",
    requireAuthentication,
    validate(addReview.validationScheme),
    addReview
  );

  //movieId
  //van user die ingelogd is
  //hier zou eigenlijk gecontroleerd moeten worden of het de id
  //is van een review dat door de gebruiker die het wilt verwijderen is geplaats
  router.delete(
    "/:id",
    requireAuthentication,
    validate(deleteById.validationScheme),
    deleteById
  );

  //update een review
  router.put(
    "/:id",
    requireAuthentication,
    validate(updateReview.validationScheme),
    updateReview
  );

  app.use(router.routes()).use(router.allowedMethods());
};
