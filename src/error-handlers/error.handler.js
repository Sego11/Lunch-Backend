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

const jwtErrorHandler = (error) => {
  return new CustomError("Invalid token. Please login again!", 401);
};
const tokenExpiredHandler = (error) => {
  return new CustomError("JWT has expired. Please login again!", 401);
};
export default (app) => {
  app.use((req, res, next) => {
    console.log(`Request recieved: ${req.method} ${req.url}`);
    next();
  });

  //this middleware runs if the route does not exist
  app.use((req, res) => {
    res.status(404).send("Route does not exist");
  });

  //this middleware runs if the next function is used (globalErrorHandler)
  app.use((error, req, res, next) => {
    error.statusCode = error.statusCode || 500;
    error.status = error.status || "error";
    if (process.env.NODE_ENV === "development") {
      devErrors(res, error);
    } else if (process.env.NODE_ENV === "production") {
      if (error.name === "CastError") error = castErrorHandler(error);
      if (error.code === 11000) error = duplicateKeyErrorHandler(error);
      if (error.name === "ValidationError") error = validateErrorHandler(error);
      if (error.name === "TokenExpiredError")
        error = tokenExpiredHandler(error);
      if (error.name === "JsonWebTokenError") error = jwtErrorHandler(error);
      prodErrors(res, error);
    }
  });
};
