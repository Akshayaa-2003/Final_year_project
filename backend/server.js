import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import placesRoutes from "./routes/places.js";
import predictRoutes from "./routes/predict.js";
import locationRoutes from "./routes/location.js";

dotenv.config();

const app = express();

/* ===============================
   DATABASE (SAFE CONNECT)
================================ */
(async () => {
  try {
    await connectDB();
    console.log("✅ Database connected");
  } catch {
    console.warn("⚠️ Database connection skipped / failed");
  }
})();

/* ===============================
   MIDDLEWARES (🔥 CORS FIX)
================================ */
app.use(cors({
  origin: "*", // allow Vercel frontend
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// 🔥 HANDLE PREFLIGHT REQUESTS
app.options("*", cors());

app.use(express.json());

/* ===============================
   API ROUTES
================================ */
app.use("/api/places", placesRoutes);
app.use("/api/predict", predictRoutes);
app.use("/api/location", locationRoutes);

/* ===============================
   HEALTH CHECK
================================ */
app.get("/", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Crowd Prediction Backend Running"
  });
});

/* ===============================
   404 HANDLER
================================ */
app.use((req, res) => {
  res.status(404).json({
    error: "API route not found",
    path: req.originalUrl
  });
});

/* ===============================
   GLOBAL ERROR HANDLER
================================ */
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.message);
  res.status(500).json({
    error: "Internal server error"
  });
});

/* ===============================
   SERVER
================================ */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
