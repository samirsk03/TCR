// models/StoreSettings.js

import mongoose from "mongoose";

const storeSettingsSchema = new mongoose.Schema(
  {
    // Billing

    gstPercentage: {
      type: Number,
      default: 5,
      min: 0,
    },

    rewardPercentage: {
      type: Number,
      default: 20,
      min: 0,
    },

    maxRedeemPercentage: {
      type: Number,
      default: 50,
      min: 0,
    },

    minimumRedeemPoints: {
      type: Number,
      default: 0,
      min: 0,
    },

    rewardValue: {
      type: Number,
      default: 1,
      min: 0,
    },

    // Store

    storeName: {
      type: String,
      default: "The Chocolate Room",
      trim: true,
    },

    phone: {
      type: String,
      default: "",
    },

    email: {
      type: String,
      default: "",
    },

    address: {
      type: String,
      default: "",
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "StoreSettings",
  storeSettingsSchema
);