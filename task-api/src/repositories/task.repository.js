const prisma = require('../database/prisma');

function findTaskById(id) {
  return prisma.task.findUnique({
    where: { id },
    include: {
      category: true
    }
  });
}

function findTaskByIdAndUserId({ id, userId }) {
  return prisma.task.findFirst({
    where: {
      id,
      userId
    },
    include: {
      category: true
    }
  });
}

function findTasksByUserId({
  userId,
  where = {},
  skip = 0,
  take = 20,
  orderBy = { createdAt: 'desc' }
}) {
  return prisma.task.findMany({
    where: {
      ...where,
      userId
    },
    skip,
    take,
    orderBy,
    include: {
      category: true
    }
  });
}

function countTasksByUserId({ userId, where = {} }) {
  return prisma.task.count({
    where: {
      ...where,
      userId
    }
  });
}

function createTask(data) {
  return prisma.task.create({
    data: {
      userId: data.userId,
      categoryId: data.categoryId || null,
      title: data.title,
      description: data.description || null,
      status: data.status || 'TODO',
      priority: data.priority || 'MEDIUM',
      dueAt: data.dueAt || null
    },
    include: {
      category: true
    }
  });
}

function updateTaskById({ id, data }) {
  return prisma.task.update({
    where: { id },
    data,
    include: {
      category: true
    }
  });
}

function deleteTaskById(id) {
  return prisma.task.delete({
    where: { id }
  });
}

module.exports = {
  findTaskById,
  findTaskByIdAndUserId,
  findTasksByUserId,
  countTasksByUserId,
  createTask,
  updateTaskById,
  deleteTaskById
};
