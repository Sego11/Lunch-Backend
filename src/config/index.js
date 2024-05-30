import express from "express";

import logger from "morgan";

import cookieParser from "cookie-parser";

import cors from "cors";

// const FRONTEND_URL = process.env.ORIGIN || "http://localhost:4200";

const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};

export default function (app) {
  app.set("trust proxy", 1);

  app.use(cors(corsOptions));

  app.use(logger("dev"));

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
}
