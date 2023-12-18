//let { MOVIES, REVIEWS } = require('../data/mock_data');
const c = require("config");

const reviewRepository = require("../repository/review");
const ServiceError = require("../core/serviceError");

const handleDBError = require("./_handleDBError");

const getAll = async (uid) => {
  let data = await reviewRepository.getAll(uid);
  data = data.map((d) => {
    return { ...d.movie };
  });
  console.log(data);
  return { items: data, count: data.length };
};

const getById = async (rid) => {
  const data = await reviewRepository.getById(rid);

  if (!data) {
    throw ServiceError.notFound(`No review with id ${rid} exists`, { rid });
  }

  return { items: data, count: 1 };
};

const add = async (uid, mid, review, rating) => {
  let addedReview;

  try {
    addedReview = await reviewRepository.add(uid, mid, review, rating);
  } catch (error) {
    throw handleDBError(error);
  }
  return addedReview;
};

const deleteById = async (rid) => {
  try {
    console.log("truing to delete a review with id + " + rid);
    const deleted = await reviewRepository.deleteById(rid);
    if (!deleted) {
      throw Error(`No review with id ${id} exists`, { id });
    }
  } catch (error) {
    throw handleDBError(error);
  }
};

const updateReview = async (rid, data, userId) => {
  console.log("wants to update a review");
  const review = await getById(rid);

  console.log(review);
  console.log(userId);
  if (review.items.userId !== userId) {
    throw ServiceError.forbidden("You cannot edit someone elses review!");
  }

  try {
    const updated = await reviewRepository.updateReview(rid, data);

    if (!updated) {
      throw ServiceError.notFound(`No movie with id ${id} exists`, { id });
    }
    return updated;
  } catch (error) {
    throw handleDBError(error);
  }
};
// de rest nog uitwerken

module.exports = {
  getAll,
  getById,
  add,
  deleteById,
  updateReview,
};
