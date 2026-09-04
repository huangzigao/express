const prisma = require('./prisma');
const logger = require('../config/logger');

async function connectDatabase() {
  try {
    await prisma.$connect();
    logger.info('数据库连接成功');
  } catch (error) {
    logger.error({ err: error }, '数据库连接失败');
    throw error;
  }
}

async function disconnectDatabase() {
  try {
    await prisma.$disconnect();
    logger.info('数据库连接已关闭');
  } catch (error) {
    logger.error({ err: error }, '数据库连接关闭失败');
    throw error;
  }
}

module.exports = {
  connectDatabase,
  disconnectDatabase
};
