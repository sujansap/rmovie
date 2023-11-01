//let { MOVIES, REVIEWS } = require('../data/mock_data');
const c = require('config');
const reviewRepository = require('../repository/review');

const getAll = async (uid) => {
    const data  = await reviewRepository.getAll(uid);
    return { items: data, count: data.length };
};

const getById = async (uid, mid) => {
    const data = await reviewRepository.getById(uid, mid);
    return data;
};

 const add = async(uid, mid, review, rating)=>{
    const addedMovie = await reviewRepository.add(uid, mid, review, rating);
    return addedMovie
 }


const deleteById = async(uid, mid)=>{
    return await reviewRepository.deleteById(uid, mid)
}

// de rest nog uitwerken

module.exports = {
    getAll,
    getById,
    add,
    deleteById
}; 