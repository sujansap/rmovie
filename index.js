const Koa = require('koa');
const config = require('config'); // 👈 1
const winston = require('winston');

const NODE_ENV = process.env.NODE_ENV; // 👈 5
const LOG_LEVEL = config.get('log.level'); // 👈 2
const LOG_DISABLED = config.get('log.disabled'); // 👈 2

console.log(`log level ${LOG_LEVEL}, logs enabled: ${LOG_DISABLED !== true}`); // 👈 3

const app = new Koa();

const logger = winston.createLogger({
  level: LOG_LEVEL, // 👈 4
  format: winston.format.simple(),
  transports: [
    new winston.transports.Console({ silent: LOG_DISABLED }) // 👈 4
  ]
});


app.listen(9000, () => {
  logger.info('🚀 Server listening on http://localhost:9000');
});
