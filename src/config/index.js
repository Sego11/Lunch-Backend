import express from "express";

import logger from "morgan";

import cookieParser from "cookie-parser";

export const configureApp = (app) => {
  app.set("trust proxy", 1);

  app.use(logger("dev"));

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
};
