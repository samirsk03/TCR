
import express from "express";

import {
  createHelpRequest,
  getPendingHelpRequests,
  resolveHelpRequest,
} from "../controllers/helpRequestController.js";

import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Customer: send a help request
router.post("/", protect, createHelpRequest);

// Staff/Admin: get all pending help requests
router.get(
  "/pending",
  protect,
  authorize("staff", "admin"),
  getPendingHelpRequests
);

// Staff/Admin: mark a help request as resolved
router.patch(
  "/:id/resolve",
  protect,
  authorize("staff", "admin"),
  resolveHelpRequest
);

export default router;
