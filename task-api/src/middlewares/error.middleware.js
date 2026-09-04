const logger = require('../config/logger');
const { failure } = require('../utils/response');

function errorMiddleware(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const code = err.code || 'INTERNAL_SERVER_ERROR';
  const isProduction = process.env.NODE_ENV === 'production';
  const isServerError = statusCode >= 500;

  const message =
    isProduction && isServerError ? '服务器内部错误' : err.message || '服务器内部错误';

  logger.error(
    {
      err,
      method: req.method,
      path: req.originalUrl,
      statusCode,
      code
    },
    '请求处理失败'
  );

  const payload = failure({
    code,
    message,
    details: isProduction && isServerError ? null : err.details || null
  });

  if (!isProduction) {
    payload.error.stack = err.stack;
  }

  res.status(statusCode).json(payload);
}

module.exports = errorMiddleware;
