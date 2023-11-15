const { getLogger } = require('../core/logging');
const {prisma} = require('../data/index');

//Alle service bestand hebben ook een bestanden in repo 
// als een functie te eenvoud is en voor alle bestanden gelijk is 
// wordt het hier in index gezet

// get all function that takes table name as input and gives
// all rows back
const getAllData = async (table, filter) => {
    try {
      console.log("Receved table:" + table)
      const data = await prisma[table].findMany(filter);
      
      return data
    } catch (error) {
      getLogger().error('Error', {
        error,
      });
      throw error;
    } finally {
      await prisma.$disconnect();
    }
}

const getDataById = async (table, filter) => {
    try {
      const data = await prisma[table].findUnique(filter);
      return data;
    } catch (error) {
      getLogger().error('Error', {
        error,
      });
      throw error;
    } finally {
      await prisma.$disconnect();
    }
  }

const deleteDataById = async (table, filter)=>{
    try {
      const rows = await prisma[table].delete(filter);
      const aantal = Object.keys(rows);
      return aantal>0
    } catch (error) {
      getLogger().error('Error', {
        error,
      });
      throw error;
    } finally {
      await prisma.$disconnect();
    }
 }

//add
const addData = async (table, data)=>{
  try {
    return await prisma[table].create(data);
  } catch (error) {
    getLogger().info("Error while inserting data");
    getLogger().error('Error', {
      error,
    });
   throw error;
  } finally {
    await prisma.$disconnect();
  }
}


  module.exports={
    getAllData,
    getDataById,
    deleteDataById,
    addData
  }