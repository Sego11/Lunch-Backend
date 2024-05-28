import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import User from "../models/User.model.js";
import CustomError from "../utils/custom.error.js";
import sendEmail from "../utils/email.js";

class AuthController {
  static saltRounds = 10;

  async signUp(req, res, next) {
    const { name, email, role, password } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(email)) {
      const error = new CustomError("Please provide a valid Email", 400);
      return next(error);
    }

    const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!passwordRegex.test(password)) {
      const error = new CustomError(
        "Password must have at least 6 characters and contain at least one number, one lowercase, and one uppercase letter.",
        400
      );
      return next(error);
    }

    const foundUser = await User.findOne({ email });

    if (foundUser) {
      const error = new CustomError("User already exists", 400);
      return next(error);
    }

    const salt = bcrypt.genSaltSync(AuthController.saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const createdUser = await User.create({
      name,
      email,
      role,
      password: hashedPassword,
    });

    const { _id } = createdUser;
    const user = { name, email, _id };
    res.status(201).json({
      message: "success",
      data: { user },
    });
  }

  async login(req, res, next) {
    const { email, password } = req.body;

    if (!email || !password) {
      const error = new CustomError("Please provide name and password", 400);
      return next(error);
    }

    const foundUser = await User.findOne({ email });

    if (!foundUser) {
      const error = new CustomError("User not found", 404);
      return next(error);
    }

    const passwordCorrect = bcrypt.compareSync(password, foundUser.password);

    if (passwordCorrect) {
      const { _id, email, name, role } = foundUser;
      const payload = { _id, email, name, role };

      const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
        algorithm: "HS256",
        expiresIn: "6h",
      });

      return res.status(200).send({ message: "success", token: authToken });
    } else {
      const error = new CustomError("incorrect email or password", 401);
      return next(error);
    }
  }

  verifyToken(req, res) {
    return res.status(200).json(req.payload);
  }

  //forgot password
  async forgotPassword(req, res, next) {
    const { email } = req.body;

    const foundUser = await User.findOne({ email });

    if (!foundUser) {
      const error = new CustomError("User not found", 404);
      return next(error);
    }

    //generate reset token here
    const resetToken = crypto.randomBytes(32).toString("hex");

    //store the resetToken to the resetPasswordToken in DB
    foundUser.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    //assign the expiry time of the resetToken
    foundUser.resetPasswordTokenExpires = Date.now() + 600000;

    await foundUser.save({ validateBeforeSave: false });

    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/auth/reset-password/${resetToken}`;

    const message = `We have received a password reset request. 
    Please user the below link to reset your password\n\n${resetUrl}\n\n
    This password link will be only available for 10 minutes`;

    try {
      await sendEmail({
        email: foundUser.email,
        subject: "Password change request received",
        message: message,
      });

      res
        .status(200)
        .json({ status: "success", message: "password link sent to the user" });
    } catch (error) {
      foundUser.resetPasswordToken = undefined;
      foundUser.resetPasswordTokenExpires = undefined;
      foundUser.save({ validateBeforeSave: false });

      return next(
        new CustomError(
          "error sending password reset email. Please try again later",
          500
        )
      );
    }
  }

  //reset password
  async resetPassword(req, res, next) {
    const token = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const foundUser = await User.findOne({
      resetPasswordToken: token,
      resetPasswordTokenExpires: { $gt: Date.now() },
    });

    if (!foundUser) {
      const error = new CustomError("Invalid or Expired token", 400);
      return next(error);
    }

    const salt = bcrypt.genSaltSync(AuthController.saltRounds);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);
    foundUser.password = hashedPassword;
    foundUser.resetPasswordToken = undefined;
    foundUser.resetPasswordTokenExpires = undefined;

    await foundUser.save();

    res
      .status(200)
      .json({ status: "success", message: "password successfully changed" });
  }
}

const authControllerInstance = new AuthController();

export default authControllerInstance;
