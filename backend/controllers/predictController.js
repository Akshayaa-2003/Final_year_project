import Prediction from "../models/Prediction.js";
import { calculateCrowd } from "../utils/crowdLogic.js";

export const predictCrowd = async (req, res) => {
  const { city, locationType, place, activityLevel } = req.body;

  const result = calculateCrowd({
    locationType,
    place,
    activityLevel
  });

  const prediction = await Prediction.create({
    city,
    locationType,
    place,
    activityLevel,
    crowdLevel: result.crowdLevel,
    score: result.score
  });

  res.json({
    ...prediction.toObject(),
    time: result.time
  });
};
