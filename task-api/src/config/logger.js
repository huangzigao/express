const pino = require('pino');

const env = require('./env');

const logger = pino({
  level: env.LOG_LEVEL,
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      'req.body.password',
      'req.body.passwordHash',
      'req.body.token',
      'req.body.jwt',
      'req.body.refreshToken',
      'req.body.secret',
      'req.body.apiKey'
    ],
    censor: '[REDACTED]'
  }
});

module.exports = logger;
