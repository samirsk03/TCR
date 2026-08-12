import express from "express";

import {
  register,
  login,
  getMe, adminLogin
} from "../controllers/authController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);

router.post("/admin/login", adminLogin);

router.post("/login", login);

router.get("/me", protect, getMe);

export default router;