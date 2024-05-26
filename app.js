import "dotenv/config.js";

import express from "express";

import indexRoute from "./src/routes/index.routes.js";
import dishesRoutes from "./src/routes/dish.routes.js";
import authRoutes from "./src/routes/auth.routes.js";
import errorHandler from "./src/error-handlers/error.handler.js";
import { start } from "./server.js";
import configureApp from "./src/config/index.js";

const app = express();

//runs most of the middlewares
configureApp(app);

//routes
app.use("/api/v1", indexRoute);
app.use("/api/v1/dishes", dishesRoutes);
app.use("/api/v1/auth", authRoutes);

//global error handler
errorHandler(app);

//app entry
start();

export { app };
