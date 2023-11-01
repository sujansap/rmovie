const { getLogger } = require('../core/logging');
const {prisma, tables} = require('../data/index');


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
      const reviews = await prisma[tables.reviews]
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
        const review = await prisma[tables.reviews]
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

const add = async(uid, mid, review, rating)=>{
  try {
    const reviewedMovie = await prisma[tables.reviews].create(
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
    
  } finally{
    await prisma.$disconnect();
  }
}

module.exports = {
    getAll,
    getById, 
    add
}