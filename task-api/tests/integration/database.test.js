const prisma = require('../../src/database/prisma');
const { connectDatabase, disconnectDatabase } = require('../../src/database/lifecycle');

describe('数据库连接和基础读写', () => {
  let userId;

  beforeAll(async () => {
    await connectDatabase();
  });

  afterAll(async () => {
    if (userId) {
      await prisma.user.deleteMany({
        where: { id: userId }
      });
    }

    await disconnectDatabase();
  });

  test('可以创建并读取用户、分类和任务', async () => {
    const email = `database-test-${Date.now()}@example.com`;

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: 'test-password-hash'
      }
    });

    userId = user.id;

    const category = await prisma.category.create({
      data: {
        userId: user.id,
        name: '学习'
      }
    });

    const task = await prisma.task.create({
      data: {
        userId: user.id,
        categoryId: category.id,
        title: '验证数据库读写',
        description: '通过测试确认 Prisma 可以正常访问 MySQL',
        status: 'TODO',
        priority: 'HIGH'
      }
    });

    const foundTask = await prisma.task.findUnique({
      where: { id: task.id },
      include: {
        user: true,
        category: true
      }
    });

    expect(foundTask.title).toBe('验证数据库读写');
    expect(foundTask.user.email).toBe(email);
    expect(foundTask.category.name).toBe('学习');
  });
});
