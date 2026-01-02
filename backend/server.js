import express from "express";
import dotenv from "dotenv";

import placesRoutes from "./routes/places.js";
import predictRoutes from "./routes/predict.js";
import locationRoutes from "./routes/location.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

/* ===============================
   CORS MIDDLEWARE
================================ */
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

/* ===============================
   BODY PARSERS
================================ */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

/* ===============================
   REQUEST LOGGING MIDDLEWARE
================================ */
app.use((req, res, next) => {
  console.log(`📍 ${req.method} ${req.path}`);
  next();
});

/* ===============================
   HEALTH CHECK
================================ */
app.get("/", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Crowd Prediction Backend Running",
    version: "1.0.0",
    timestamp: new Date().toISOString()
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

/* ===============================
   API ROUTES
================================ */
app.use("/api/places", placesRoutes);
app.use("/api/predict", predictRoutes);
app.use("/api/location", locationRoutes);

/* ===============================
   ERROR HANDLING - 404
================================ */
app.use((req, res) => {
  console.warn(`⚠️ 404 Not Found: ${req.method} ${req.path}`);
  res.status(404).json({
    error: "Route not found",
    path: req.path,
    method: req.method,
    availableRoutes: [
      "GET /",
      "GET /health",
      "GET /api/places/cities",
      "GET /api/places/location-types",
      "GET /api/places",
      "POST /api/predict",
      "POST /api/location/nearby"
    ]
  });
});

/* ===============================
   ERROR HANDLING - GLOBAL
================================ */
app.use((err, req, res, next) => {
  console.error("❌ Server error:", err.message);

  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
    path: req.path,
    method: req.method
  });
});

/* ===============================
   START SERVER
================================ */
app.listen(PORT, () => {
  console.log(`\n🚀 Server is running!`);
  console.log(`📍 Port: ${PORT}`);
  console.log(`🌍 URL: http://localhost:${PORT}`);
  console.log(`✅ API Base: http://localhost:${PORT}/api\n`);

  console.log("Available endpoints:");
  console.log("  GET  /                    - Health check");
  console.log("  GET  /api/places/cities    - Get all cities");
  console.log("  GET  /api/places/location-types - Get location types");
  console.log("  GET  /api/places           - Get places by city & type");
  console.log("  POST /api/predict          - Predict crowd level");
  console.log("  POST /api/location/nearby  - Get nearby places\n");
});

/* ===============================
   HANDLE UNHANDLED REJECTIONS
================================ */
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:", err);
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
  process.exit(1);
});
