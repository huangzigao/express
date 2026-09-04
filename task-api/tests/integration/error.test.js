const express = require('express');
const request = require('supertest');
const app = require('../../src/app');
const notFound = require('../../src/middlewares/not-found.middleware');
const errorHandler = require('../../src/middlewares/error.middleware');

describe('统一错误处理', () => {
  test('未知路由应返回统一 404 响应', async () => {
    const response = await request(app).get('/api/v1/not-exists');

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe('NOT_FOUND');
  });

  test('错误响应应包含统一结构', async () => {
    const testApp = express();

    testApp.get('/api/v1/error-demo', (req, res, next) => {
      next(new Error('demo error'));
    });

    testApp.use(notFound);
    testApp.use(errorHandler);

    const response = await request(testApp).get('/api/v1/error-demo');

    expect(response.status).toBe(500);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toHaveProperty('code');
    expect(response.body.error).toHaveProperty('details');
  });
});
