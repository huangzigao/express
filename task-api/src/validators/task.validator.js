const { z } = require('zod');

const TASK_STATUSES = ['TODO', 'IN_PROGRESS', 'DONE'];
const TASK_PRIORITIES = ['LOW', 'MEDIUM', 'HIGH'];
const SORT_FIELDS = ['createdAt', 'updatedAt', 'dueAt'];
const SORT_ORDERS = ['asc', 'desc'];

const idParam = z.object({
  id: z.string().trim().min(1, '任务 ID 不能为空')
});

const title = z.string().trim().min(1, '任务标题不能为空').max(100, '任务标题不能超过 100 个字符');

const description = z
  .string()
  .trim()
  .max(2000, '任务描述不能超过 2000 个字符')
  .optional()
  .nullable();

const status = z.enum(TASK_STATUSES, {
  errorMap: () => ({ message: '任务状态非法' })
});

const priority = z.enum(TASK_PRIORITIES, {
  errorMap: () => ({ message: '任务优先级非法' })
});

const dueAt = z.string().datetime('截止时间必须是合法 ISO 时间').optional().nullable();

const categoryId = z.string().trim().min(1).optional().nullable();

const createTaskSchema = z.object({
  body: z.object({
    title,
    description,
    status: status.optional(),
    priority: priority.optional(),
    dueAt,
    categoryId
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional()
});

const updateTaskSchema = z.object({
  body: z
    .object({
      title: title.optional(),
      description,
      status: status.optional(),
      priority: priority.optional(),
      dueAt,
      categoryId
    })
    .refine((value) => Object.keys(value).length > 0, {
      message: '至少需要提供一个要更新的字段'
    }),
  params: idParam,
  query: z.object({}).optional()
});

const taskIdSchema = z.object({
  body: z.object({}).optional(),
  params: idParam,
  query: z.object({}).optional()
});

const listTasksSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    pageSize: z.coerce.number().int().min(1).max(100).default(20),
    status: status.optional(),
    priority: priority.optional(),
    categoryId: z.string().trim().min(1).optional(),
    dueFrom: z.string().datetime().optional(),
    dueTo: z.string().datetime().optional(),
    sortBy: z.enum(SORT_FIELDS).default('createdAt'),
    sortOrder: z.enum(SORT_ORDERS).default('desc')
  })
});

module.exports = {
  createTaskSchema,
  updateTaskSchema,
  taskIdSchema,
  listTasksSchema
};
