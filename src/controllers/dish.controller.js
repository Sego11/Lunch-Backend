import Dish from "../models/Dishes.model.js";
import CustomError from "../utils/custom.error.js";

class DishController {
  //get all dishes
  async getAllDishes(req, res, next) {
    const { day } = req.query;

    const queryObject = {};

    if (day) {
      queryObject["day"] = day;
    }

    console.log(queryObject);
    const dishes = await Dish.find(queryObject).select(
      "-createdAt -updatedAt -__v"
    );
    res.status(200).send({
      message: "success",
      data: { dishes },
    });
  }

  //get dish
  async getDish(req, res, next) {
    const dish = await Dish.findById(req.params.id);
    if (!dish) {
      const error = new CustomError(
        `dish with id ${req.params.id} does not exist`,
        404
      );
      return next(error);
    }
    res.status(200).json({
      message: "success",
      data: { dish },
    });
  }

  //create dish
  async createDish(req, res, next) {
    const { name, day } = req.body;
    const foundDish = await Dish.findOne({ name });

    if (foundDish) {
      return next(new CustomError("Dish already exists", 400));
    }
    const dish = await Dish.create({ name, day });
    res.status(201).json({
      message: "success",
      data: { dish },
    });
  }

  //update dish
  async updateDish(req, res, next) {
    const updatedDish = await Dish.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedDish) {
      const error = new CustomError(`Dish not found`, 404);

      return next(error);
    }
    res.status(200).json({
      status: "success",
      data: {
        dish: updatedDish,
      },
    });
  }

  //delete dish
  async deleteDish(req, res, next) {
    const deletedDish = await Dish.findByIdAndDelete(req.params.id);

    if (!deletedDish) {
      const error = new CustomError(`Dish not found`, 404);
      return next(error);
    }
    res.status(204).json({
      status: "success",
      data: null,
    });
  }
}
const dishControllerInstance = new DishController();
export default dishControllerInstance;
