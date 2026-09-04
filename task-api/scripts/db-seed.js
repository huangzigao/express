const bcrypt = require('bcrypt');

const prisma = require('../src/database/prisma');
const { disconnectDatabase } = require('../src/database/lifecycle');

const demoEmail = 'demo@example.com';
const demoPassword = 'Password123!';

async function main() {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('生产环境禁止执行种子数据脚本');
  }

  const passwordHash = await bcrypt.hash(demoPassword, 10);

  const user = await prisma.user.upsert({
    where: { email: demoEmail },
    update: { passwordHash },
    create: {
      email: demoEmail,
      passwordHash
    }
  });

  await prisma.task.deleteMany({
    where: { userId: user.id }
  });

  await prisma.category.deleteMany({
    where: { userId: user.id }
  });

  const workCategory = await prisma.category.create({
    data: {
      userId: user.id,
      name: '工作'
    }
  });

  const studyCategory = await prisma.category.create({
    data: {
      userId: user.id,
      name: '学习'
    }
  });

  await prisma.task.createMany({
    data: [
      {
        userId: user.id,
        categoryId: workCategory.id,
        title: '整理 Express 项目结构',
        description: '确认路由、控制器、服务和数据访问层职责清晰',
        status: 'TODO',
        priority: 'HIGH',
        dueAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
      },
      {
        userId: user.id,
        categoryId: studyCategory.id,
        title: '学习 Prisma 迁移流程',
        description: '理解 schema、migration 和 Prisma Client 的关系',
        status: 'IN_PROGRESS',
        priority: 'MEDIUM',
        dueAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
      }
    ]
  });

  console.log(`种子数据已写入，演示账号：${demoEmail}，密码：${demoPassword}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await disconnectDatabase();
  });
