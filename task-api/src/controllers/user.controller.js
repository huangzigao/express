const userService = require('../services/user.service');
const authService = require('../services/auth.service');
const asyncHandler = require('../utils/async-handler');
const { success } = require('../utils/response');

const register = asyncHandler(async (req, res) => {
  const user = await userService.register(req.validated.body);

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
  const user = await userService.login(req.validated.body);
  const result = authService.loginWithToken(user);

  res.json(
    success({
      message: '登录成功',
      data: result
    })
  );
});

module.exports = {
  register,
  login
};
