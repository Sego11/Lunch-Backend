import mongoose from "mongoose";

const DishSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      unique: true,
      trim: true,
    },

    day: {
      type: String,
      required: true,
      // enum: {
      //   values: ["monday", "tuesday", "wednesday", "thursday", "friday"],
      //   // message: "day not available",
      // },
    },
  },
  { timestamps: true }
);

const Dish = mongoose.model("Dish", DishSchema);
export default Dish;
