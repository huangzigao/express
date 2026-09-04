const taskService = require('../services/task.service');
const asyncHandler = require('../utils/async-handle');
const { success } = require('../utils/response');

const create = asyncHandler(async (req, res) => {
  const task = await taskService.createTask({
    userId: req.user.id,
    ...req.body
  });

  res.status(201).json(
    success({
      message: '任务创建成功',
      data: {
        task
      }
    })
  );
});

const list = asyncHandler(async (req, res) => {
  const tasks = await taskService.listTasks(req.user.id);

  res.json(
    success({
      message: '任务列表获取成功',
      data: {
        tasks
      }
    })
  );
});

const detail = asyncHandler(async (req, res) => {
  const task = await taskService.getTaskById(req.user.id, req.params.id);

  res.json(
    success({
      message: '任务详情获取成功',
      data: {
        task
      }
    })
  );
});

const update = asyncHandler(async (req, res) => {
  const task = await taskService.updateTask(req.user.id, req.params.id, req.body);

  res.json(
    success({
      message: '任务更新成功',
      data: {
        task
      }
    })
  );
});

const remove = asyncHandler(async (req, res) => {
  await taskService.deleteTask(req.user.id, req.params.id);

  res.json(
    success({
      message: '任务删除成功',
      data: {
        id: req.params.id
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
