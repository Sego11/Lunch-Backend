import { Router } from "express";

import asyncErrorHandler from "../error-handlers/async.error.handler.js";
import orderControllerInstance from "../controllers/order.controller.js";
import restrict from "../middlewares/role.middleware.js";
import isAuthenticated from "../middlewares/jwt.middleware.js";

const router = Router();

const { createOrder, getAllOrders, getOrder, deleteOrder, deleteAllOrders } =
  orderControllerInstance;

//POST - api/v1/orders/create-order creates a new Order in the db
router.post("/create-order", isAuthenticated, asyncErrorHandler(createOrder));

//GET - api/v1/orders/get-all-orders returns all the orders- admins only can access
router.get(
  "/get-all-orders",
  isAuthenticated,
  restrict("admin"),
  asyncErrorHandler(getAllOrders)
);

//GET -api/v1/orders/get-order/:id returns a particular order
router.get("/get-order/:id", isAuthenticated, asyncErrorHandler(getOrder));

//GET -api/v1/orders/get-order/:id deletes a particular order
router.delete(
  "/delete-order/:id",
  isAuthenticated,
  asyncErrorHandler(deleteOrder)
);

router.delete("/delete-all-orders/", asyncErrorHandler(deleteAllOrders));

export default router;
