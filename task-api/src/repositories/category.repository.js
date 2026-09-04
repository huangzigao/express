const prisma = require('../database/prisma');

function findCategoryById(id) {
  return prisma.category.findUnique({
    where: { id }
  });
}

function findCategoryByIdAndUserId({ id, userId }) {
  return prisma.category.findFirst({
    where: {
      id,
      userId
    }
  });
}

function findCategoryByNameAndUserId({ name, userId }) {
  return prisma.category.findUnique({
    where: {
      userId_name: {
        userId,
        name
      }
    }
  });
}

function findCategoriesByUserId(userId) {
  return prisma.category.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  });
}

function createCategory(data) {
  return prisma.category.create({
    data: {
      userId: data.userId,
      name: data.name
    }
  });
}

function updateCategoryById({ id, data }) {
  return prisma.category.update({
    where: { id },
    data
  });
}

function deleteCategoryById(id) {
  return prisma.category.delete({
    where: { id }
  });
}

module.exports = {
  findCategoryById,
  findCategoryByIdAndUserId,
  findCategoryByNameAndUserId,
  findCategoriesByUserId,
  createCategory,
  updateCategoryById,
  deleteCategoryById
};
