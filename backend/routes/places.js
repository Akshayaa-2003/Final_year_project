import express from "express";
import {
  getCities,
  getLocationTypes,
  getPlaces
} from "../controllers/placesController.js";

const router = express.Router();

router.get("/cities", getCities);          // ✅ THIS FIXES /cities
router.get("/location-types", getLocationTypes);
router.get("/", getPlaces);

export default router;
