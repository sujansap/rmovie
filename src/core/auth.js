const userService = require("../service/user");

const requireAuthentication = async (ctx, next) => {
  const { authorization } = ctx.headers;

  const { authToken, ...session } = await userService.checkAndParseSession(
    authorization
  );

  ctx.state.session = session;
  ctx.state.authToken = authToken;

  return next();
};

const makeRequireRole = (role) => async (ctx, next) => {
  const { userType } = ctx.state.session;

  userService.checkRole(role, userType);
  return next();
};

module.exports = {
  requireAuthentication,
  makeRequireRole,
};