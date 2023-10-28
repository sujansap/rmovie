//let { MOVIES, REVIEWS } = require('../data/mock_data');
const reviewRepository = require('../repository/review');

const getAll = async () => {
    const data  = await reviewRepository.getAll('watchedMovies');
    return { items: data, count: data.length };
};

const getById = async (id) => {
    const data = await reviewRepository.getById(id);
    return data;
};

 

// de rest nog uitwerken

module.exports = {
    getAll,
    getById
}; 