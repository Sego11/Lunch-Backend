import "dotenv/config.js";

import express from "express";

import indexRoute from "./src/routes/index.routes.js";
import dishesRoutes from "./src/routes/dish.routes.js";
import authRoutes from "./src/routes/auth.routes.js";
import orderRoutes from "./src/routes/order.routes.js";
import errorHandler from "./src/error-handlers/error.handler.js";
import { start } from "./server.js";
import configureApp from "./src/config/index.js";

const app = express();

//runs most of the middlewares
configureApp(app);

//routes
app.use(indexRoute);
app.use("/dishes", dishesRoutes);
app.use("/auth", authRoutes);
app.use("/orders", orderRoutes);

//global error handler
errorHandler(app);

//app entry
start();

export { app };
