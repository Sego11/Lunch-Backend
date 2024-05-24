import CustomError from "../utils/custom.error.js";
const devErrors = (res, error) => {
  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
    error: error,
  });
};
const prodErrors = (res, error) => {
  if (error.isOperational) {
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  } else {
    res.status(500).json({
      status: "failed",
      message: "something went wrong! Please try again later",
    });
  }
};

const castErrorHandler = (error) => {
  const message = `Invalid value for ${error.path}: ${error.value}`;
  return new CustomError(message, 400);
};

const duplicateKeyErrorHandler = (error) => {
  const name = error.keyValue.name;
  const message = `Dish name ${name} already exists use a different name`;
  return new CustomError(message, 400);
};

const validateErrorHandler = (error) => {
  const errors = Object.values(error.errors).map((e) => e.message);
  const errorMessages = errors.join(". ");
  const message = `Invalid input data: ${errorMessages}`;

  return new CustomError(message, 400);
};

export default function (error, req, res, next) {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";
  if (process.env.NODE_ENV === "development") {
    devErrors(res, error);
  } else if (process.env.NODE_ENV === "production") {
    if (error.name === "CastError") error = castErrorHandler(error);
    if (error.code === 11000) error = duplicateKeyErrorHandler(error);
    if (error.name === "ValidationError") error = validateErrorHandler(error);
    prodErrors(res, error);
  }
}
