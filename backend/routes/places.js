import express from "express";
import {
  getCities,
  getLocationTypes,
  getPlaces
} from "../controllers/placesController.js";

const router = express.Router();

router.get("/cities", getCities);
router.get("/location-types", getLocationTypes);
router.get("/", getPlaces); // 🔥 FIX HERE

export default router;
