const Router = require('@koa/router');
const installReviewRouter = require('./review');
const installMovieRouter = require('./movie');
const installUserRouter = require('./user');

module.exports = (app) => {
  const router = new Router({
    prefix: '/api',
  });

  installReviewRouter(router);
  installMovieRouter(router);
  installUserRouter(router);
  app.use(router.routes())
     .use(router.allowedMethods());
};
