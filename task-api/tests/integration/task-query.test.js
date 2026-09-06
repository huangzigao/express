const request = require('supertest');
const app = require('../../src/app');
const { createLoggedInUser } = require('../helpers/auth.helper');
const { authHeader, createCategory, createTask } = require('../helpers/task.helper');

describe('任务列表查询', () => {
  test('默认分页返回 meta', async () => {
    const { token } = await createLoggedInUser();
    await createTask(token, { title: '任务一' });

    const response = await request(app).get('/api/v1/tasks').set(authHeader(token));

    expect(response.status).toBe(200);
    expect(response.body.meta.page).toBe(1);
    expect(response.body.meta.pageSize).toBe(20);
    expect(response.body.meta.total).toBe(1);
  });

  test('page 和 pageSize 生效', async () => {
    const { token } = await createLoggedInUser();
    await createTask(token, { title: '任务一' });
    await createTask(token, { title: '任务二' });
    await createTask(token, { title: '任务三' });

    const response = await request(app)
      .get('/api/v1/tasks?page=2&pageSize=2')
      .set(authHeader(token));

    expect(response.status).toBe(200);
    expect(response.body.data.tasks).toHaveLength(1);
    expect(response.body.meta.total).toBe(3);
  });

  test('可以按状态筛选', async () => {
    const { token } = await createLoggedInUser();
    await createTask(token, { title: '待办', status: 'TODO' });
    await createTask(token, { title: '完成', status: 'DONE' });

    const response = await request(app).get('/api/v1/tasks?status=DONE').set(authHeader(token));

    expect(response.status).toBe(200);
    expect(response.body.data.tasks).toHaveLength(1);
    expect(response.body.data.tasks[0].status).toBe('DONE');
  });

  test('可以按优先级筛选', async () => {
    const { token } = await createLoggedInUser();
    await createTask(token, { title: '普通', priority: 'MEDIUM' });
    await createTask(token, { title: '重要', priority: 'HIGH' });

    const response = await request(app).get('/api/v1/tasks?priority=HIGH').set(authHeader(token));

    expect(response.status).toBe(200);
    expect(response.body.data.tasks).toHaveLength(1);
    expect(response.body.data.tasks[0].priority).toBe('HIGH');
  });

  test('可以按分类筛选', async () => {
    const { token } = await createLoggedInUser();
    const category = await createCategory(token, { name: '工作' });
    const categoryId = category.body.data.category.id;

    await createTask(token, { title: '工作任务', categoryId });
    await createTask(token, { title: '无分类任务' });

    const response = await request(app)
      .get(`/api/v1/tasks?categoryId=${categoryId}`)
      .set(authHeader(token));

    expect(response.status).toBe(200);
    expect(response.body.data.tasks).toHaveLength(1);
    expect(response.body.data.tasks[0].category.id).toBe(categoryId);
  });

  test('查询结果不包含其他用户的任务', async () => {
    const userA = await createLoggedInUser({ email: 'a@example.com' });
    const userB = await createLoggedInUser({ email: 'b@example.com' });

    await createTask(userA.token, { title: '用户 A 任务' });
    await createTask(userB.token, { title: '用户 B 任务' });

    const response = await request(app).get('/api/v1/tasks').set(authHeader(userA.token));

    expect(response.status).toBe(200);
    expect(response.body.data.tasks).toHaveLength(1);
    expect(response.body.data.tasks[0].title).toBe('用户 A 任务');
  });
});
