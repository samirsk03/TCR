import express from "express";

import { createOrderRequest ,acceptOrder , getPendingOrders} from "../controllers/orderRequestController.js";

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

export default router;