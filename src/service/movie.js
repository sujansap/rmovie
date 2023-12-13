const movieRepository = require("../repository/movie");
const ServiceError = require("../core/serviceError");

const handleDBError = require("./_handleDBError");

const getAll = async () => {
  const data = await movieRepository.getAll();
  return { items: data, count: data.length };
};

const getAllReviewsForMovie = async (mid) => {
  let data = await movieRepository.getAllReviewsForMovie(mid);
  console.log("what happend here!!!!!!!!");
  console.log(!data);
  console.log(data);
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
  return { items: data, count: data.length };
};

const getAverageRating = async (mid) => {
  const data = await movieRepository.getAverageRating(mid);

  if (
    !data ||
    !data._avg ||
    data._avg.rating === null ||
    data._avg.rating === undefined
  ) {
    throw ServiceError.notFound(`No rating yet for movie with ${mid}`, { mid });
  }
  data.rating = data._avg.rating;
  delete data._avg;
  return { items: data, count: 1 };
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

const deleteById = async (id) => {
  try {
    const deleted = await movieRepository.deleteById(id);

    if (deleted.count === 0) {
      throw ServiceError.notFound(`No movie with id ${id} exists`, { id });
    }
  } catch (error) {
    throw handleDBError(error);
  }
};

const addMovie = async (data) => {
  try {
    return await movieRepository.addMovie(data);
  } catch (error) {
    throw handleDBError(error);
  }
};

/*
const updateMovie = async (id, data)=>{
    return await movieRepository.updateById(id, data);
}
*/

const getReviewForMovie = async (uid, mid) => {
  const data = await movieRepository.getReviewForMovie(uid, mid);
  if (!data) {
    throw ServiceError.notFound(
      `No review for movie with id ${mid} exists for the user with id ${uid}`,
      { mid, uid }
    );
  }

  data.title = data.movie.title;
  data.poster = data.movie.poster;
  data.username = data.user.username;
  delete data.user;
  delete data.movie;

  //wat als er de user nog geen review heeft gemaakt voor een movie
  return { items: data };
};

module.exports = {
  getAll,
  getById,
  deleteById,
  addMovie,
  // updateMovie,
  getMovieGeneres,
  getAllReviewsForMovie,
  getReviewForMovie,
  //addReview
  getAverageRating,
  getAllGenres,
};
