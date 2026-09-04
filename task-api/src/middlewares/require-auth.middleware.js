const { forbidden } = require('../utils/app-error');

function requireOwner(paramName = 'userId') {
  return function requireOwnerMiddleware(req, res, next) {
    const resourceUserId = req.params[paramName] || req.body[paramName];

    if (!resourceUserId || !req.user || resourceUserId !== req.user.id) {
      next(forbidden('无权访问该资源', 'FORBIDDEN_RESOURCE'));
      return;
    }

    next();
  };
}

module.exports = {
  requireOwner
};
