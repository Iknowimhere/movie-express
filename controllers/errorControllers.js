const CustomError = require("../utils/CustomError");

const devError = (res, error) => {
  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
    stackTrace: error.stack,
    error: error,
  });
};

const castErrorhandler = (err) => {
  const msg = `Not a valid Id for the field ${err.path}`;
  return new CustomError(msg, 400);
};

const duplicateHandler = (err) => {
  const msg = `movie with this name ${err.keyValue.name} is already present, Please enter a different movie`;
  return new CustomError(msg, 400);
};

const validationErrorHandler = (err) => {
  const errMessages = Object.values(err.errors).map((doc) => doc.message);
  const errMsg = errMessages.join(". ");
  return new CustomError(errMsg, 400);
};
const TokenExpiredErrorHandler = (err) => {
  return new CustomError(`Session has been expired please login`, 401);
};

const jsonTokenErrorHandler=(err)=>{
  return new CustomError(`invalid signature please login in once again`,401);
}
const prodError = (res, error) => {
  if (error.isOperational) {
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  } else {
    res.status(500).json({
      status: "error",
      message: "Something went wrong please try again later",
    });
  }
};

module.exports = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";

  if (process.env.NODE_ENV === "development") {
    devError(res, error);
  }

  if (process.env.NODE_ENV === "production") {
    if (error.name === "CastError") {
      error = castErrorhandler(error);
    }
    if (error.code === 11000) {
      error = duplicateHandler(error);
    }
    if (error.name === "ValidationError") {
      error = validationErrorHandler(error);
    }
    if (error.name === "TokenExpiredError") {
      error = TokenExpiredErrorHandler(error);
    }
    if (error.name === "JsonWebTokenError"){
      error=jsonTokenErrorHandler(error)
    } 
    prodError(res, error);
  }
};
