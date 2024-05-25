import express from "express";

import {
  getAllDishes,
  getDish,
  createDish,
  updateDish,
  deleteDish,
} from "../controllers/dish.controllers.js";

const router = express.Router();

router.route("/").get(getAllDishes).post(createDish);
router.route("/:id").get(getDish).patch(updateDish).delete(deleteDish);

export default router;
