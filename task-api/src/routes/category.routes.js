const express = require('express');

const categoryController = require('../controllers/category.controller');

const router = express.Router();

router.post('/', categoryController.create);
router.get('/', categoryController.list);
router.get('/:id', categoryController.detail);
router.put('/:id', categoryController.update);
router.delete('/:id', categoryController.remove);

module.exports = router;
