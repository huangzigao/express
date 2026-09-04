const http = require('node:http');

const app = require('./app');
const env = require('./config/env');
const logger = require('./config/logger');
const { connectDatabase, disconnectDatabase } = require('./database/lifecycle');

const server = http.createServer(app);
let shuttingDown = false;

async function startServer() {
  await connectDatabase();

  server.listen(env.PORT, () => {
    logger.info(
      {
        port: env.PORT,
        environment: env.NODE_ENV
      },
      'Task API 已启动'
    );
  });
}

async function shutdown(signal) {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;
  logger.info({ signal }, '开始关闭服务');

  server.close(async (error) => {
    if (error) {
      logger.error({ err: error }, '服务关闭失败');
      process.exitCode = 1;
    }

    try {
      await disconnectDatabase();
      logger.info('服务已关闭');
      process.exit(process.exitCode || 0);
    } catch (disconnectError) {
      logger.error({ err: disconnectError }, '服务关闭时释放数据库失败');
      process.exit(1);
    }
  });
}

process.on('SIGINT', () => {
  shutdown('SIGINT');
});

process.on('SIGTERM', () => {
  shutdown('SIGTERM');
});

startServer().catch(async (error) => {
  logger.error({ err: error }, '服务启动失败');

  try {
    await disconnectDatabase();
  } finally {
    process.exit(1);
  }
});
