import Dishes from "../models/dishes.js";

import asyncErrorHandler from "../middlewares/async.error.handler.js";
import CustomError from "../utils/custom.error.js";

//get all dishes
export const getAllDishes = asyncErrorHandler(async (req, res) => {
  const dishes = await Dishes.find();
  res.status(200).send({
    message: "success",
    data: { dishes },
  });
});

//get dish
export const getDish = asyncErrorHandler(async (req, res, next) => {
  const dish = await Dishes.findById(req.params.id);
  if (!dish) {
    const error = new CustomError(
      `dish with id ${req.params.id} does not exist`,
      404
    );
    return next(error);
  }
  res.status(200).send({
    message: "success",
    data: { dish },
  });
});

//create dish
export const createDish = asyncErrorHandler(async (req, res, next) => {
  const dish = await Dishes.create(req.body);
  res.status(201).send({
    message: "success",
    data: { dish },
  });
});

//update dish

//delete dish
