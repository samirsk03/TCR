import express from "express";

import {
  createOffer,
  getOffers,
  getAllOffers,
  getOfferById,
  updateOffer,
  deleteOffer,
  toggleOffer,
} from "../controllers/offerController.js";

import {
  protect,
  authorize,
} from "../middleware/authMiddleware.js";

const router = express.Router();


// CUSTOMER

router.get("/", getOffers);


// ADMIN

router.get(
  "/admin",
  protect,
  authorize("admin"),
  getAllOffers
);

router.get(
  "/:id",
  protect,
  authorize("admin"),
  getOfferById
);

router.post(
  "/",
  protect,
  authorize("admin"),
  createOffer
);

router.put(
  "/:id",
  protect,
  authorize("admin"),
  updateOffer
);

router.patch(
  "/:id/toggle",
  protect,
  authorize("admin"),
  toggleOffer
);

router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteOffer
);

export default router;