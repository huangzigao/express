const request = require('supertest');

const app = require('../../src/app');
const prisma = require('../../src/database/prisma');

async function registerAndLogin() {
  const unique = Date.now();

  await request(app).post('/api/v1/users/register').send({
    email: `test-${unique}@example.com`,
    password: 'password123'
  });

  const response = await request(app).post('/api/v1/users/login').send({
    email: `test-${unique}@example.com`,
    password: 'password123'
  });

  return response.body.data.accessToken;
}

describe('任务模块核心业务', () => {
  beforeEach(async () => {
    await prisma.task.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();
  });

  test('已登录用户可以创建任务', async () => {
    const token = await registerAndLogin();

    const response = await request(app)
      .post('/api/v1/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: '完成第十天任务',
        description: '实现任务模块核心业务',
        priority: 'HIGH'
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.task.title).toBe('完成第十天任务');
  });

  test('任务标题不能为空', async () => {
    const token = await registerAndLogin();

    const response = await request(app)
      .post('/api/v1/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: '',
        description: '空标题测试'
      });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('TASK_TITLE_REQUIRED');
  });
});

describe('任务分类关联', () => {
  beforeEach(async () => {
    await prisma.task.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();
  });

  test('创建任务时带分类 ID，详情里应返回分类信息', async () => {
    const token = await registerAndLogin();

    const categoryResponse = await request(app)
      .post('/api/v1/categories')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: '工作'
      });

    expect(categoryResponse.status).toBe(201);

    const taskResponse = await request(app)
      .post('/api/v1/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: '写周报',
        categoryId: categoryResponse.body.data.category.id,
        priority: 'MEDIUM'
      });

    expect(taskResponse.status).toBe(201);
    expect(taskResponse.body.success).toBe(true);
    expect(taskResponse.body.data.task.category).toBeDefined();
    expect(taskResponse.body.data.task.category.name).toBe('工作');
  });
});
