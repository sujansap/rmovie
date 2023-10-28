const userRepository = require('../repository/user');

const getAll = async () => {
    const data  = await userRepository.getAll();
    return { items: data, count: data.length };
};

const getById = async (id) => {
    const data  = await userRepository.getById(id);
    return data
};

module.exports = {
    getAll,
    getById
}; 