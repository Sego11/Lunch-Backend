import express from "express";

import {
  getAllDishes,
  getDish,
  createDish,
} from "../controllers/dish.controllers.js";

const router = express.Router();

router.route("/").get(getAllDishes).post(createDish);
router.route("/:id").get(getDish);

export default router;
