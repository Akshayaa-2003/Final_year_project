import express from "express";
import { predictCrowd } from "../controllers/predictController.js";

const router = express.Router();

// 🔥 MUST BE ROOT POST
router.post("/", predictCrowd);

export default router;
