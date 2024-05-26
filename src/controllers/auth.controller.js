import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/User.model.js";
import CustomError from "../utils/custom.error.js";

class AuthController {
  static saltRounds = 10;

  async signUp(req, res, next) {
    const { email, password } = req.body;

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

    const createdUser = await User.create({ email, password: hashedPassword });

    const { _id } = createdUser;
    const user = { email, _id };
    res.status(201).send({
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
      const error = new CustomError("User not found", 401);
      return next(error);
    }

    const passwordCorrect = bcrypt.compareSync(password, foundUser.password);

    if (passwordCorrect) {
      const { _id, email } = foundUser;
      const payload = { _id, email };

      const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
        algorithm: "HS256",
        expiresIn: "6h",
      });

      return res.status(200).send({ message: "success", token: authToken });
    } else {
      const error = new CustomError("Unable to authenticate user", 401);
      return next(error);
    }
  }

  verifyToken(req, res) {
    return res.status(200).send(req.payload);
  }
}

const authControllerInstance = new AuthController();

export default authControllerInstance;
