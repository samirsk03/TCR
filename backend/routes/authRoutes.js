import express from "express";

import {
  register, login, getMe, adminLogin, getAllUsers, createStaffOrAdmin, saveFcmToken, sendTestNotification, resetPassword
} from "../controllers/authController.js";
import { sendBirthdayNotifications } from "../controllers/birthdayController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);

router.post("/admin/create-user",protect,  createStaffOrAdmin);

router.post("/admin/login", adminLogin);

router.post("/login", login);

router.post("/reset-password", resetPassword);

router.get("/me", protect, getMe);

router.post("/save-fcm-token", protect, saveFcmToken);

router.get("/users", protect, getAllUsers);

router.post("/test-notification", protect, sendTestNotification);

router.post("/birthday-notifications", protect, sendBirthdayNotifications);

export default router;