import Order from "../models/Order.model.js";
import CustomError from "../utils/custom.error.js";

class OrderController {
  async createOrder(req, res, next) {
    const { dish, user } = req.body;
    const foundOrder = await Order.findOne({ user });

    if (foundOrder) {
      const error = new CustomError("Order has already been made", 400);
      return next(error);
    }

    const order = await Order.create({ dish, user });

    res.status(201).json({
      status: "success",
      data: { order },
    });
  }

  async getAllOrders(req, res, next) {
    const orders = await Order.find()
      .select("-createdAt -updatedAt")
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

  async getOrder(req, res, next) {
    const { user } = req.body;

    const foundOrder = await Order.findOne({ user });

    if (!foundOrder) {
      return next(new CustomError("No order found", 404));
    }

    const id = foundOrder._id.toString();

    const order = await Order.findById(id)
      .populate({ path: "dish", select: "name" })
      .populate({ path: "user", select: "name" });

    res.status(200).json({
      status: "success",
      data: { order },
    });
  }

  async getUserOrder(req, res, next) {
    const { user } = req.query;
    const queryObject = { user: user };

    console.log(queryObject);

    const userOrder = await Order.findOne(queryObject)
      .select("-createdAt -updatedAt")
      .populate({ path: "dish", select: "name" })
      .populate({ path: "user", select: "name" });

    if (!userOrder) {
      return next(new CustomError("No order found", 404));
    }
    console.log(userOrder);

    res.status(200).json({
      status: "success",
      data: { userOrder },
    });
  }

  async deleteOrder(req, res, next) {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(new CustomError("order not found", 404));
    }

    if (
      order.user.toString() !== req.payload._id &&
      req.payload.role !== "admin"
    ) {
      return next(
        new CustomError("You don't have permission to this order", 403)
      );
    } else {
      await Order.deleteOne({ _id: req.params.id });
    }
    res.status(204).json({ status: "success", data: null });
  }

  async deleteAllOrders(req, res, next) {
    await Order.deleteMany();
    res.status(204).json({ status: "success", data: null });
  }
}

const orderControllerInstance = new OrderController();

export default orderControllerInstance;
