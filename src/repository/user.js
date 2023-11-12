const { getLogger } = require('../core/logging');
const {prisma, tables} = require('../data/index');

const dbData = require('./index');
const TABLE = tables.users;

const getAll = async ()=>{
  //there is no filter  //we just want all the data
  filter = {};
  return await dbData.getAllData(TABLE, filter);
}

const getReviewsForUser = async (uid)=>{
  //there is no filter  //we just want all the data
  filter = 
  {
    where: {
      userId:uid
    }
  };
  
  return await dbData.getAllData(tables.reviews, filter);
}

const getReviewForMovieForUser = async (uid, mid)=>{
  //there is no filter  //we just want all the data
  filter = 
  {
    where: {
    userId: uid, 
    movieId: mid,
    }
 }
  
  return await dbData.getAllData(tables.reviews, filter);
}


const getById = async (id) => {
  const filter = { where: {userId: id} };
  return await dbData.getDataById(TABLE,filter);
}

module.exports={
    getAll,
    getById,
    getReviewsForUser,
    getReviewForMovieForUser
}

