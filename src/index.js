//app
const Koa = require('koa');

//parser
const bodyParser = require('koa-bodyparser');

//logger
const config = require('config'); 
let { initializeLogger, getLogger } = require('./core/logging');

//rest
const installRest = require('./rest');


//koa cors
const koaCors = require('@koa/cors');




//koa cors 
const CORS_ORIGINS = config.get('cors.origins'); 
const CORS_MAX_AGE = config.get('cors.maxAge');

//logger
const NODE_ENV = process.env.NODE_ENV; 
const LOG_LEVEL = config.get('log.level'); 
const LOG_DISABLED = config.get('log.disabled'); 

initializeLogger({
  level: LOG_LEVEL,
  disabled: LOG_DISABLED,
  defaultMeta: {
    NODE_ENV,
  },
});

const app = new Koa();

app.use(
  koaCors({
    origin: (ctx) => { 
      if (CORS_ORIGINS.indexOf(ctx.request.header.origin) !== -1) {
        return ctx.request.header.origin;
      }
      return CORS_ORIGINS[0];
    },
    allowHeaders: ['Accept', 'Content-Type', 'Authorization'], 
    maxAge: CORS_MAX_AGE, 
  })
);

app.use(bodyParser());
installRest(app);

app.listen(9000, () => {
  getLogger().info('🚀 Server listening on http://localhost:9000');
});
