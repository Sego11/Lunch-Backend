import mongoose from "mongoose";

const DishesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    unique: true,
    trim: true,
  },
});

const Dish = mongoose.model("Dish", DishesSchema);
export default Dish;
