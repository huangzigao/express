const express = require('express');

const taskController = require('../controllers/task.controller');

const router = express.Router();

router.post('/', taskController.create);
router.get('/', taskController.list);
router.get('/:id', taskController.detail);
router.put('/:id', taskController.update);
router.delete('/:id', taskController.remove);

module.exports = router;
