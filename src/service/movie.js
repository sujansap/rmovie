const movieRepository = require('../repository/movie');
// users/1/movies/    => geeft een movie dat door die user is toegevoegd


// reviews/users/1/movies  => geeft alle reviews dat door een user zijn toegevoegd 
//of

//dit is beter
// users/1/movies/reviews => geeft alle reviews dat door een user zijn toegevoegd

const getAll = async () => {
    const data  = await movieRepository.getAll();
    return { items: data, count: data.length };
};

const getAllReviewsForMovie = async (mid) => {
    const data  = await movieRepository.getAllReviewsForMovie(mid);
    return { items: data, count: data.length };
};

const getById = async (id) => {
    const data = await movieRepository.getById(id);
    return data;
};

const getMovieGeneres = async (mid) => {
    const data = await movieRepository.getMovieGenre(mid);
    //return an array of genres like ['action', 'comedy']
    return data.genreMovies.map(item=>item.genre.genre);
};

const deleteById = async (id) => {
    const deleted = await movieRepository.deleteById(id);
    console.log(deleted);
    if(!deleted){
        throw Error(`No movie with id ${id} exists`, { id });
    }
};

const addMovie = async(title, user,poster,synopsis,genres) =>{
    await movieRepository.addMovie(title, user,poster, synopsis, genres);
}

const addReview = async(uid, mid, review, rating)=>{
    const addedMovie = await movieRepository.addReview(uid, mid, review, rating);
    return addedMovie
 }


const updateMovie = async (id, data)=>{
    return await movieRepository.updateById(id, data);
}
// de rest nog uitwerken

module.exports = {
    getAll,
    getById,
    deleteById,
    addMovie, 
    updateMovie,
    getMovieGeneres,
    getAllReviewsForMovie,
    addReview
}; 