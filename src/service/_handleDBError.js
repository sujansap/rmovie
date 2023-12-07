const ServiceError = require("../core/serviceError");

const handleDBError = (error) => {
  const { code = "", message } = error;

  if (code === "P2025") {
    //console.log("some error is thrown");

    switch (true) {
      case message.includes("Invalid `prisma[table].delete()` invocation"):
        return ServiceError.notFound("Tried to delete row that doesn't exist");
      case message.includes("idx_user_email_unique"):
        return ServiceError.notFound(
          "There is already a user with this email address"
        );
      default:
        return ServiceError.notFound("This items doesn't exist");
    }
  }
  if (code === "P2002") {
    switch (true) {
      case message.includes("reviews_userId_movieId_key"):
        return ServiceError.validationFailed(
          "This user already has review for this movie"
        );
      case message.includes("users_username_key"):
        return ServiceError.validationFailed("This username is taken");
      case message.includes("users_email_key"):
        return ServiceError.validationFailed("The email is already in use");
      default:
        return ServiceError.validationFailed("This item already exists");
    }
  }
  // Return error because we don't know what happened
  return error;
};

module.exports = handleDBError;
