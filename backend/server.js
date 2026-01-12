import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import crowdRoutes from "./routes/crowd.js";

dotenv.config();
connectDB();

const app = express();

/* ---------- IMPORTANT FOR DEPLOYMENT ---------- */
app.set("trust proxy", 1);

/* ---------- MIDDLEWARE ---------- */
app.use(
  cors({
    origin: "*", // allow frontend (Vite / Render)
    credentials: true,
  })
);
app.use(express.json());

/* ---------- HEALTH CHECK ---------- */
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Backend running successfully",
  });
});

/* ---------- ROUTES ---------- */
app.use("/api/auth", authRoutes);
app.use("/api/crowd", crowdRoutes);

/* ---------- 404 HANDLER ---------- */
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

/* ---------- ERROR HANDLER ---------- */
app.use((err, req, res, next) => {
  console.error("Server Error:", err.message);
  res.status(500).json({
    message: "Internal Server Error",
  });
});

/* ---------- START SERVER ---------- */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
