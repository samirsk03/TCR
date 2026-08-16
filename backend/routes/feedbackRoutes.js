import express from "express";

import {
  createFeedback,
  getAllFeedback,
} from "../controllers/feedbackController.js";

import {
  protect,
  authorize,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Customer submits feedback
router.post(
  "/",
  protect,
  createFeedback
);

// Admin / Staff get all feedback
router.get(
  "/",
  protect,
  authorize("admin", "staff"),
  getAllFeedback
);

export default router;