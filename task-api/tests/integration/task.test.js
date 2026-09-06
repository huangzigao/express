const request = require('supertest');
const app = require('../../src/app');
const { createLoggedInUser } = require('../helpers/auth.helper');
const { authHeader, createTask } = require('../helpers/task.helper');

describe('任务接口', () => {
  test('登录用户可以创建任务', async () => {
    const { token } = await createLoggedInUser();
    const response = await createTask(token, {
      title: '完成接口测试'
    });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.task.title).toBe('完成接口测试');
  });

  test('登录用户可以查看任务列表', async () => {
    const { token } = await createLoggedInUser();
    await createTask(token, { title: '任务一' });
    await createTask(token, { title: '任务二' });

    const response = await request(app).get('/api/v1/tasks').set(authHeader(token));

    expect(response.status).toBe(200);
    expect(response.body.data.tasks).toHaveLength(2);
  });

  test('登录用户可以查看任务详情', async () => {
    const { token } = await createLoggedInUser();
    const created = await createTask(token, { title: '任务详情' });
    const taskId = created.body.data.task.id;

    const response = await request(app).get(`/api/v1/tasks/${taskId}`).set(authHeader(token));

    expect(response.status).toBe(200);
    expect(response.body.data.task.id).toBe(taskId);
  });

  test('登录用户可以修改自己的任务', async () => {
    const { token } = await createLoggedInUser();
    const created = await createTask(token);
    const taskId = created.body.data.task.id;

    const response = await request(app).put(`/api/v1/tasks/${taskId}`).set(authHeader(token)).send({
      title: '已修改任务',
      status: 'DONE',
      priority: 'HIGH'
    });

    expect(response.status).toBe(200);
    expect(response.body.data.task.title).toBe('已修改任务');
    expect(response.body.data.task.status).toBe('DONE');
    expect(response.body.data.task.priority).toBe('HIGH');
  });

  test('登录用户可以删除自己的任务', async () => {
    const { token } = await createLoggedInUser();
    const created = await createTask(token);
    const taskId = created.body.data.task.id;

    const response = await request(app).delete(`/api/v1/tasks/${taskId}`).set(authHeader(token));

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  test('任务标题为空会失败', async () => {
    const { token } = await createLoggedInUser();
    const response = await createTask(token, {
      title: ''
    });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });

  test('任务状态非法会失败', async () => {
    const { token } = await createLoggedInUser();
    const response = await createTask(token, {
      status: 'BAD_STATUS'
    });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });

  test('操作不存在的任务会失败', async () => {
    const { token } = await createLoggedInUser();
    const response = await request(app).get('/api/v1/tasks/not-exist').set(authHeader(token));

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
  });
});
