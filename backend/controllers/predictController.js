const Prediction = require("../models/Prediction");
const { getCrowdLevel } = require("../utils/crowdLogic");

exports.predictCrowd = async (req, res) => {
  try {
    const { city, location, activity } = req.body;

    if (!city || !location || !activity) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const crowdLevel = getCrowdLevel(activity);

    const prediction = new Prediction({
      city,
      location,
      activity,
      crowdLevel,
      time: new Date().toLocaleTimeString(),
      day: new Date().toLocaleDateString("en-US", { weekday: "long" }),
    });

    await prediction.save();

    res.json(prediction);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
