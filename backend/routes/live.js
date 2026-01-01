import express from "express";
import { getLiveNearby } from "../controllers/liveController.js";

const router = express.Router();
router.post("/nearby", getLiveNearby);

export default router;
