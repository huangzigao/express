const userService = require('../services/user.service');
const authService = require('../services/auth.service');
const asyncHandler = require('../utils/async-handle');
const { success } = require('../utils/response');

const register = asyncHandler(async (req, res) => {
  const user = await userService.register(req.body);

  res.status(201).json(
    success({
      message: '注册成功',
      data: {
        user
      }
    })
  );
});

const login = asyncHandler(async (req, res) => {
  const user = await userService.login(req.body);
  const authPayload = authService.loginWithToken(user);

  res.json(
    success({
      message: '登录成功',
      data: authPayload
    })
  );
});

module.exports = {
  register,
  login
};
