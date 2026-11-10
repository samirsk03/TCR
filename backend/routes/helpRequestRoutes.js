
import express from "express";

import {
  createHelpRequest,
  getPendingHelpRequests,
  getTableHelpRequests,
  updateHelpRequestStatus,
} from "../controllers/helpRequestController.js";

import {
  protect,
  authorize,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Customer
router.post("/", protect, createHelpRequest);

// Admin/staff
router.get(
  "/pending",
  protect,
  authorize("staff", "admin"),
  getPendingHelpRequests
);

router.get(
  "/table/:tableNumber",
  protect,
  authorize("staff", "admin"),
  getTableHelpRequests
);

router.patch(
  "/:id/status",
  protect,
  authorize("staff", "admin"),
  updateHelpRequestStatus
);

export default router;
