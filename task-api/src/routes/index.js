const express = require('express');
const healthRoutes = require('./health.routes');
const userRoutes = require('./user.routes');
const taskRoutes = require('./task.routes');
const categoryRoutes = require('./category.routes');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.use('/health', healthRoutes);
router.use('/users', userRoutes);
router.use('/tasks', authMiddleware, taskRoutes);
router.use('/categories', authMiddleware, categoryRoutes);

module.exports = router;
