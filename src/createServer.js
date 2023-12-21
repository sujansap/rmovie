//app
const Koa = require("koa");

//parser
const bodyParser = require("koa-bodyparser");

//logger
const config = require("config");
const koaCors = require("@koa/cors");

let { initializeLogger, getLogger } = require("./core/logging");

//rest
const installRest = require("./rest");

//koa cors

const installMiddlewares = require("./core/installMiddlewares");
const { getPrimsa, shutdownData } = require("./data/index");

//koa cors
const CORS_ORIGINS = config.get("cors.origins");
const CORS_MAX_AGE = config.get("cors.maxAge");

//logger
const NODE_ENV = process.env.NODE_ENV;
const LOG_LEVEL = config.get("log.level");
const LOG_DISABLED = config.get("log.disabled");

module.exports = async function createServer() {
  initializeLogger({
    level: LOG_LEVEL,
    disabled: LOG_DISABLED,
    defaultMeta: {
      NODE_ENV,
    },
  });

  //getPrisma();

  const app = new Koa();

  app.use(
    koaCors({
      origin: (ctx) => {
        if (CORS_ORIGINS.indexOf(ctx.request.header.origin) !== -1) {
          return ctx.request.header.origin;
        }
        // Not a valid domain at this point, let's return the first valid as we should return a string
        return CORS_ORIGINS[0];
      },
      allowHeaders: ["Accept", "Content-Type", "Authorization"],
      maxAge: CORS_MAX_AGE,
    })
  );

  app.use(bodyParser());

  installMiddlewares(app);

  installRest(app);

  return {
    getApp() {
      return app;
    },

    start() {
      return new Promise((resolve) => {
        const port = config.get("port");
        app.listen(port);
        getLogger().info(`🚀 Server listening on http://localhost:${port}`);
        resolve();
      });
    },

    async stop() {
      app.removeAllListeners();
      //import prisma and shutdown the connection
      await shutdownData();
      getLogger().info("Goodbye! 👋");
    },
  };
};
