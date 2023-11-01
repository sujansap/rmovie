const movieRepository = require('../repository/movie');


const getAll = async () => {
    const data  = await movieRepository.getAll();
    return { items: data, count: data.length };
};

const getById = async (id) => {
    const data = await movieRepository.getById(id);
    return data;
};

const deleteById = async (id) => {
    const deleted = await movieRepository.deleteById(id);
    if(!deleted){
        throw Error(`No movie with id ${id} exists`, { id });
    }
};

const addMovie = async(title, user,poster,synopsis) =>{
    await movieRepository.add(title, user,poster, synopsis);
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
    updateMovie
}; 