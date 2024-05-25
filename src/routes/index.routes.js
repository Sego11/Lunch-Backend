import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.json("All good in here");
});

export default router;
