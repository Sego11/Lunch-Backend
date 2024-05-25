import Dish from "../models/dishes.js";
import CustomError from "../utils/custom.error.js";

class DishController {
  //get all dishes
  async getAllDishes(req, res) {
    const dishes = await Dish.find();
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
    res.status(200).send({
      message: "success",
      data: { dish },
    });
  }

  //create dish
  async createDish(req, res, next) {
    const dish = await Dish.create(req.body);
    res.status(201).send({
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
      const error = new CustomError(
        `dish with id ${req.params.id} does not exist`,
        404
      );
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
      const error = new CustomError(
        `movie with id: ${req.params.id} cannot be found`,
        404
      );
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
