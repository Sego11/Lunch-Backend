import { Router } from "express";

import asyncErrorHandler from "../error-handlers/async.error.handler.js";
import orderControllerInstance from "../controllers/order.controller.js";

const router = Router();

const { createOrder, getAllOrders } = orderControllerInstance;

//POST - api/v1/orders/create-order creates a new Order in the db
router.post("/create-order", asyncErrorHandler(createOrder));

router.get("/get-orders", asyncErrorHandler(getAllOrders));

export default router;
