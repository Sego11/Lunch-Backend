import CustomError from "../utils/custom.error.js";

const restrict = (role) => {
  return (req, res, next) => {
    if (!req.payload) {
      return next(new CustomError("Authentication", 401));
    }

    if (req.payload.role !== role) {
      console.log(req.payload.role);

      next(
        new CustomError(
          "You do not have permission to perform that action",
          403
        )
      );
    }
    next();
  };
};

export default restrict;
