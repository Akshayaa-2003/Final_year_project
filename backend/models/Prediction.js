const mongoose = require("mongoose");

const predictionSchema = new mongoose.Schema({
  city: String,
  location: String,
  activity: String,
  crowdLevel: String,
  time: String,
  day: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Prediction", predictionSchema);
