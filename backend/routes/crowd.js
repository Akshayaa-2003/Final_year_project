import express from "express";
import { getAreaName } from "../services/getAreaName.js";
import { getNearbyPlaces } from "../services/getNearbyPlaces.js";
import { detectAreaType } from "../utils/detectAreaType.js";
import { getCrowdLevel } from "../utils/getCrowdLevel.js";

const router = express.Router();

/**
 * POST /api/crowd/predict
 * Body: { lat: number, lng: number }
 */
router.post("/predict", async (req, res) => {
  const startTime = Date.now();

  try {
    const { lat, lng } = req.body;

    /* ---------- INPUT VALIDATION ---------- */
    if (
      typeof lat !== "number" ||
      typeof lng !== "number" ||
      isNaN(lat) ||
      isNaN(lng)
    ) {
      return res.status(400).json({
        message: "Valid latitude and longitude are required",
      });
    }

    /* ---------- LOCATION (SAFE) ---------- */
    let location = "Unknown Area";
    try {
      location = await getAreaName(lat, lng);
    } catch (e) {
      console.error("getAreaName failed:", e.message);
    }

    /* ---------- NEARBY PLACES (SAFE) ---------- */
    let placesData = [];
    try {
      placesData = await getNearbyPlaces(lat, lng);
      if (!Array.isArray(placesData)) placesData = [];
    } catch (e) {
      console.error("getNearbyPlaces failed:", e.message);
      placesData = [];
    }

    /* ---------- DERIVED LOGIC ---------- */
    let areaType = detectAreaType(placesData);
    let crowdLevel = getCrowdLevel(placesData.length);

    /* ---------- UX SAFETY OVERRIDES ---------- */
    if (placesData.length <= 1) {
      areaType = "Public Area";
      crowdLevel = "LOW";
    }

    /* ---------- RESPONSE ---------- */
    res.json({
      success: true,
      location,
      areaType,
      places: placesData.map(p => p.name).slice(0, 10),
      crowdLevel,

      // 🧪 Optional debug (remove in production if you want)
      meta: {
        placeCount: placesData.length,
        responseTimeMs: Date.now() - startTime,
      },
    });
  } catch (err) {
    console.error("Crowd predict fatal error:", err);
    res.status(500).json({
      success: false,
      message: "Prediction failed",
    });
  }
});

export default router;
