import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    menuId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Menu",
      required: true,
    },

    itemName: {
      type: String,
      required: true,
    },

    variantName: {
      type: String,
      default: "",
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    price: {
      type: Number,
      required: true,
    },

    rewardPoints: {
      type: Number,
      default: 0,
    },
  },
  { _id: false }
);

const orderRequestSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      default: null,
    },

    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: (items) => items.length > 0,
        message: "At least one item is required",
      },
    },

    status: {
      type: String,
      enum: [
        "pending",
        "accepted",
        "rejected",
        "cancelled",
      ],
      default: "pending",
    },

    acceptedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    acceptedAt: {
      type: Date,
      default: null,
    },

    rejectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    rejectedAt: {
      type: Date,
      default: null,
    },

    rejectionReason: {
      type: String,
      default: "",
    },

    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    cancelledAt: {
      type: Date,
      default: null,
    },

    cancelReason: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "OrderRequest",
  orderRequestSchema
);