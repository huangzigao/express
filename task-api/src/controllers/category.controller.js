const categoryService = require('../services/category.service');
const asyncHandler = require('../utils/async-handler');
const { success } = require('../utils/response');

const create = asyncHandler(async (req, res) => {
  const category = await categoryService.createCategory({
    userId: req.user.id,
    ...req.validated.body
  });

  res.status(201).json(
    success({
      message: '分类创建成功',
      data: {
        category
      }
    })
  );
});

const list = asyncHandler(async (req, res) => {
  const categories = await categoryService.listCategories(req.user.id);

  res.json(
    success({
      message: '分类列表获取成功',
      data: {
        categories
      }
    })
  );
});

const detail = asyncHandler(async (req, res) => {
  const category = await categoryService.getCategoryById(req.user.id, req.validated.params.id);

  res.json(
    success({
      message: '分类详情获取成功',
      data: {
        category
      }
    })
  );
});

const update = asyncHandler(async (req, res) => {
  const category = await categoryService.updateCategory(
    req.user.id,
    req.validated.params.id,
    req.validated.body
  );

  res.json(
    success({
      message: '分类更新成功',
      data: {
        category
      }
    })
  );
});

const remove = asyncHandler(async (req, res) => {
  await categoryService.removeCategory(req.user.id, req.validated.params.id);

  res.json(
    success({
      message: '分类删除成功',
      data: {
        id: req.validated.params.id
      }
    })
  );
});

module.exports = {
  create,
  list,
  detail,
  update,
  remove
};
