import connectDB from "./src/db/connect.js";
import { app } from "./app.js";

const port = process.env.PORT || 10000;

export const start = async () => {
  try {
    process.on("uncaughtException", (error) => {
      console.log(error.name, error.message);
      console.log("uncaught Exception occured! Shutting down.....");
    });

    await connectDB(process.env.MONGO_URL);
    app.listen(port, () => {
      console.log(`app is up and running at ${port}...`);
    });

    process.on("unhandledRejection", (error) => {
      console.log(error.name, error.message);
      console.log("unhandled rejection occured! Shutting down.....");

      server.close(() => {
        process.exit(1);
      });
    });
  } catch (error) {
    console.log(error);
  }
  console.log(process.env.NODE_ENV);
  console.log(process.env.ORIGIN);
};
