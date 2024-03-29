const userRepository = require("../repository/user");
const ServiceError = require("../core/serviceError");
const { hashPassword, verifyPassword } = require("../core/password");
const { generateJWT, verifyJWT } = require("../core/jwt");
const { getLogger } = require("../core/logging");

const handleDBError = require("./_handleDBError");

const checkAndParseSession = async (authHeader) => {
  if (!authHeader) {
    throw ServiceError.unauthorized("You need to be signed in");
  }

  if (!authHeader.startsWith("Bearer ")) {
    throw ServiceError.unauthorized("Invalid authentication token");
  }

  const authToken = authHeader.substring(7);
  try {
    const { userType, userId } = await verifyJWT(authToken);

    return {
      userId,
      userType,
      authToken,
    };
  } catch (error) {
    getLogger().error(error.message, { error });
    throw new Error(error.message);
  }
};

const checkRole = (role, roles) => {
  const hasPermission = roles === role;

  if (!hasPermission) {
    throw ServiceError.forbidden(
      "You are not allowed to view this part of the application"
    );
  }
};

const getAll = async () => {
  const data = await userRepository.getAll();
  return { items: data, count: data.length };
};
// ------cors------bodyparser-----validate---endpoint
const getById = async (id) => {
  const data = await userRepository.getById(id);

  if (!data || data.userId !== id) {
    throw ServiceError.notFound(`No movie with id ${id} exists`, { id });
  }

  return data;
};

const addUser = async ({ username, password, email, about }) => {
  try {
    const passwordHash = await hashPassword(password);

    const user = await userRepository.addUser({
      username,
      email,
      about,
      password: passwordHash,
      userTypeId: 1,
    });
    return await userRepository.getById(user.userId);
  } catch (error) {
    throw handleDBError(error);
  }
};

const getReviewForMovieForUser = async (uid, mid) => {
  const data = await userRepository.getReviewForMovieForUser(uid, mid);
  if (!data) {
    return {};
  }
  data.title = data.movie.title;
  data.poster = data.movie.poster;
  data.username = data.user.username;
  delete data.user;
  delete data.movie;

  return data;
};

const makeExposedUser = ({ userId, username, about, email, userTypeId }) => ({
  userId,
  username,
  about,
  email,
  userTypeId,
});

const makeLoginData = async (user) => {
  const token = await generateJWT(user);
  return {
    user: makeExposedUser(user),
    token,
  };
};

const login = async (email, password) => {
  const user = await userRepository.getByEmail(email);

  if (!user) {
    // DO NOT expose we don't know the user
    throw ServiceError.unauthorized(
      "The given email and password do not match"
    );
  }

  const passwordValid = await verifyPassword(password, user.password);

  if (!passwordValid) {
    // DO NOT expose we know the user but an invalid password was given
    throw ServiceError.unauthorized(
      "The given email and password do not match"
    );
  }

  return await makeLoginData(user);
};

const register = async ({ username, email, about, password }) => {
  password = await hashPassword(password);
  let u;
  try {
    u = await userRepository.addUser({
      username,
      email,
      about,
      password,
      userTypeId: 2,
    });
  } catch (error) {
    throw handleDBError(error);
  }
  const user = await userRepository.getById(u.userId);
  return await makeLoginData(user);
};

module.exports = {
  getAll,
  getById,
  getReviewForMovieForUser,
  addUser,
  login,
  register,
  checkAndParseSession,
  checkRole,
};
