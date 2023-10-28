const { getLogger } = require('../core/logging');
const {prisma, tables} = require('../data/index');

const getAll = async () => {
    try {
      const users = await prisma[tables.users].findMany();
 
      return users
    } catch (error) {
      getLogger().error('Error', {
        error,
      });
      throw error;
    } finally {
      await prisma.$disconnect();
    }
}

const getById = async (id) => {
  try {
      const user = await prisma
          .users
          .findMany({
                  where: {
                  userId: id,
                  },
               }
          );
    return user
  } catch (error) {
    getLogger().error('Error', {
      error,
    });
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

module.exports={
    getAll,
    getById
}

