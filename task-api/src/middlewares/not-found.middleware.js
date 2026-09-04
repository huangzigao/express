const { notFound } = require('../utils/app-error');

function notFoundMiddleware(req, res, next) {
  next(notFound(`找不到接口：${req.method} ${req.originalUrl}`));
}

module.exports = notFoundMiddleware;
