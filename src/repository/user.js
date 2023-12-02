const { getLogger } = require('../core/logging');
const {prisma, tables} = require('../data/index');

const dbData = require('./index');
const TABLE = tables.users;

const getAll = async ()=>{
  //there is no filter  //we just want all the data
  const filter = {};
  return await dbData.getAllData(TABLE, filter);
}

const getReviewsForUser = async (uid)=>{
  //there is no filter  //we just want all the data
  const filter = 
  {
    where: {
      userId:uid
    }
  };


  
  
  return await dbData.getAllData(tables.reviews, filter);
}

const getReviewForMovieForUser = async (uid, mid)=>{
  //this will return the review with all the information needed
  const filter  = {
    where:{
      "userId_movieId":{
        userId:uid,
        movieId: mid
      }
    },
    include: {
      user: {
        select: {
          username: true,
        },
      },
      movie:{
        select:{
          title: true,
          poster:true
        }
      }
      
    }}

  const filter2 = 
  {
    where: {
    "userId_movieId":{
      userId: uid, 
      movieId: mid,
    }
    }
 }

  
  return await dbData.getDataById(tables.reviews, filter);
}

const updateMovieReviewForUser = async(uid, mid, data)=>{
  const filter = {
    where:{
      "userId_movieId":{
        userId:uid,
        movieId: mid
      }
    },
    data
  }

  return await prisma[tables.reviews].update(filter);

}


const getById = async (id) => {
  const filter = { where: {userId: id} };
  return await dbData.getDataById(TABLE,filter);
}

module.exports={
    getAll,
    getById,
    getReviewsForUser,
    getReviewForMovieForUser,
    updateMovieReviewForUser
}

