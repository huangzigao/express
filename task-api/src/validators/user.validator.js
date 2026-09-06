const { z } = require('zod');

const email = z.string().trim().email('邮箱格式不正确').max(191, '邮箱不能超过 191 个字符');

const password = z.string().min(8, '密码至少需要 8 个字符').max(72, '密码不能超过 72 个字符');

const registerSchema = z.object({
  body: z.object({
    email,
    password
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional()
});

const loginSchema = z.object({
  body: z.object({
    email,
    password
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional()
});

module.exports = {
  registerSchema,
  loginSchema
};
