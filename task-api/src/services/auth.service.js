const userService = require('./user.service');
const { signAccessToken, verifyAccessToken } = require('../utils/token');
const { unauthorized } = require('../utils/app-error');

function issueAuthPayload(user) {
  const accessToken = signAccessToken({
    userId: user.id,
    email: user.email
  });

  return {
    user,
    accessToken
  };
}

function loginWithToken(user) {
  return issueAuthPayload(user);
}

function getCurrentUserFromToken(token) {
  if (!token) {
    throw unauthorized('未提供登录凭证', 'TOKEN_REQUIRED');
  }

  try {
    return verifyAccessToken(token);
  } catch (error) {
    throw unauthorized('登录凭证无效或已过期', 'INVALID_TOKEN');
  }
}

module.exports = {
  loginWithToken,
  getCurrentUserFromToken,
  issueAuthPayload
};
