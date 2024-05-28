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
      required: [true, "Day is required"],
      enum: ["monday", "tuesday", "wednesday", "thursday", "friday"],
    },
  },
  { timestamps: true }
);

const Dish = mongoose.model("Dish", DishSchema);
export default Dish;
