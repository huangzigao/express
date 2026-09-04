const authService = require('../services/auth.service');
const userRepository = require('../repositories/user.repository');
const { unauthorized } = require('../utils/app-error');

function extractBearerToken(req) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return null;
  }

  return token;
}

async function authMiddleware(req, res, next) {
  try {
    const token = extractBearerToken(req);

    if (!token) {
      throw unauthorized('未提供登录凭证', 'TOKEN_REQUIRED');
    }

    const payload = authService.getCurrentUserFromToken(token);
    const user = await userRepository.findUserById(payload.userId);

    if (!user) {
      throw unauthorized('当前登录用户不存在', 'USER_NOT_FOUND');
    }

    req.user = {
      id: user.id,
      email: user.email
    };

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = authMiddleware;
