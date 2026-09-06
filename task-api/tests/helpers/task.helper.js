const request = require('supertest');
const app = require('../../src/app');

function authHeader(token) {
  return {
    Authorization: `Bearer ${token}`
  };
}

async function createCategory(token, payload = {}) {
  return request(app)
    .post('/api/v1/categories')
    .set(authHeader(token))
    .send({
      name: payload.name || '工作'
    });
}

async function createTask(token, payload = {}) {
  return request(app)
    .post('/api/v1/tasks')
    .set(authHeader(token))
    .send({
      title: payload.title ?? '测试任务',
      description: payload.description ?? '测试任务描述',
      status: payload.status ?? 'TODO',
      priority: payload.priority ?? 'MEDIUM',
      dueAt: payload.dueAt,
      categoryId: payload.categoryId
    });
}

module.exports = {
  authHeader,
  createCategory,
  createTask
};
