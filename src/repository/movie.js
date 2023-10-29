const { getLogger } = require('../core/logging');
const {prisma, tables} = require('../data/index');

const getAll = async () => {
    try {
      const reviews = await prisma[tables.movies].findMany();
 
      return reviews
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
    const review = await prisma[tables.movies].findUnique({
      where:{
        movieId: id
      }
    });

    return review
  } catch (error) {
    getLogger().error('Error', {
      error,
    });
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

const deleteById = async (id)=>{
  try {
    const rows = await prisma[tables.movies].delete({
      where:{
        movieId: id
      }
    });

    return rows>0
  } catch (error) {
    getLogger().error('Error', {
      error,
    });
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}
const add = async (movieTitle, user)=>{
  //when you add a movie, you have to give genres, but genres are added to different table
  //for that reason we need to know the id of the movie row we just added into the db

  try {
    const movie = await prisma[tables.movies].create({
      data:{
        title:movieTitle,
        userId:user
      }
    });
    const id = movie.movieId;
    console.log(id)
    return id;

  } catch (error) {
    getLogger().error('Error', {
      error,
    });
    throw error;
  } finally {
    await prisma.$disconnect();
  }
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
    add,
    updateById
}