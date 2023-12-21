const movieRepository = require("../repository/movie");
const ServiceError = require("../core/serviceError");

const handleDBError = require("./_handleDBError");

const getAll = async () => {
  const data = await movieRepository.getAll();
  return { items: data, count: data.length };
};

const getAllReviewsForMovie = async (mid) => {
  let data = await movieRepository.getAllReviewsForMovie(mid);

  if (data.length === 0 || data[0].movieId !== mid) {
    throw ServiceError.notFound(`No reviews for movie with id ${mid} exist`, {
      mid,
    });
  }
  data = data.map((d) => {
    d.poster = d.movie.poster;
    d.movie = d.movie.title;
    d.user = d.user.username;

    return d;
  });

  return { items: data, count: data.length };
};

const getById = async (mid) => {
  const data = await movieRepository.getById(mid);
  if (!data || data.movieId !== mid) {
    throw ServiceError.notFound(`No movie with id ${mid} exists`, { mid });
  }

  data.genreMovies = data.genreMovies.map((item) => item.genre.genre);
  return data;
  //return { items: data, count: data.length };
};

const getAverageRating = async (mid) => {
  const data = await movieRepository.getAverageRating(mid);

  if (
    !data ||
    !data._avg ||
    data._avg.rating === null ||
    data._avg.rating === undefined
  ) {
    //throw ServiceError.notFound(`No rating yet for movie with ${mid}`, { mid });
    data._avg.rating = -1;
  }
  data.rating = data._avg.rating;
  delete data._avg;
  //return data;
  return data;
};

const getAllGenres = async () => {
  const data = await movieRepository.getAllGenres();

  return { items: data, count: data.length };
};

const getMovieGeneres = async (mid) => {
  let data = await movieRepository.getMovieGenre(mid);
  data = data.genreMovies.map((item) => item.genre.genre);

  if (data.length == 0) {
    throw ServiceError.notFound(`No genres for movie with id ${mid} exist`, {
      mid,
    });
  }

  return data;
};

const deleteById = async (id, userId) => {
  //check if  the admin was the one who added of the movie
  const movie = await getById(id);

  if (movie.userId !== userId) {
    throw ServiceError.forbidden(`The movie was not added by you`, {
      mid: id,
      uid: userId,
    });
  }

  return await movieRepository.deleteById(id);
};

const addMovie = async (data) => {
  try {
    return await movieRepository.addMovie(data);
  } catch (error) {
    throw handleDBError(error);
  }
};

const getReviewForMovie = async (uid, mid) => {
  let data = await movieRepository.getReviewForMovie(uid, mid);
  if (!data) {
    /*throw ServiceError.notFound(
      `No review for movie with id ${mid} exists for the user with id ${uid}`,
      { mid, uid }
    );*/
    data = {};
    return data;
  }

  data.title = data.movie.title;
  data.poster = data.movie.poster;
  data.username = data.user.username;
  delete data.user;
  delete data.movie;

  //wat als er de user nog geen review heeft gemaakt voor een movie

  return data;
};

module.exports = {
  getAll,
  getById,
  deleteById,
  addMovie,
  getMovieGeneres,
  getAllReviewsForMovie,
  getReviewForMovie,
  getAverageRating,
  getAllGenres,
};
