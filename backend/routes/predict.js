import express from "express";

const router = express.Router();

router.post("/", (req, res) => {
  try {
    const { city, locationType, place } = req.body || {};

    res.json({
      city: city || "Unknown",
      locationType: locationType || "Unknown",
      place: place || "Not specified",
      finalCrowd: "Medium",
      activityLevel: "Normal",
      time: new Date().toLocaleString("en-IN")
    });
  } catch (err) {
    res.status(500).json({
      error: "Prediction failed"
    });
  }
});

export default router;
