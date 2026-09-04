const request = require('supertest');

const app = require('../../src/app');
const prisma = require('../../src/database/prisma');

async function registerAndLogin() {
  const unique = Date.now();

  await request(app).post('/api/v1/users/register').send({
    email: `category-${unique}@example.com`,
    password: 'password123'
  });

  const response = await request(app).post('/api/v1/users/login').send({
    email: `category-${unique}@example.com`,
    password: 'password123'
  });

  return response.body.data.accessToken;
}

describe('分类接口', () => {
  beforeEach(async () => {
    await prisma.task.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();
  });

  test('登录用户可以创建分类', async () => {
    const token = await registerAndLogin();

    const response = await request(app)
      .post('/api/v1/categories')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: '工作'
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.category.name).toBe('工作');
  });
});
