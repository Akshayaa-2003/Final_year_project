import mongoose from "mongoose";

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.log("⚠️ MONGO_URI not found – skipping MongoDB connection");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    // ❌ DO NOT exit process in production
  }
};

export default connectDB;
