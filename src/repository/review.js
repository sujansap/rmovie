const { getLogger } = require('../core/logging');
const {prisma} = require('../data/index');


/*     const reviews = await prisma
.watchedMovies
.findMany({
        where: {
          movieId: 1,
        },
         }
);
*/

const getAll = async (table) => {
    try {
      const reviews = await prisma[table].findMany();
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
        const review = await prisma
            .watchedMovies
            .findMany({
                    where: {
                    movieId: id,
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



module.exports = {
    getAll,
    getById
}