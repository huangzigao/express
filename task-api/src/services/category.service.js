const categoryRepository = require('../repositories/category.repository');
const { badRequest, forbidden, notFound } = require('../utils/app-error');

function normalizeCategoryName(name) {
  return String(name || '').trim();
}

function toSafeCategory(category) {
  return {
    id: category.id,
    name: category.name,
    userId: category.userId,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt
  };
}

function assertCategoryOwnership(category, userId) {
  if (!category) {
    throw notFound('分类不存在', 'CATEGORY_NOT_FOUND');
  }

  if (category.userId !== userId) {
    throw forbidden('无权访问该分类', 'FORBIDDEN_CATEGORY');
  }
}

async function createCategory({ userId, name }) {
  const normalizedName = normalizeCategoryName(name);

  if (!normalizedName) {
    throw badRequest('分类名称不能为空', 'CATEGORY_NAME_REQUIRED');
  }

  const existed = await categoryRepository.findCategoryByNameAndUserId({
    name: normalizedName,
    userId
  });

  if (existed) {
    throw badRequest('分类名称已存在', 'CATEGORY_NAME_DUPLICATED');
  }

  const category = await categoryRepository.createCategory({
    userId,
    name: normalizedName
  });

  return toSafeCategory(category);
}

async function listCategories(userId) {
  const categories = await categoryRepository.findCategoriesByUserId(userId);
  return categories.map(toSafeCategory);
}

async function getCategoryById(userId, categoryId) {
  const category = await categoryRepository.findCategoryById(categoryId);
  assertCategoryOwnership(category, userId);
  return toSafeCategory(category);
}

async function updateCategory(userId, categoryId, payload) {
  const category = await categoryRepository.findCategoryById(categoryId);
  assertCategoryOwnership(category, userId);

  const nextName = payload.name !== undefined ? normalizeCategoryName(payload.name) : category.name;

  if (!nextName) {
    throw badRequest('分类名称不能为空', 'CATEGORY_NAME_REQUIRED');
  }

  const existed = await categoryRepository.findCategoryByNameAndUserId({
    name: nextName,
    userId
  });

  if (existed && existed.id !== categoryId) {
    throw badRequest('分类名称已存在', 'CATEGORY_NAME_DUPLICATED');
  }

  const updatedCategory = await categoryRepository.updateCategoryById({
    id: categoryId,
    data: {
      name: nextName
    }
  });

  return toSafeCategory(updatedCategory);
}

async function removeCategory(userId, categoryId) {
  const category = await categoryRepository.findCategoryById(categoryId);
  assertCategoryOwnership(category, userId);

  await categoryRepository.deleteCategoryById(categoryId);

  return toSafeCategory(category);
}

async function ensureCategoryBelongsToUser(categoryId, userId) {
  if (!categoryId) {
    return null;
  }

  const category = await categoryRepository.findCategoryByIdAndUserId({
    id: categoryId,
    userId
  });

  if (!category) {
    throw notFound('分类不存在', 'CATEGORY_NOT_FOUND');
  }

  return category;
}

module.exports = {
  createCategory,
  listCategories,
  getCategoryById,
  updateCategory,
  removeCategory,
  ensureCategoryBelongsToUser,
  toSafeCategory
};
