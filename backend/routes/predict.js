import express from "express";
import { predictCrowd } from "../controllers/predictController.js";
import authMiddleware from "../middleware/authMiddleware.js"; // ✅ ADD

const router = express.Router();

// 🔐 PROTECTED ROUTE
router.post("/", authMiddleware, predictCrowd);

export default router;
