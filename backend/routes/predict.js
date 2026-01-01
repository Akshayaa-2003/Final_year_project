import express from "express";

const router = express.Router();

router.post("/", (req, res) => {
  res.json({
    city: req.body?.city || "Unknown",
    locationType: req.body?.locationType || "Unknown",
    place: req.body?.place || "Not specified",
    finalCrowd: "Medium",
    activityLevel: "Normal",
    time: new Date().toLocaleString("en-IN")
  });
});

export default router;
