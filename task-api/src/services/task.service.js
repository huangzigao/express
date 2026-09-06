const taskRepository = require('../repositories/task.repository');
const categoryService = require('./category.service');
const { badRequest, forbidden, notFound } = require('../utils/app-error');

const TASK_STATUSES = ['TODO', 'IN_PROGRESS', 'DONE'];
const TASK_PRIORITIES = ['LOW', 'MEDIUM', 'HIGH'];

function normalizeTaskTitle(title) {
  return String(title || '').trim();
}

function normalizeTaskDescription(description) {
  const value = String(description || '').trim();
  return value || null;
}

function normalizeTaskStatus(status) {
  return String(status || '')
    .trim()
    .toUpperCase();
}

function normalizeTaskPriority(priority) {
  return String(priority || '')
    .trim()
    .toUpperCase();
}

function assertTaskStatus(status) {
  if (!TASK_STATUSES.includes(status)) {
    throw badRequest('任务状态非法', 'INVALID_TASK_STATUS');
  }
}

function assertTaskPriority(priority) {
  if (!TASK_PRIORITIES.includes(priority)) {
    throw badRequest('任务优先级非法', 'INVALID_TASK_PRIORITY');
  }
}

function toSafeTask(task) {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    dueAt: task.dueAt,
    userId: task.userId,
    category: task.category ? categoryService.toSafeCategory(task.category) : null,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt
  };
}

function assertTaskOwnership(task, userId) {
  if (!task) {
    throw notFound('任务不存在', 'TASK_NOT_FOUND');
  }

  if (task.userId !== userId) {
    throw forbidden('无权访问该任务', 'FORBIDDEN_TASK');
  }
}

function buildTaskWhere(query) {
  const where = {};

  if (query.status) {
    where.status = query.status;
  }

  if (query.priority) {
    where.priority = query.priority;
  }

  if (query.categoryId) {
    where.categoryId = query.categoryId;
  }

  if (query.dueFrom || query.dueTo) {
    where.dueAt = {};

    if (query.dueFrom) {
      where.dueAt.gte = new Date(query.dueFrom);
    }

    if (query.dueTo) {
      where.dueAt.lte = new Date(query.dueTo);
    }
  }

  return where;
}

async function createTask({ userId, title, description, status, priority, dueAt, categoryId }) {
  const normalizedTitle = normalizeTaskTitle(title);

  if (!normalizedTitle) {
    throw badRequest('任务标题不能为空', 'TASK_TITLE_REQUIRED');
  }

  const normalizedStatus = status ? normalizeTaskStatus(status) : 'TODO';
  const normalizedPriority = priority ? normalizeTaskPriority(priority) : 'MEDIUM';

  assertTaskStatus(normalizedStatus);
  assertTaskPriority(normalizedPriority);

  if (categoryId) {
    await categoryService.ensureCategoryBelongsToUser(categoryId, userId);
  }

  const task = await taskRepository.createTask({
    userId,
    categoryId: categoryId || null,
    title: normalizedTitle,
    description: normalizeTaskDescription(description),
    status: normalizedStatus,
    priority: normalizedPriority,
    dueAt: dueAt || null
  });

  return toSafeTask(task);
}

async function listTasks({ userId, query }) {
  const page = query.page;
  const pageSize = query.pageSize;
  const skip = (page - 1) * pageSize;
  const where = buildTaskWhere(query);
  const orderBy = {
    [query.sortBy]: query.sortOrder
  };

  const [items, total] = await Promise.all([
    taskRepository.findTasksByUserId({
      userId,
      where,
      skip,
      take: pageSize,
      orderBy
    }),
    taskRepository.countTasksByUserId({
      userId,
      where
    })
  ]);

  return {
    items: items.map(toSafeTask),
    meta: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize)
    }
  };
}

async function getTaskById(userId, taskId) {
  const task = await taskRepository.findTaskById(taskId);

  assertTaskOwnership(task, userId);

  return toSafeTask(task);
}

async function updateTask(userId, taskId, payload) {
  const task = await taskRepository.findTaskById(taskId);

  assertTaskOwnership(task, userId);

  const nextTitle = payload.title !== undefined ? normalizeTaskTitle(payload.title) : task.title;
  const nextDescription =
    payload.description !== undefined
      ? normalizeTaskDescription(payload.description)
      : task.description;
  const nextStatus =
    payload.status !== undefined ? normalizeTaskStatus(payload.status) : task.status;
  const nextPriority =
    payload.priority !== undefined ? normalizeTaskPriority(payload.priority) : task.priority;
  const nextDueAt = payload.dueAt !== undefined ? payload.dueAt || null : task.dueAt;

  if (!nextTitle) {
    throw badRequest('任务标题不能为空', 'TASK_TITLE_REQUIRED');
  }

  assertTaskStatus(nextStatus);
  assertTaskPriority(nextPriority);

  let nextCategoryId = task.categoryId;

  if (payload.categoryId !== undefined) {
    nextCategoryId = payload.categoryId || null;

    if (nextCategoryId) {
      await categoryService.ensureCategoryBelongsToUser(nextCategoryId, userId);
    }
  }

  const updatedTask = await taskRepository.updateTaskById({
    id: taskId,
    data: {
      title: nextTitle,
      description: nextDescription,
      status: nextStatus,
      priority: nextPriority,
      dueAt: nextDueAt,
      categoryId: nextCategoryId
    }
  });

  return toSafeTask(updatedTask);
}

async function deleteTask(userId, taskId) {
  const task = await taskRepository.findTaskById(taskId);

  assertTaskOwnership(task, userId);

  await taskRepository.deleteTaskById(taskId);

  return toSafeTask(task);
}

module.exports = {
  createTask,
  listTasks,
  getTaskById,
  updateTask,
  deleteTask,
  TASK_STATUSES,
  TASK_PRIORITIES,
  toSafeTask
};
