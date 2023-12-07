const movieRepository = require("../repository/movie");

const ServiceError = require("../core/serviceError");
const handleDBError = require("./_handleDBError");

const getAll = async () => {
  const data = await movieRepository.getAll();
  return { items: data, count: data.length };
};

const getAllReviewsForMovie = async (mid) => {
  let data = await movieRepository.getAllReviewsForMovie(mid);

  data = data.map((d) => {
    d.movie = d.movie.title;
    d.user = d.user.username;

    return d;
  });
  if (!data || data.movieId !== mid) {
    throw ServiceError.notFound(`No reviews for movie with id ${mid} exists`, {
      mid,
    });
  }

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

const getMovieGeneres = async (mid) => {
  const data = await movieRepository.getMovieGenre(mid);

  if (!data || data.movieId !== mid) {
    throw ServiceError.notFound(`No genres, no movie with id ${mid} exists`, {
      mid,
    });
  }

  return data.genreMovies.map((item) => item.genre.genre);
};

const deleteById = async (id) => {
  try {
    const deleted = await movieRepository.deleteById(id);

    if (!deleted) {
      throw Error(`No movie with id ${id} exists`, { id });
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
const addReview = async(uid, mid, review, rating)=>{
    const addedMovie = await movieRepository.addReview(uid, mid, review, rating);
    return addedMovie
}
*/
/*
const updateMovie = async (id, data)=>{
    return await movieRepository.updateById(id, data);
}
*/
// de rest nog uitwerken

const getReviewForMovie = async (uid, mid) => {
  const data = await movieRepository.getReviewForMovie(uid, mid);
  if (!data) {
    console.log("something went wrong.");
    return { items: {}, count: 0 };
  }

  console.log("------test-----");
  console.log(data);
  data.title = data.movie.title;
  data.poster = data.movie.poster;
  data.username = data.user.username;
  delete data.user;
  delete data.movie;

  //wat als er de user nog geen review heeft gemaakt voor een movie
  return { items: data, count: 1 };
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
};
