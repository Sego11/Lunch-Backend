import { Schema, model, Types } from "mongoose";

const OrderSchema = new Schema(
  {
    dish: { type: Types.ObjectId, ref: "Dish", required: true },
    user: { type: Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Order = model("Order", OrderSchema);

export default Order;
