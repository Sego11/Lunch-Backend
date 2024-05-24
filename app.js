import express from "express";

import dishes from "./routes/dish.routes.js";
import notFound from "./middlewares/not.found.js";
import errorHandler from "./middlewares/error.handler.js";
import { start } from "./server.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
app.use("/api/v1/dishes", dishes);

app.use(notFound);
app.use(errorHandler);

//app entry
start();

export default app;
