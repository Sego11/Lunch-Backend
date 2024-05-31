import Order from "../models/Order.model.js";
import CustomError from "../utils/custom.error.js";

class OrderController {
  async createOrder(req, res, next) {
    //I can add extra security to check whether the payload id
    //matches the user id
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
    const order = await Order.findById(req.params.id).populate({
      path: "dish",
      select: "name",
    });

    if (!order) {
      return next(new CustomError("order not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: { order },
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
