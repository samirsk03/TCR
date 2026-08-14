import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { getActiveSessions, getSessionById,getMyTransactions, requestBill, generateBill, paySession, getSessionHistory } from "../controllers/sessionController.js";

const router = express.Router();

router.get(
  "/active",
  protect,
  authorize("admin", "staff"),
  getActiveSessions
);

router.get(
  "/my-transactions",
  protect,
  getMyTransactions
);

router.get(
    "/history",
    protect,
    authorize("admin", "staff"),
    getSessionHistory
);

router.get(
  "/:id",
  protect,
  authorize("admin", "staff"),
  getSessionById
);

router.patch(
  "/:id/request-bill",
  protect,
  authorize("admin", "staff"),
  requestBill
);

router.get(
  "/:id/generate-bill",
  protect,
  authorize("admin", "staff"),
  generateBill
);

router.patch(
  "/:id/pay",
  protect,
  authorize("admin", "staff"),
  paySession
);




export default router;