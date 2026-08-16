import express from "express";

import {
  register, login, getMe, adminLogin, getAllUsers
} from "../controllers/authController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);

router.post("/admin/login", adminLogin);

router.post("/login", login);

router.get("/me", protect, getMe);

router.get("/users", protect, getAllUsers);

export default router;