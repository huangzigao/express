const taskRepository = require('../repositories/task.repository');
const categoryService = require('./category.service');
const { badRequest, forbidden, notFound } = require('../utils/app-error');

const TASK_STATUSES = ['TODO', 'IN_PROGRESS', 'DONE'];
const TASK_PRIORITIES = {
  1: 'LOW',
  2: 'MEDIUM',
  3: 'HIGH',
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH'
};

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

function assertTaskStatus(status) {
  if (!TASK_STATUSES.includes(status)) {
    throw badRequest('任务状态非法', 'INVALID_TASK_STATUS');
  }
}

function assertTaskPriority(priority) {
  if (priority === undefined || priority === null) {
    return;
  }

  const value = normalizeTaskPriority(priority);

  if (!value) {
    throw badRequest('任务优先级非法', 'INVALID_TASK_PRIORITY');
  }
}

function normalizeTaskPriority(priority) {
  if (priority === undefined || priority === null || priority === '') {
    return null;
  }

  const rawValue =
    typeof priority === 'string' ? priority.trim().toUpperCase() : Number(priority);

  return TASK_PRIORITIES[rawValue] || null;
}

function toSafeTask(task) {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    dueDate: task.dueAt,
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

async function createTask({ userId, title, description, status, priority, dueDate, categoryId }) {
  const normalizedTitle = normalizeTaskTitle(title);

  if (!normalizedTitle) {
    throw badRequest('任务标题不能为空', 'TASK_TITLE_REQUIRED');
  }

  const normalizedStatus = status ? normalizeTaskStatus(status) : 'TODO';
  const normalizedPriority = priority === undefined || priority === null ? 'MEDIUM' : normalizeTaskPriority(priority);
  assertTaskStatus(normalizedStatus);
  assertTaskPriority(priority);

  if (!normalizedPriority) {
    throw badRequest('任务优先级非法', 'INVALID_TASK_PRIORITY');
  }

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
    dueAt: dueDate || null
  });

  return toSafeTask(task);
}

async function listTasks(userId) {
  const tasks = await taskRepository.findTasksByUserId({ userId });
  return tasks.map(toSafeTask);
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
    payload.priority !== undefined && payload.priority !== null
      ? normalizeTaskPriority(payload.priority)
      : task.priority;
  const nextDueDate = payload.dueDate !== undefined ? payload.dueDate || null : task.dueAt;

  if (!nextTitle) {
    throw badRequest('任务标题不能为空', 'TASK_TITLE_REQUIRED');
  }

  assertTaskStatus(nextStatus);
  assertTaskPriority(nextPriority);

  if (payload.priority !== undefined && payload.priority !== null && !nextPriority) {
    throw badRequest('任务优先级非法', 'INVALID_TASK_PRIORITY');
  }

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
      dueAt: nextDueDate,
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
  toSafeTask
};
