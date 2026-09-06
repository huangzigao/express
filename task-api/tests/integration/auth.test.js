const request = require('supertest');
const app = require('../../src/app');
const { createLoggedInUser } = require('../helpers/auth.helper');
const { authHeader, createCategory, createTask } = require('../helpers/task.helper');

describe('认证与资源隔离', () => {
  test('不带 Token 访问任务接口会被拒绝', async () => {
    const response = await request(app).get('/api/v1/tasks');

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  test('无效 Token 会被拒绝', async () => {
    const response = await request(app).get('/api/v1/tasks').set(authHeader('bad-token'));

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  test('登录用户可以访问受保护接口', async () => {
    const { token } = await createLoggedInUser();
    const response = await request(app).get('/api/v1/tasks').set(authHeader(token));

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  test('用户不能访问其他用户的任务', async () => {
    const userA = await createLoggedInUser({
      email: 'a@example.com'
    });
    const userB = await createLoggedInUser({
      email: 'b@example.com'
    });

    const created = await createTask(userA.token, {
      title: '用户 A 的任务'
    });
    const taskId = created.body.data.task.id;

    const response = await request(app).get(`/api/v1/tasks/${taskId}`).set(authHeader(userB.token));

    expect([403, 404]).toContain(response.status);
    expect(response.body.success).toBe(false);
  });

  test('用户不能使用其他用户的分类', async () => {
    const userA = await createLoggedInUser({
      email: 'a@example.com'
    });
    const userB = await createLoggedInUser({
      email: 'b@example.com'
    });

    const category = await createCategory(userA.token, {
      name: '用户 A 分类'
    });

    const response = await createTask(userB.token, {
      title: '尝试使用别人分类',
      categoryId: category.body.data.category.id
    });

    expect([403, 404]).toContain(response.status);
    expect(response.body.success).toBe(false);
  });
});
