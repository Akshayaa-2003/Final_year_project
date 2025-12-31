require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const predictRoute = require("./routes/predict");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/predict", predictRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
