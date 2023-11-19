const { getLogger } = require('../core/logging');
const {prisma, tables} = require('../data/index');
const {addGenres} = require('./genre');


const dbData = require('./index');

const TABLE = tables.movies;

const getAll = async () => {
  const filter = {};
  return await dbData.getAllData(TABLE, filter);
}

const getAllReviewsForMovie = async (mid) => {
  const filter = {
    where:{
      movieId:mid
    }
  };

  const filter2 = {
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
        }
      }
      
    }
  }
  return await dbData.getAllData(tables.reviews, filter);
}


const getMovieGenre = async (mid)=> {
  const filter =
  {
    where: { movieId: mid },
    select: 
    {
      genreMovies: 
      {
        select: 
        {
          genre: 
          {
            select: 
            {
              genre: true
            }
          }
        }
      }
    }
  };
  return await dbData.getDataById(TABLE, filter);
}

const getById = async (id) => {
  const filter = {
    where: {
      movieId: id
    },
    include: {
      genreMovies: {
        select: {
          genre: {
            select: {
              genre: true
            }
          }
        }
      }
    }
  };
  return await dbData.getDataById(TABLE, filter);

}

const deleteById = async (id)=>{

  const filter = {
    where:{
      movieId: id
    }
  };

  return await dbData.deleteDataById(TABLE, filter);
}


// add moet nog in index
const addMovie = async (movieTitle, user,poster, synopsis, genres)=>{
  //when you add a movie, you have to give genres, but genres are added to different table
  //for that reason we need to know the id of the movie row we just added into the db
  const movie={
    data:{
      title:movieTitle,
      userId:user,
      poster:poster,
      synopsis:synopsis
    }
  };

  const addedMovie = await dbData.addData(TABLE,movie);
  const id = addedMovie.movieId;
  console.log("test genres------");
  console.log(id);
  
  addGenres(id, genres);
  return id;
  
}

const addReview = async(uid, mid, review, rating)=>{

  const dataReview =
  {
    data:{
      userId:uid,
      movieId:mid,
      review:review,
      rating:rating
    }
  }
  
  return await dbData.addData(tables.reviews, dataReview);
}




const updateById = async (id, {title, user}) => {
  try {
    console.log("here done");
    await prisma[tables.movies].update({
      where: {
        movieId: id
      }, 
      data:{
        title:title,
        userId:user 
      }
    });
    return id;
  } catch (error) {
    getLogger().error('Error', {
      error,
    });
  }finally{
    await prisma.$disconnect();
  }
  
}



module.exports = {
    getAll,
    getById,
    deleteById,
    addMovie,
    updateById,
    getMovieGenre,
    getAllReviewsForMovie,
    addReview
}