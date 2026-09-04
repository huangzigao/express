const request = require('supertest');

const app = require('../../src/app');
const prisma = require('../../src/database/prisma');

describe('用户注册与登录', () => {
  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  test('用户可以注册成功', async () => {
    const response = await request(app).post('/api/v1/users/register').send({
      email: 'test@example.com',
      password: 'password123'
    });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.user.email).toBe('test@example.com');
    expect(response.body.data.user.passwordHash).toBeUndefined();
  });

  test('重复邮箱注册应返回 409', async () => {
    await request(app).post('/api/v1/users/register').send({
      email: 'test@example.com',
      password: 'password123'
    });

    const response = await request(app).post('/api/v1/users/register').send({
      email: 'test@example.com',
      password: 'password123'
    });

    expect(response.status).toBe(409);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe('EMAIL_ALREADY_EXISTS');
  });

  test('用户可以登录成功', async () => {
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
    expect(response.body.data.user.email).toBe('test@example.com');
    expect(response.body.data.user.passwordHash).toBeUndefined();
  });

  test('密码错误应返回统一 401', async () => {
    await request(app).post('/api/v1/users/register').send({
      email: 'test@example.com',
      password: 'password123'
    });

    const response = await request(app).post('/api/v1/users/login').send({
      email: 'test@example.com',
      password: 'wrong-password'
    });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe('INVALID_CREDENTIALS');
  });
});
