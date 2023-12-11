const { getLogger } = require("../core/logging");
const { prisma, tables } = require("../data/index");

const dbData = require("./index");

const TABLE = tables.reviews;
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
  /*
  const filter = {
    where: {
      userId: uid,
    },

    include: {
      movie: {
        select: {
          movieId: true,
          title: true,
          poster: true,
        },
      },
    },
  };*/

  const filter = {
    where: {
      userId: uid,
    },
    select: {
      movie: {
        select: {
          movieId: true,
          title: true,
          poster: true,
        },
      },
    },
  };
  return await dbData.getAllData(TABLE, filter);
  /*
  try {
    const reviews = await prisma[TABLE].findMany({
      where: {
        userId: uid,
      },
    });
    return reviews;
  } catch (error) {
    getLogger().error("Error", {
      error,
    });
    throw error;
  } finally {
    await prisma.$disconnect();
  }
  */
};

const deleteById = async (rid) => {
  /*const filter = {
    where:{
      "userId_movieId":{
        userId:uid,
        movieId: mid
      }
    }

  }*/
  const filter = {
    where: {
      reviewId: rid,
    },
  };
  return await dbData.deleteDataById(tables.reviews, filter);
};

//get the full review of a movie for a user
const getById = async (rid) => {
  try {
    const review = await prisma[TABLE].findUnique({
      where: {
        reviewId: rid,
      },
      include: {
        user: {
          select: {
            username: true,
          },
        },
        movie: {
          select: {
            title: true,
            poster: true,
          },
        },
      },
    });
    console.log("test---");
    return review;
  } catch (error) {
    getLogger().error("Error", {
      error,
    });
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};

//add a review for a movie for a user
const add = async (uid, mid, review, rating) => {
  const dataReview = {
    data: {
      userId: uid,
      movieId: mid,
      review: review,
      rating: rating,
    },
  };

  return await dbData.addData(tables.reviews, dataReview);
};

const updateReview = async (rid, data) => {
  const filter = {
    where: {
      reviewId: rid,
    },
    data,
  };

  return await prisma[tables.reviews].update(filter);
};

module.exports = {
  getAll,
  getById,
  add,
  deleteById,
  updateReview,
};
