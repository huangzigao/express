const { PrismaClient } = require('@prisma/client');

const logger = require('../config/logger');

const prisma = new PrismaClient({
  log: [
    { emit: 'event', level: 'error' },
    { emit: 'event', level: 'warn' }
  ]
});

prisma.$on('error', (event) => {
  logger.error(
    {
      message: event.message,
      target: event.target
    },
    'Prisma 错误'
  );
});

prisma.$on('warn', (event) => {
  logger.warn(
    {
      message: event.message,
      target: event.target
    },
    'Prisma 警告'
  );
});

module.exports = prisma;
