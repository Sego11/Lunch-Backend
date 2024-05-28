import express from "express";

import asyncErrorHandler from "../error-handlers/async.error.handler.js";
import dishControllerInstance from "../controllers/dish.controller.js";

const router = express.Router();

const { getAllDishes, createDish, getDish, updateDish, deleteDish } =
  dishControllerInstance;

//TODO: protect the necessary routes
router
  .route("/")
  .get(asyncErrorHandler(getAllDishes))
  .post(asyncErrorHandler(createDish));
router
  .route("/:id")
  .get(asyncErrorHandler(getDish))
  .patch(asyncErrorHandler(updateDish))
  .delete(asyncErrorHandler(deleteDish));

export default router;
