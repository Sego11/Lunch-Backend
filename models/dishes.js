import mongoose from "mongoose";

const DishesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    unique: true,
  },
});

const Dishes = mongoose.model("Dishes", DishesSchema);
export default Dishes;
