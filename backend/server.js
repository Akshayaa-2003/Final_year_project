import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
// Import the ML Library
import { RandomForestClassifier } from "ml-random-forest";

import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import crowdRoutes from "./routes/crowd.js";

dotenv.config();

/* ---------- CONNECT DB SAFELY ---------- */
connectDB().catch((err) => {
  console.error("DB Connection Failed:", err.message);
  // process.exit(1); // Don't crash if Mongo fails, we need the ML part running
});

const app = express();

/* ---------- CONSTANTS & MAPPINGS ---------- */
const CITIES = [
  "Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli", 
  "Thoothukudi", "Thanjavur", "Dindigul", "Erode", "Vellore", "Ranipet", 
  "Tirupattur", "Krishnagiri", "Dharmapuri", "Namakkal", "Karur", "Ariyalur", 
  "Perambalur", "Cuddalore", "Villupuram", "Kallakurichi", "Mayiladuthurai", 
  "Nagapattinam", "Tiruvarur", "Ramanathapuram", "Sivagangai", "Pudukkottai", 
  "Virudhunagar", "Theni", "Tiruppur", "Kancheepuram", "Chengalpattu", 
  "Tiruvallur", "Nilgiris", "Kanyakumari", "Tenkasi"
];

const MODES = ["Bus", "Train", "Metro"];

// Helper to encode categorical data
const getCityCode = (city) => {
  const idx = CITIES.indexOf(city);
  return idx === -1 ? 0 : idx;
};
const getModeCode = (mode) => {
  const idx = MODES.indexOf(mode);
  return idx === -1 ? 0 : idx;
};

/* ---------- RANDOM FOREST ML MODEL SETUP ---------- */
const rfOptions = {
  seed: 42,
  nEstimators: 20, // Reduced for faster startup
  treeOptions: {
    maxDepth: 10,
  },
};

const classifier = new RandomForestClassifier(rfOptions);

/**
 * GENERATE REALISTIC SYNTHETIC TRAINING DATA
 * We simulate 500 data points covering various scenarios.
 * 
 * Features:
 * 0: City Code (0-37)
 * 1: Mode Code (0-2)
 * 2: Hour (0-23)
 * 3: DayOfWeek (0-6)
 * 4: Temperature (C)
 * 5: IsRain (0 or 1)
 * 6: SocialBuzzScore (1.0 - 5.0)
 * 7: TravelTimeMin (TomTom proxy)
 * 
 * Label: 0 (Low), 1 (Medium), 2 (High)
 */
const generateTrainingData = () => {
  const features = [];
  const labels = [];

  for (let i = 0; i < 500; i++) {
    // Random Inputs
    const cityIdx = Math.floor(Math.random() * CITIES.length);
    const modeIdx = Math.floor(Math.random() * MODES.length);
    const hour = Math.floor(Math.random() * 24);
    const day = Math.floor(Math.random() * 7); // 0=Sun, 6=Sat
    const temp = 20 + Math.random() * 20; // 20-40C
    const isRain = Math.random() > 0.8 ? 1 : 0; // 20% chance rain
    const socialBuzz = 1 + Math.random() * 4; // 1.0 to 5.0
    const travelTime = 10 + Math.random() * 80; // 10 to 90 mins

    // LOGIC TO DETERMINE CROWD (Ground Truth Simulation)
    let score = 0;

    // 1. Base City Population Factor
    const cityName = CITIES[cityIdx];
    if (["Chennai", "Coimbatore", "Madurai"].includes(cityName)) score += 2.0;
    else if (["Salem", "Tiruchirappalli", "Tiruppur"].includes(cityName)) score += 1.5;
    else score += 1.0;

    // 2. Mode Factor
    if (MODES[modeIdx] === "Bus") score += 0.5;
    if (MODES[modeIdx] === "Train") score += 0.7; // Trains often crowded

    // 3. Time Factor (Peak Hours)
    const isWeekday = day >= 1 && day <= 5;
    if (isWeekday) {
      if ((hour >= 8 && hour <= 10) || (hour >= 17 && hour <= 20)) score += 2.5; // Rush hour
      if (hour >= 11 && hour <= 16) score += 1.0; // Mid-day
    } else {
      // Weekend
      if (hour >= 10 && hour <= 21) score += 1.5; // General outing time
    }

    // 4. Weather Factor
    if (isRain) {
      if (MODES[modeIdx] === "Bus") score += 1.5; // Buses crowded in rain
      else if (MODES[modeIdx] === "Metro") score += 0.5;
      score -= 0.5; // General movement slows/reduces? Actually usually transit gets packed.
    }
    if (temp > 35 && MODES[modeIdx] === "Metro") score += 0.5; // AC preference

    // 5. Social & Traffic
    if (socialBuzz > 3.5) score += 1.0; // High event activity
    if (travelTime > 50) score += 0.8; // Traffic implies congestion

    // Determine Label
    // 0-3: Low, 3-5: Medium, >5: High
    // Add some random noise
    score += (Math.random() - 0.5); 

    let label = 0;
    if (score > 5.5) label = 2; // High
    else if (score > 3.5) label = 1; // Medium
    else label = 0; // Low

    features.push([cityIdx, modeIdx, hour, day, temp, isRain, socialBuzz, travelTime]);
    labels.push(label);
  }

  return { features, labels };
};

// Train on startup
console.log("🌲 Training Random Forest Model...");
const { features, labels } = generateTrainingData();
classifier.train(features, labels);
console.log("✅ Model Trained with 500 synthetic records.");

/* ---------- TRUST PROXY ---------- */
app.set("trust proxy", 1);

/* ---------- MIDDLEWARE ---------- */
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));

/* ---------- SERVE STATIC FILES ---------- */
app.use(express.static(path.join(process.cwd(), "public")));

/* ---------- HEALTH CHECK ---------- */
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend running successfully",
    uptime: process.uptime(),
  });
});

/* ---------- ML PREDICTION ENDPOINT ---------- */
app.post("/api/predict-crowd", (req, res) => {
  try {
    const { 
      city, 
      mode, 
      hour, 
      dayOfWeek, 
      temp, 
      isRain, 
      socialScore, 
      travelTime 
    } = req.body;

    // Validation
    if (!city || !mode || hour === undefined) {
      return res.status(400).json({ 
        success: false, 
        message: "Missing required fields (city, mode, hour)." 
      });
    }

    // Encode Inputs
    const inputVector = [
      getCityCode(city),
      getModeCode(mode),
      Number(hour),
      Number(dayOfWeek ?? new Date().getDay()),
      Number(temp ?? 30),
      Number(isRain ?? 0),
      Number(socialScore ?? 1.0),
      Number(travelTime ?? 20)
    ];

    // Predict
    const predictionIndex = classifier.predict([inputVector])[0];
    const labels = ["Low", "Medium", "High"];

    // Also return a confidence/score proxy if possible, or just the label
    // For RF, we just get the class.
    
    // Let's also predict for +1 hour and +2 hours for the "Forecast" feature
    const inputPlus1 = [...inputVector]; inputPlus1[2] = (inputPlus1[2] + 1) % 24;
    const inputPlus2 = [...inputVector]; inputPlus2[2] = (inputPlus2[2] + 2) % 24;

    const pred1 = classifier.predict([inputPlus1])[0];
    const pred2 = classifier.predict([inputPlus2])[0];

    res.status(200).json({
      success: true,
      data: {
        now: labels[predictionIndex],
        after1: labels[pred1],
        after2: labels[pred2],
        advice: predictionIndex === 2 
          ? `Heavy ${mode} crowd expected. Plan ahead.` 
          : predictionIndex === 1 
            ? `Moderate ${mode} crowd. Reasonable travel.` 
            : `Low ${mode} crowd. Good time to travel.`
      }
    });

  } catch (error) {
    console.error("Prediction Error:", error);
    res.status(500).json({ success: false, message: "ML Engine Error" });
  }
});

/* ---------- ROUTES ---------- */
app.use("/api/auth", authRoutes);
app.use("/api/crowd", crowdRoutes);

/* ---------- 404 HANDLER ---------- */
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

/* ---------- GLOBAL ERROR HANDLER ---------- */
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

/* ---------- START SERVER ---------- */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
