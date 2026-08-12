import mongoose from "mongoose";

const offerSchema = new mongoose.Schema(
  {
    badge: {
      type: String,
      default: "",
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    terms: {
      type: String,
      default: "",
    },

    icon: {
      type: String,
      default: "",
    },

    backgroundColor: {
      type: String,
      default: "#8B4513",
    },

    textColor: {
      type: String,
      default: "#FFFFFF",
    },

    startDate: Date,

    endDate: Date,

    displayOrder: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Offer", offerSchema);