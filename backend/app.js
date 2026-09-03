import express from "express";
import cors from "cors";
import path from "path";

import menuRoutes from "./routes/menuRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import orderRequestRoutes from "./routes/orderRequestRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import offerRoutes from "./routes/offerRoutes.js";
import storeSettingsRoutes from "./routes/storeSettingsRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";
import "./scheduler/birthdayScheduler.js";

const app = express();

app.use(cors());
app.use(express.json());

/* Serve uploaded images */
app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"))
);

/* Routes */

app.use("/api/auth", authRoutes);

app.use("/api/settings", storeSettingsRoutes);

app.use("/api/feedback", feedbackRoutes);

app.use("/api/menus", menuRoutes);

app.use("/api/offers", offerRoutes);

app.use("/api/order-request", orderRequestRoutes);

app.use("/api/session", sessionRoutes);

/* NEW */
app.use("/api/upload", uploadRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Cafe Reward API Running",
  });
});

export default app;