const taskRepository = require('../repositories/task.repository');
const { badRequest, forbidden, notFound } = require('../utils/app-error');

const TASK_STATUSES = ['TODO', 'IN_PROGRESS', 'DONE'];

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

  const value = Number(priority);

  if (!Number.isInteger(value) || value < 1 || value > 3) {
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
    dueDate: task.dueDate,
    userId: task.userId,
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

async function createTask({ userId, title, description, status, priority, dueDate }) {
  const normalizedTitle = normalizeTaskTitle(title);

  if (!normalizedTitle) {
    throw badRequest('任务标题不能为空', 'TASK_TITLE_REQUIRED');
  }

  const normalizedStatus = status ? normalizeTaskStatus(status) : 'TODO';
  assertTaskStatus(normalizedStatus);
  assertTaskPriority(priority);

  const task = await taskRepository.createTask({
    userId,
    title: normalizedTitle,
    description: normalizeTaskDescription(description),
    status: normalizedStatus,
    priority: priority === undefined || priority === null ? 2 : Number(priority),
    dueDate: dueDate || null
  });

  return toSafeTask(task);
}

async function listTasks(userId) {
  const tasks = await taskRepository.listTasksByUserId(userId);
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
      ? Number(payload.priority)
      : task.priority;
  const nextDueDate = payload.dueDate !== undefined ? payload.dueDate || null : task.dueDate;

  if (!nextTitle) {
    throw badRequest('任务标题不能为空', 'TASK_TITLE_REQUIRED');
  }

  assertTaskStatus(nextStatus);
  assertTaskPriority(nextPriority);

  const updatedTask = await taskRepository.updateTask(taskId, {
    title: nextTitle,
    description: nextDescription,
    status: nextStatus,
    priority: nextPriority,
    dueDate: nextDueDate
  });

  return toSafeTask(updatedTask);
}

async function deleteTask(userId, taskId) {
  const task = await taskRepository.findTaskById(taskId);

  assertTaskOwnership(task, userId);

  await taskRepository.deleteTask(taskId);

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
