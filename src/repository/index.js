const { getLogger } = require("../core/logging");
const { prisma } = require("../data/index");

//All service files also have corresponding files in the repository.
//If a function is too simple and is the same for all files, it is placed here in the index.

const getAllData = async (table, filter) => {
  try {
    const data = await prisma[table].findMany(filter);

    return data;
  } catch (error) {
    getLogger().error("Error while getting all data", {
      error,
    });
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};

const getDataById = async (table, filter) => {
  try {
    const data = await prisma[table].findUnique(filter);
    return data;
  } catch (error) {
    getLogger().error("Error while getting data by id", {
      error,
    });
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};

const deleteDataById = async (table, filter) => {
  try {
    const rows = await prisma[table].deleteMany(filter);

    return rows;
  } catch (error) {
    getLogger().error("Error while deleting data", {
      error,
    });
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};

//add
const addData = async (table, data) => {
  try {
    return await prisma[table].create(data);
  } catch (error) {
    getLogger().info("Error while inserting data");
    getLogger().error("Error", {
      error,
    });
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};

module.exports = {
  getAllData,
  getDataById,
  deleteDataById,
  addData,
};
