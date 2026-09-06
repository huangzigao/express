const express = require('express');

const categoryController = require('../controllers/category.controller');
const validate = require('../middlewares/validate.middleware');
const {
  createCategorySchema,
  updateCategorySchema,
  categoryIdSchema
} = require('../validators/category.validator');

const router = express.Router();

router.post('/', validate(createCategorySchema), categoryController.create);
router.get('/', categoryController.list);
router.get('/:id', validate(categoryIdSchema), categoryController.detail);
router.put('/:id', validate(updateCategorySchema), categoryController.update);
router.delete('/:id', validate(categoryIdSchema), categoryController.remove);

module.exports = router;
