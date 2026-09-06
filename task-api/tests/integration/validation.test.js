const request = require('supertest');
const app = require('../../src/app');
const { createLoggedInUser } = require('../helpers/auth.helper');
const { authHeader } = require('../helpers/task.helper');

describe('参数校验', () => {
  test('注册邮箱非法返回 VALIDATION_ERROR', async () => {
    const response = await request(app).post('/api/v1/users/register').send({
      email: 'bad-email',
      password: 'password123'
    });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });

  test('注册密码过短返回 VALIDATION_ERROR', async () => {
    const response = await request(app).post('/api/v1/users/register').send({
      email: 'user@example.com',
      password: '123'
    });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });

  test('创建任务缺少标题返回 VALIDATION_ERROR', async () => {
    const { token } = await createLoggedInUser();
    const response = await request(app).post('/api/v1/tasks').set(authHeader(token)).send({
      description: '没有标题'
    });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });

  test('修改任务没有任何字段返回 VALIDATION_ERROR', async () => {
    const { token } = await createLoggedInUser();
    const response = await request(app)
      .put('/api/v1/tasks/not-exist')
      .set(authHeader(token))
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });

  test('创建分类名称为空返回 VALIDATION_ERROR', async () => {
    const { token } = await createLoggedInUser();
    const response = await request(app).post('/api/v1/categories').set(authHeader(token)).send({
      name: ''
    });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });

  test('任务列表页码非法返回 VALIDATION_ERROR', async () => {
    const { token } = await createLoggedInUser();
    const response = await request(app).get('/api/v1/tasks?page=0').set(authHeader(token));

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });

  test('任务列表每页数量过大返回 VALIDATION_ERROR', async () => {
    const { token } = await createLoggedInUser();
    const response = await request(app).get('/api/v1/tasks?pageSize=101').set(authHeader(token));

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });

  test('任务列表排序字段非法返回 VALIDATION_ERROR', async () => {
    const { token } = await createLoggedInUser();
    const response = await request(app).get('/api/v1/tasks?sortBy=password').set(authHeader(token));

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });
});
