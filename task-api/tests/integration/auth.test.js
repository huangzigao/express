const request = require('supertest');

const app = require('../../src/app');
const prisma = require('../../src/database/prisma');

describe('身份认证与权限', () => {
  beforeEach(async () => {
    await prisma.task.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();
  });

  test('登录成功后应返回 accessToken', async () => {
    await request(app).post('/api/v1/users/register').send({
      email: 'test@example.com',
      password: 'password123'
    });

    const response = await request(app).post('/api/v1/users/login').send({
      email: 'test@example.com',
      password: 'password123'
    });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.accessToken).toBeDefined();
  });

  test('未携带 Token 访问受保护接口应返回 401', async () => {
    const response = await request(app).get('/api/v1/tasks');

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe('TOKEN_REQUIRED');
  });
});
