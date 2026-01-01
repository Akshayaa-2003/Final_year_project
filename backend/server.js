import express from "express";
import dotenv from "dotenv";

import placesRoutes from "./routes/places.js";
import predictRoutes from "./routes/predict.js";
import locationRoutes from "./routes/location.js";

dotenv.config();

const app = express();

/* ===============================
   FORCE CORS (ALWAYS RESPOND)
================================ */
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  // Handle preflight immediately
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

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
  res.json({
    status: "ok",
    message: "Crowd Prediction Backend Running"
  });
});

/* ===============================
   SERVER
================================ */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
