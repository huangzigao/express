const express = require('express');

const taskController = require('../controllers/task.controller');
const validate = require('../middlewares/validate.middleware');
const {
  createTaskSchema,
  updateTaskSchema,
  taskIdSchema,
  listTasksSchema
} = require('../validators/task.validator');

const router = express.Router();

router.post('/', validate(createTaskSchema), taskController.create);
router.get('/', validate(listTasksSchema), taskController.list);
router.get('/:id', validate(taskIdSchema), taskController.detail);
router.put('/:id', validate(updateTaskSchema), taskController.update);
router.delete('/:id', validate(taskIdSchema), taskController.remove);

module.exports = router;
