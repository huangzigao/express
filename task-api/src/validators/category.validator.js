const { z } = require('zod');

const idParam = z.object({
  id: z.string().trim().min(1, '分类 ID 不能为空')
});

const name = z.string().trim().min(1, '分类名称不能为空').max(50, '分类名称不能超过 50 个字符');

const createCategorySchema = z.object({
  body: z.object({
    name
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional()
});

const updateCategorySchema = z.object({
  body: z.object({
    name
  }),
  params: idParam,
  query: z.object({}).optional()
});

const categoryIdSchema = z.object({
  body: z.object({}).optional(),
  params: idParam,
  query: z.object({}).optional()
});

module.exports = {
  createCategorySchema,
  updateCategorySchema,
  categoryIdSchema
};
