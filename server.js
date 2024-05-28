import connectDB from "./src/db/connect.js";
import { app } from "./app.js";

const port = process.env.PORT || 5000;

export const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () => {
      console.log(`app is up and running at ${port}...`);
    });
  } catch (error) {
    console.log(error);
  }
  console.log(process.env.NODE_ENV);
};
