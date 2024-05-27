import Order from "../models/Order.model.js";

class OrderController {
  async createOrder(req, res, next) {
    const order = await Order.create(req.body);

    res.status(201).json({
      status: "success",
      data: { order },
    });
  }
  async getAllOrders(req, res, next) {
    const orders = await Order.find()
      .populate({
        path: "dish",
        select: "-createdAt -updatedAt",
      })
      .populate({
        path: "user",
        select: "_id name",
      })
      .exec();
    res.status(200).json({
      status: "success",
      data: { orders },
    });
  }
}

const orderControllerInstance = new OrderController();

export default orderControllerInstance;
