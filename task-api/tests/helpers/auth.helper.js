const request = require('supertest');
const app = require('../../src/app');

async function registerUser(overrides = {}) {
  const payload = {
    email: overrides.email || 'user@example.com',
    password: overrides.password || 'password123'
  };

  return request(app).post('/api/v1/users/register').send(payload);
}

async function loginUser(overrides = {}) {
  const payload = {
    email: overrides.email || 'user@example.com',
    password: overrides.password || 'password123'
  };

  return request(app).post('/api/v1/users/login').send(payload);
}

async function createLoggedInUser(overrides = {}) {
  await registerUser(overrides);
  const response = await loginUser(overrides);

  return {
    token: response.body.data.accessToken,
    user: response.body.data.user
  };
}

module.exports = {
  registerUser,
  loginUser,
  createLoggedInUser
};
