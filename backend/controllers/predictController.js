import Prediction from "../models/Prediction.js";
import { calculateCrowd } from "../utils/crowdLogic.js";

export const predictCrowd = (req, res) => {
  try {
    const { city, locationType, place } = req.body;

    if (!city || !locationType) {
      return res.status(400).json({
        error: "City and location type required"
      });
    }

    // 🔥 Dummy logic (stable)
    const levels = ["Low", "Medium", "High"];
    const finalCrowd = levels[Math.floor(Math.random() * levels.length)];

    res.json({
      city,
      locationType,
      place,
      finalCrowd,
      activityLevel: "Normal",
      time: new Date().toLocaleString("en-IN")
    });
  } catch (err) {
    res.status(500).json({
      error: "Prediction failed"
    });
  }
};
