// routes/storeSettingsRoutes.js

import express from "express";


import {
  getStoreSettings,
  updateStoreSettings, getPublicStoreSettings
} from "../controllers/storeSettingsController.js";

import {
  protect,
  authorize,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/",
  protect,
  authorize("admin"),
  getStoreSettings
);

router.patch(
  "/",
  protect,
  authorize("admin"),
  updateStoreSettings
);

// routes/storeSettingsRoutes.js

router.get(
  "/configs",
  getPublicStoreSettings
);


export default router;