const prisma = require('../src/database/prisma');
const { disconnectDatabase } = require('../src/database/lifecycle');

async function main() {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('生产环境禁止执行数据库重置脚本');
  }

  await prisma.task.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  console.log('数据库数据已清空');
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await disconnectDatabase();
  });
