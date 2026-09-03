import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fcmToken: {
      type: String,
      default: null,
    },
    dateOfBirth: {
      type: Date,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["customer", "staff", "admin"],
      default: "customer",
    },

    employeeId: {
      type: String,
      default: null,
    },

    rewardPoints: {
      type: Number,
      default: 0,
      min: 0,
    },

    visitCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);