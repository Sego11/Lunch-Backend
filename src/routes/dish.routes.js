import express from "express";

import asyncErrorHandler from "../error-handlers/async.error.handler.js";
import dishControllerInstance from "../controllers/dish.controller.js";
import isAuthenticated from "../middlewares/jwt.middleware.js";
import restrict from "../middlewares/role.middleware.js";

const router = express.Router();

const { getAllDishes, createDish, getDish, updateDish, deleteDish } =
  dishControllerInstance;

router
  .route("/")
  .get(isAuthenticated, asyncErrorHandler(getAllDishes))
  .post(isAuthenticated, restrict("admin"), asyncErrorHandler(createDish));

router
  .route("/:id")
  .get(isAuthenticated, asyncErrorHandler(getDish))
  .patch(isAuthenticated, restrict("admin"), asyncErrorHandler(updateDish))
  .delete(isAuthenticated, restrict("admin"), asyncErrorHandler(deleteDish));

export default router;
