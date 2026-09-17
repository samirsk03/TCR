import express from "express";

import { createOrderRequest, acceptOrder, getPendingOrders, cancelOrder, getCancelledOrders } from "../controllers/orderRequestController.js";

import {
  protect, authorize
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/",
  protect,
  createOrderRequest
);

router.get(
  "/pending",
  protect,
  authorize("staff", "admin"),
  getPendingOrders
);

router.patch(
  "/:id/accept",
  protect,
  authorize("staff", "admin"),
  acceptOrder
);

router.patch("/:id/cancel", protect, cancelOrder);

router.get(
  "/cancelled",
  protect,
  authorize("staff", "admin"),
  getCancelledOrders
);

export default router;