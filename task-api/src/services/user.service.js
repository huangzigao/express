const userRepository = require('../repositories/user.repository');
const { badRequest, conflict, unauthorized } = require('../utils/app-error');
const { hashPassword, comparePassword } = require('../utils/password');

function toSafeUser(user) {
  return {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
}

function normalizeEmail(email) {
  return String(email || '')
    .trim()
    .toLowerCase();
}

function assertRegisterInput({ email, password }) {
  if (!email) {
    throw badRequest('邮箱不能为空', 'EMAIL_REQUIRED');
  }

  if (!password) {
    throw badRequest('密码不能为空', 'PASSWORD_REQUIRED');
  }

  if (String(password).length < 8) {
    throw badRequest('密码长度不能少于 8 位', 'PASSWORD_TOO_SHORT');
  }
}

async function register({ email, password }) {
  const normalizedEmail = normalizeEmail(email);

  assertRegisterInput({
    email: normalizedEmail,
    password
  });

  const existingUser = await userRepository.findUserByEmail(normalizedEmail);

  if (existingUser) {
    throw conflict('邮箱已被注册', 'EMAIL_ALREADY_EXISTS');
  }

  const passwordHash = await hashPassword(password);

  const user = await userRepository.createUser({
    email: normalizedEmail,
    passwordHash
  });

  return toSafeUser(user);
}

async function login({ email, password }) {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail || !password) {
    throw badRequest('邮箱和密码不能为空', 'LOGIN_INPUT_REQUIRED');
  }

  const user = await userRepository.findUserByEmail(normalizedEmail);

  if (!user) {
    throw unauthorized('邮箱或密码错误', 'INVALID_CREDENTIALS');
  }

  const isPasswordValid = await comparePassword(password, user.passwordHash);

  if (!isPasswordValid) {
    throw unauthorized('邮箱或密码错误', 'INVALID_CREDENTIALS');
  }

  return toSafeUser(user);
}

module.exports = {
  register,
  login,
  toSafeUser
};
