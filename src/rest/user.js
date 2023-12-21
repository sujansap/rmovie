const Router = require("@koa/router");
const Joi = require("joi");

const userService = require("../service/user");
const validate = require("../core/validation");
const { requireAuthentication, makeRequireRole } = require("../core/auth");
const Role = require("../core/roles");

const checkUserId = (ctx, next) => {
  const { userId, userType } = ctx.state.session;
  const { id } = ctx.params;

  // You can only get your own data unless you're an admin
  //only an admin gets everyones data
  if (Number(id) !== Number(userId) && userType !== Role.ADMIN) {
    return ctx.throw(
      403,
      "You are not allowed to view this user's information",
      {
        code: "FORBIDDEN",
      }
    );
  }
  return next();
};

const getAllUsers = async (ctx) => {
  const data = await userService.getAll();

  ctx.body = data;
};
getAllUsers.validationScheme = null;

const getUserById = async (ctx) => {
  const user = await userService.getById(Number(ctx.params.id));
  ctx.body = user;
};
getUserById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

const getReviewForMovieForUser = async (ctx) => {
  const data = await userService.getReviewForMovieForUser(
    Number(ctx.params.userId),
    Number(ctx.params.movieId)
  );

  ctx.body = data;
};

getReviewForMovieForUser.validationScheme = {
  params: {
    userId: Joi.number().integer().required(),
    movieId: Joi.number().integer().required(),
  },
};

const login = async (ctx) => {
  const { email, password } = ctx.request.body;

  const token = await userService.login(email, password);
  ctx.body = token;
};

login.validationScheme = {
  body: {
    email: Joi.string().email(),
    password: Joi.string(),
  },
};

const register = async (ctx) => {
  const token = await userService.register(ctx.request.body);
  ctx.body = token;
  ctx.status = 200;
};

register.validationScheme = {
  body: {
    username: Joi.string().max(255),
    email: Joi.string().email(),
    password: Joi.string().min(8).max(30),
  },
};

module.exports = (app) => {
  const router = new Router({ prefix: "/users" });

  //public routes
  router.post("/login", validate(login.validationScheme), login);
  router.post("/register", validate(register.validationScheme), register);

  const requireAdmin = makeRequireRole(Role.ADMIN);

  router.get(
    "/",
    requireAuthentication,
    requireAdmin,
    validate(getAllUsers.validationScheme),
    getAllUsers
  );

  router.get(
    "/:id",
    requireAuthentication,
    checkUserId,
    validate(getUserById.validationScheme),
    getUserById
  );

  router.get(
    "/:userId/movies/:movieId/review",
    requireAuthentication,
    validate(getReviewForMovieForUser.validationScheme),
    getReviewForMovieForUser
  );

  app.use(router.routes()).use(router.allowedMethods());
};

module.exports.checkUserId = checkUserId;
