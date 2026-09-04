class AppError extends Error {
  constructor(message, statusCode, code, details = null) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code || 'INTERNAL_SERVER_ERROR';
    this.details = details;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

function badRequest(message, code = 'BAD_REQUEST', details = null) {
  return new AppError(message, 400, code, details);
}

function unauthorized(message = '未授权访问', code = 'UNAUTHORIZED', details = null) {
  return new AppError(message, 401, code, details);
}

function forbidden(message = '无权访问', code = 'FORBIDDEN', details = null) {
  return new AppError(message, 403, code, details);
}

function notFound(message = '资源不存在', code = 'NOT_FOUND', details = null) {
  return new AppError(message, 404, code, details);
}

function conflict(message = '资源冲突', code = 'CONFLICT', details = null) {
  return new AppError(message, 409, code, details);
}

module.exports = {
  AppError,
  badRequest,
  unauthorized,
  forbidden,
  notFound,
  conflict
};
