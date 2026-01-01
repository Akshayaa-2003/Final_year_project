import mongoose from "mongoose";

const predictionSchema = new mongoose.Schema(
  {
    city: String,
    locationType: String,
    place: String,
    activityLevel: String,
    crowdLevel: String,
    score: Number
  },
  { timestamps: true }
);

export default mongoose.model("Prediction", predictionSchema);
