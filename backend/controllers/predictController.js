/* ===============================
   PREDICT CROWD LEVEL
=============================== */
export const predictCrowd = (req, res) => {
  try {
    const { city, locationType, place } = req.body;

    // Validate required fields
    if (!city || typeof city !== "string" || city.trim() === "") {
      return res.status(400).json({
        error: "City is required",
        crowdLevel: null
      });
    }

    if (!locationType || typeof locationType !== "string" || locationType.trim() === "") {
      return res.status(400).json({
        error: "Location type is required",
        crowdLevel: null
      });
    }

    console.log(`🔍 Predicting crowd for: ${city} - ${locationType} - ${place || "General"}`);

    // Get prediction
    const prediction = predictCrowdLevel(locationType, place, city);

    console.log(`✅ Prediction: ${prediction.level} (${prediction.confidence}% confidence)`);

    return res.status(200).json({
      city: city.trim(),
      locationType: locationType.trim(),
      place: place?.trim() || "General Area",
      crowdLevel: prediction.level,
      confidence: prediction.confidence,
      recommendation: prediction.recommendation,
      timeZone: getTimeZone(new Date().getHours()),
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error("❌ Prediction error:", err.message);
    return res.status(500).json({
      error: "Prediction failed",
      crowdLevel: null
    });
  }
};

/* ===============================
   CROWD PREDICTION LOGIC
=============================== */
const predictCrowdLevel = (locationType, place = "", city = "") => {
  const type = locationType.toLowerCase().replace(/\s+/g, "");
  const placeLower = place?.toLowerCase() || "";
  const hour = new Date().getHours();

  // Base crowd levels by location type
  const crowdMap = {
    "malls": { level: "high", confidence: 85, recommendation: "Best to visit 8-11 AM" },
    "restaurants": { level: "medium", confidence: 75, recommendation: "Best to visit 2-4 PM" },
    "parks": { level: "low", confidence: 80, recommendation: "Best to visit 6-8 AM" },
    "cinemas": { level: "high", confidence: 88, recommendation: "Best to visit weekday matinee shows" }
  };

  // Get base prediction (handle singular/plural)
  let prediction = crowdMap[type];
  
  if (!prediction) {
    // Fallback: try to match partial
    if (type.includes("mall")) {
      prediction = crowdMap["malls"];
    } else if (type.includes("restaurant")) {
      prediction = crowdMap["restaurants"];
    } else if (type.includes("park")) {
      prediction = crowdMap["parks"];
    } else if (type.includes("cinema")) {
      prediction = crowdMap["cinemas"];
    } else {
      prediction = {
        level: "medium",
        confidence: 70,
        recommendation: "Visit during off-peak hours (10 AM - 3 PM)"
      };
    }
  }

  // Create a copy to avoid mutation
  prediction = { ...prediction };

  /* ===============================
     ADJUST BY PLACE NAME
  =============================== */
  if (placeLower) {
    // High crowd places
    if (
      placeLower.includes("mall") ||
      placeLower.includes("market") ||
      placeLower.includes("bazaar")
    ) {
      prediction.level = "high";
      prediction.confidence = 88;
    }
    // Low crowd places
    else if (
      placeLower.includes("beach") ||
      placeLower.includes("garden") ||
      placeLower.includes("park")
    ) {
      prediction.level = "low";
      prediction.confidence = 82;
    }
    // Medium crowd places
    else if (
      placeLower.includes("restaurant") ||
      placeLower.includes("hotel") ||
      placeLower.includes("cafe")
    ) {
      prediction.level = "medium";
      prediction.confidence = 78;
    }
  }

  /* ===============================
     ADJUST BY TIME OF DAY
  =============================== */
  // Peak hours: 12 PM - 2 PM
  if (hour >= 12 && hour <= 14) {
    if (prediction.level === "low") {
      // Parks, beaches stay low
    } else {
      prediction.level = "high";
      prediction.confidence = Math.min(prediction.confidence + 5, 95);
    }
  }
  // Off-peak morning: 6 AM - 9 AM
  else if (hour >= 6 && hour <= 9) {
    if (prediction.level === "high") {
      prediction.level = "medium";
    } else if (prediction.level === "medium") {
      prediction.level = "low";
    }
    prediction.confidence = Math.min(prediction.confidence + 3, 90);
  }
  // Evening rush: 5 PM - 7 PM
  else if (hour >= 17 && hour <= 19) {
    if (prediction.level !== "high") {
      prediction.level = "high";
    }
    prediction.confidence = Math.min(prediction.confidence + 5, 92);
  }
  // Late night: 9 PM - 11 PM
  else if (hour >= 21 && hour <= 23) {
    prediction.level = "low";
    prediction.confidence = 75;
  }

  return prediction;
};

/* ===============================
   GET TIME ZONE INFO
=============================== */
const getTimeZone = (hour) => {
  if (hour >= 6 && hour < 12) return "Morning (6 AM - 12 PM)";
  if (hour >= 12 && hour < 17) return "Afternoon (12 PM - 5 PM)";
  if (hour >= 17 && hour < 21) return "Evening (5 PM - 9 PM)";
  return "Night (9 PM - 6 AM)";
};
