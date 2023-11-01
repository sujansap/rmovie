const { getLogger } = require('../core/logging');
const {prisma, tables} = require('../data/index');

const TABLE = tables.reviews
/*     const reviews = await prisma
.watchedMovies
.findMany({
        where: {
          movieId: 1,
        },
         }
);
*/

const getAll = async (uid) => {
    try {
      const reviews = await prisma[TABLE]
          .findMany({
            where: {
              userId:uid
            }
          });
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

const getById = async (uid, mid) => {
    try {
        const review = await prisma[TABLE]
            .findMany({
                    where: {
                    userId: uid, 
                    movieId: mid,
                    },
                 }
            );
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

const deleteById = async (uid, mid)=>{
  try {
    const rows = await prisma[TABLE].delete({
      where:{
        "userId_movieId":{
          userId:uid,
          movieId: mid
        }
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


const getFullReviewById = async (uid, mid) =>{
  try {
    const review = await prisma[TABLE]
        .findUnique({
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
        );
  console.log("test---");
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

const add = async(uid, mid, review, rating)=>{
  try {
    const reviewedMovie = await prisma[TABLE].create(
      {
        data:{
          userId:uid,
          movieId:mid,
          review:review,
          rating:rating
        }
      }
    );
    return reviewedMovie
  } catch (error) {
    getLogger().error('error with adding', {
      error,
    });
    throw error;
  } finally{
    await prisma.$disconnect();
  }
}

module.exports = {
    getAll,
    getById, 
    add,
    deleteById,
    getFullReviewById
}