const userRepository = require('../repository/user');

const getAll = async () => {
    const data  = await userRepository.getAll();
    return { items: data, count: data.length };
};
// ------cors------bodyparser-----validate---endpoint
const getById = async (id) => {
    const data  = await userRepository.getById(id);
    return data
};


const getReviewsForUser = async (id) => {
    const data  = await userRepository.getReviewsForUser(id);
    return {items:data, count:data.length}
};

const getReviewForMovieForUser = async (uid, mid) => {
    const data  = await userRepository.getReviewForMovieForUser(uid, mid);
    if(!data){
        console.log("something went wrong.");
        return {items:{}, count:0}
    }
    data.title = data.movie.title
    data.poster = data.movie.poster
    
    console.log("wtf is this: " + data.title);
    //wat als er de user nog geen review heeft gemaakt voor een movie
    return { items:data, count: 1 }
};


const updateMovieReviewForUser = async(uid, mid, data)=>{
   return await userRepository.updateMovieReviewForUser(uid, mid, data);
}
module.exports = {
    getAll,
    getById,
    getReviewsForUser,
    getReviewForMovieForUser,
    updateMovieReviewForUser
}; 