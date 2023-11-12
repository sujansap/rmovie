const Router = require('@koa/router');
const installReviewRouter = require('./review');
const installMovieRouter = require('./movie');
const installUserRouter = require('./user');
const installGenreRouter = require('./genre');
module.exports = (app) => {
  const router = new Router({
    prefix: '/api',
  });

  installReviewRouter(router);
  installMovieRouter(router);
  installUserRouter(router);
  installGenreRouter(router);
  app.use(router.routes())
     .use(router.allowedMethods());
};
