const genreRepository = require('../repository/genre');

const getAll = async () => {
    const data  = await genreRepository.getAll();
    return { items: data, count: data.length };
};

module.exports = {
    getAll,
}; 