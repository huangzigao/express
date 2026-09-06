const { registerUser, loginUser } = require('../helpers/auth.helper');

describe('用户接口', () => {
  test('用户可以注册', async () => {
    const response = await registerUser();

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.user.email).toBe('user@example.com');
    expect(response.body.data.user.password).toBeUndefined();
    expect(response.body.data.user.passwordHash).toBeUndefined();
  });

  test('重复邮箱不能注册', async () => {
    await registerUser();
    const response = await registerUser();

    expect(response.status).toBe(409);
    expect(response.body.success).toBe(false);
  });

  test('邮箱格式非法时注册失败', async () => {
    const response = await registerUser({
      email: 'bad-email'
    });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });

  test('密码太短时注册失败', async () => {
    const response = await registerUser({
      password: '123'
    });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });

  test('用户可以登录并获得 Token', async () => {
    await registerUser();
    const response = await loginUser();

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.accessToken).toBeTruthy();
    expect(response.body.data.user.email).toBe('user@example.com');
  });

  test('密码错误时登录失败', async () => {
    await registerUser();
    const response = await loginUser({
      password: 'wrong-password'
    });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  test('不存在的用户登录失败', async () => {
    const response = await loginUser({
      email: 'missing@example.com'
    });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });
});
