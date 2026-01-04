import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";

dotenv.config();
connectDB();

const app = express();

/* ---------- MIDDLEWARE ---------- */
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());

/* ---------- HEALTH CHECK ---------- */
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Backend running successfully 🚀",
  });
});

/* ---------- ROUTES ---------- */
app.use("/api/auth", authRoutes);

/* ---------- ERROR HANDLER ---------- */
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

/* ---------- START SERVER ---------- */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
