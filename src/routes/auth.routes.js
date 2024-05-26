import express from "express";

import asyncErrorHandler from "../error-handlers/async.error.handler.js";
import authControllerInstance from "../controllers/auth.controller.js";
import isAuthenticated from "../middlewares/jwt.middleware.js";

const router = express.Router();
const { signUp, login, verifyToken } = authControllerInstance;

// POST /auth/signup  - Creates a new user in the database
router.post("/signup", asyncErrorHandler(signUp));

// POST  /auth/login - Verifies email and password and returns a JWT
router.post("/login", asyncErrorHandler(login));

// GET  /auth/verify  -  Used to verify JWT stored on the client
router.get("/verify", isAuthenticated, verifyToken);

export default router;
