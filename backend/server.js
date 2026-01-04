import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";

// ⚠️ CRITICAL: Load env FIRST
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect DB (AFTER dotenv!)
connectDB().catch(err => {
  console.error("🚨 MONGO CONNECTION FAILED:", err.message);
  process.exit(1); // Crash if DB fails
});

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Health check
app.get("/", (req, res) => {
  res.json({ 
    status: "ok", 
    message: "Crowd Prediction Backend Running 🚀",
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use("/api/auth", authRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.path,
  });
});

// GLOBAL ERROR HANDLER (Fixes silent 500s!)
app.use((err, req, res, next) => {
  console.error("🚨 SERVER ERROR:", err.stack);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err.message : "Something went wrong"
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
