const { getLogger } = require("../core/logging");
const { prisma, tables } = require("../data/index");

const dbData = require("./index");

const TABLE = tables.movies;

const getAll = async () => {
  const filter = {};
  return await dbData.getAllData(TABLE, filter);
};

const getAverageRating = async (movieId) => {
  const averageRating = await prisma[tables.reviews].aggregate({
    where: { movieId },
    _avg: {
      rating: true,
    },
  });
  return averageRating;
};
const getAllReviewsForMovie = async (mid) => {
  const filter = {
    where: {
      movieId: mid,
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
  };
  return await dbData.getAllData(tables.reviews, filter);
};

const getAllGenres = async () => {
  const filter = {};
  return await dbData.getAllData(tables.genres, filter);
};

const getMovieGenre = async (mid) => {
  const filter = {
    where: { movieId: mid },
    select: {
      genreMovies: {
        select: {
          genre: {
            select: {
              genre: true,
            },
          },
        },
      },
    },
  };
  return await dbData.getDataById(TABLE, filter);
};

const getById = async (id) => {
  const filter = {
    where: {
      movieId: id,
    },
    include: {
      genreMovies: {
        select: {
          genre: {
            select: {
              genre: true,
            },
          },
        },
      },
    },
  };
  return await dbData.getDataById(TABLE, filter);
};

const getReviewForMovie = async (uid, mid) => {
  //this will return the review with all the information needed
  const filter = {
    where: {
      userId_movieId: {
        userId: uid,
        movieId: mid,
      },
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
  };

  return await dbData.getDataById(tables.reviews, filter);
};

const deleteById = async (id) => {
  const filter = {
    where: {
      movieId: id,
    },
  };

  return await dbData.deleteDataById(TABLE, filter);
};

const getGenreId = async (g) => {
  const filter = {
    where: {
      genre: g,
    },
  };
  const genre = await dbData.getDataById(tables.genres, filter);

  return genre.genreId;
};

const addGenres = async (mid, genres) => {
  try {
    const genreIds = await Promise.all(genres.map(getGenreId));

    const movieGenresData = genreIds.map((gid) => ({
      genreId: gid,
      movieId: mid,
    }));

    return await prisma[tables.movieGenres].createMany({
      data: movieGenresData,
    });
  } catch (error) {
    getLogger().error("Error", {
      error,
    });
    throw error;
  }
};

// add moet nog in index
const addMovie = async ({ title, userId, poster, synopsis, genres }) => {
  //when you add a movie, you have to give genres, but genres are added to different table
  //for that reason we need to know the id of the movie row we just added into the db
  const movie = {
    data: {
      title,
      userId,
      poster,
      synopsis,
    },
  };

  const addedMovie = await dbData.addData(TABLE, movie);
  const id = addedMovie.movieId;

  const addedGenres = await addGenres(id, genres);

  return addedMovie;
};

module.exports = {
  getAll,
  getById,
  deleteById,
  addMovie,
  // updateById,
  getReviewForMovie,
  getMovieGenre,
  getAllReviewsForMovie,
  //addReview
  getAverageRating,
  getAllGenres,
};
