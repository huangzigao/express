const request = require('supertest');
const app = require('../../src/app');
const { createLoggedInUser } = require('../helpers/auth.helper');
const { authHeader, createCategory, createTask } = require('../helpers/task.helper');

describe('分类接口', () => {
  test('登录用户可以创建分类', async () => {
    const { token } = await createLoggedInUser();
    const response = await createCategory(token, {
      name: '学习'
    });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.category.name).toBe('学习');
  });

  test('登录用户可以查看分类列表', async () => {
    const { token } = await createLoggedInUser();
    await createCategory(token, { name: '工作' });
    await createCategory(token, { name: '生活' });

    const response = await request(app).get('/api/v1/categories').set(authHeader(token));

    expect(response.status).toBe(200);
    expect(response.body.data.categories).toHaveLength(2);
  });

  test('登录用户可以修改分类', async () => {
    const { token } = await createLoggedInUser();
    const created = await createCategory(token, { name: '旧分类' });
    const categoryId = created.body.data.category.id;

    const response = await request(app)
      .put(`/api/v1/categories/${categoryId}`)
      .set(authHeader(token))
      .send({
        name: '新分类'
      });

    expect(response.status).toBe(200);
    expect(response.body.data.category.name).toBe('新分类');
  });

  test('登录用户可以删除分类', async () => {
    const { token } = await createLoggedInUser();
    const created = await createCategory(token, { name: '临时分类' });
    const categoryId = created.body.data.category.id;

    const response = await request(app)
      .delete(`/api/v1/categories/${categoryId}`)
      .set(authHeader(token));

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  test('同一用户下分类名称不能重复', async () => {
    const { token } = await createLoggedInUser();

    await createCategory(token, { name: '工作' });
    const response = await createCategory(token, { name: '工作' });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  test('不同用户可以使用相同分类名称', async () => {
    const userA = await createLoggedInUser({ email: 'a@example.com' });
    const userB = await createLoggedInUser({ email: 'b@example.com' });

    const responseA = await createCategory(userA.token, { name: '工作' });
    const responseB = await createCategory(userB.token, { name: '工作' });

    expect(responseA.status).toBe(201);
    expect(responseB.status).toBe(201);
  });

  test('删除分类后任务保留且分类为空', async () => {
    const { token } = await createLoggedInUser();
    const category = await createCategory(token, { name: '工作' });
    const categoryId = category.body.data.category.id;
    const task = await createTask(token, {
      title: '带分类任务',
      categoryId
    });
    const taskId = task.body.data.task.id;

    await request(app).delete(`/api/v1/categories/${categoryId}`).set(authHeader(token));

    const response = await request(app).get(`/api/v1/tasks/${taskId}`).set(authHeader(token));

    expect(response.status).toBe(200);
    expect(response.body.data.task.category).toBeNull();
  });
});
