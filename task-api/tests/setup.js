const prisma = require('../src/database/prisma');

beforeEach(async () => {
  await prisma.task.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});
