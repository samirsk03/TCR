import express from "express";

import {
  createMenu,
  getMenus,
  getMenuById,
  updateMenu,
  deleteMenu,
  getMenuByCategory,
  getAvailableMenus,
  searchMenus,
} from "../controllers/menuController.js";

const router = express.Router();

router.get("/", getMenus);

router.get("/search", searchMenus);

router.get("/available", getAvailableMenus);

router.get("/category/:category", getMenuByCategory);

router.get("/:id", getMenuById);

router.post("/", createMenu);

router.put("/:id", updateMenu);

router.delete("/:id", deleteMenu);

export default router;