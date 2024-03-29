const reviewRepository = require("../repository/review");
const ServiceError = require("../core/serviceError");

const handleDBError = require("./_handleDBError");

const getAll = async (uid) => {
  let data = await reviewRepository.getAll(uid);
  data = data.map((d) => {
    d = { ...d.movie };
    d.reviewId = d.reviews[0].reviewId;
    delete d.reviews;
    return d;
  });

  return { items: data, count: data.length };
};

const getById = async (rid) => {
  const data = await reviewRepository.getById(rid);

  if (!data) {
    throw ServiceError.notFound(`No review with id ${rid} exists`, { rid });
  }

  return data;
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
    const deleted = await reviewRepository.deleteById(rid);
    if (!deleted) {
      throw Error(`No review with id ${id} exists`, { id });
    }
  } catch (error) {
    throw handleDBError(error);
  }
};

const updateReview = async (rid, data, userId) => {
  const review = await getById(rid);

  if (review.userId !== userId) {
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

module.exports = {
  getAll,
  getById,
  add,
  deleteById,
  updateReview,
};
