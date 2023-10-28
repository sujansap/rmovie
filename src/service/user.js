const userRepository = require('../repository/user');


const getAll = async () => {
    const data  = await userRepository.getAll();
    return { items: data, count: data.length };
};


module.exports = {
    getAll
}; 