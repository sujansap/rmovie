const userRepository = require('../repository/user');

const getAll = async () => {
    const data  = await userRepository.getAll();
    return { items: data, count: data.length };
};

const getById = async (id) => {
    const data  = await userRepository.getById(id);
    return data
};


const getReviewsForUser = async (id) => {
    const data  = await userRepository.getReviewsForUser(id);
    return {items:data, length:data.length}
};

const getReviewForMovieForUser = async (uid, mid) => {
    const data  = await userRepository.getReviewForMovieForUser(uid, mid);
    return data
};

module.exports = {
    getAll,
    getById,
    getReviewsForUser,
    getReviewForMovieForUser
}; 