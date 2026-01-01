import express from "express";
import { getNearbyPlaces } from "../controllers/locationController.js";

const router = express.Router();

/* 🔥 POST: Nearby places using live location */
router.post("/nearby", getNearbyPlaces);

export default router;
