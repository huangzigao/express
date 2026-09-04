const prisma = require('../database/prisma');

function findUserByEmail(email) {
  return prisma.user.findUnique({
    where: { email }
  });
}

function findUserById(id) {
  return prisma.user.findUnique({
    where: { id }
  });
}

function createUser(data) {
  return prisma.user.create({
    data: {
      email: data.email,
      passwordHash: data.passwordHash
    }
  });
}

module.exports = {
  findUserByEmail,
  findUserById,
  createUser
};
