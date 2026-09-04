const express = require('express');
const healthRoutes = require('./health.routes');
const userRoutes = require('./user.routes');
const taskRoutes = require('./task.routes');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.use('/health', healthRoutes);
router.use('/users', userRoutes);
router.use(authMiddleware);
router.use('/tasks', taskRoutes);

module.exports = router;
