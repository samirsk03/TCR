  import mongoose from "mongoose";

  const sessionSchema = new mongoose.Schema(
  {
  customerId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true,
  },

  acceptedOrders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OrderRequest",
    },
  ],

  items: [
    {
      menuId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Menu",
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
        default: 1,
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
  ],

  subtotal: {
    type: Number,
    default: 0,
  },

  totalRewardPoints: {
    type: Number,
    default: 0,
  },

  gstPercentage: {
    type: Number,
    default: 5,
  },

  gst: {
    type: Number,
    default: 0,
  },

  discount: {
    type: Number,
    default: 0,
  },

  redeemedPoints: {
      type: Number,
      default: 0,
  },

  rewardDiscount: {
      type: Number,
      default: 0,
  },

  earnedPoints: {
      type: Number,
      default: 0,
  },

  manualDiscount: {
      type: Number,
      default: 0,
  },

  discountReason: {
      type: String,
      default: "",
  },

  totalAmount: {
    type: Number,
    default: 0,
  },

  openedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },

  closedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },

  status: {
    type: String,
    enum: [
      "active",
      "bill_requested",
      "paid",
      "cancelled",
    ],
    default: "active",
  },

  paidAt: {
    type: Date,
    default: null,
  },

  paymentMethod: {
    type: String,
    enum: ["cash", "upi", "card"],
    default: null,
  },

  },
  {
  timestamps: true,
  }
  );

  export default mongoose.model("Session", sessionSchema);