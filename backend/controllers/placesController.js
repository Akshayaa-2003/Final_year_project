import { popularPlaces } from "../data/popularPlaces.js";

/* ===============================
   GET CITIES
=============================== */
export const getCities = (req, res) => {
  try {
    console.log("🔍 Fetching cities...");
    
    const cities = Object.keys(popularPlaces);

    if (!cities || cities.length === 0) {
      console.warn("⚠️ No cities found in popularPlaces");
      return res.status(200).json([]);
    }

    console.log(`✅ Cities returned: ${cities.length} cities`);
    console.log("Cities:", cities);
    
    return res.status(200).json(cities);
  } catch (err) {
    console.error("❌ getCities error:", err.message);
    console.error("Stack:", err.stack);
    return res.status(500).json({
      error: "Failed to fetch cities",
      message: err.message
    });
  }
};

/* ===============================
   GET LOCATION TYPES
=============================== */
export const getLocationTypes = (req, res) => {
  try {
    const { city } = req.query;

    console.log(`🔍 Fetching location types for city: ${city}`);

    // Validate city parameter
    if (!city || typeof city !== "string" || city.trim() === "") {
      console.warn("⚠️ City parameter missing or invalid");
      return res.status(200).json([]);
    }

    // Check if city exists in data
    if (!popularPlaces.hasOwnProperty(city)) {
      console.warn(`⚠️ City not found: ${city}`);
      console.log("Available cities:", Object.keys(popularPlaces));
      return res.status(200).json([]);
    }

    // Get location types
    const types = Object.keys(popularPlaces[city]).map((key) =>
      key.replaceAll("_", " ")
    );

    if (!types || types.length === 0) {
      console.warn(`⚠️ No types found for ${city}`);
      return res.status(200).json([]);
    }

    console.log(`✅ Location types for ${city}:`, types);
    return res.status(200).json(types);
  } catch (err) {
    console.error("❌ getLocationTypes error:", err.message);
    console.error("Stack:", err.stack);
    return res.status(500).json({
      error: "Failed to fetch location types",
      message: err.message
    });
  }
};

/* ===============================
   GET PLACES
=============================== */
export const getPlaces = (req, res) => {
  try {
    const { city, locationType } = req.query;

    console.log(`🔍 Fetching places for: ${city} - ${locationType}`);

    // Validate parameters
    if (!city || !locationType) {
      console.warn("⚠️ Missing parameters - City:", city, "Type:", locationType);
      return res.status(200).json([]);
    }

    if (typeof city !== "string" || typeof locationType !== "string") {
      console.warn("⚠️ Invalid parameter types");
      return res.status(200).json([]);
    }

    // Check if city exists
    if (!popularPlaces.hasOwnProperty(city)) {
      console.warn(`⚠️ City not found: ${city}`);
      console.log("Available cities:", Object.keys(popularPlaces));
      return res.status(200).json([]);
    }

    // Convert location type key (spaces to underscores)
    const key = locationType.replaceAll(" ", "_");

    // Check if location type exists for this city
    if (!popularPlaces[city].hasOwnProperty(key)) {
      console.warn(`⚠️ Location type not found: ${key} for city: ${city}`);
      console.log("Available types:", Object.keys(popularPlaces[city]));
      return res.status(200).json([]);
    }

    // Get places array
    const rawPlaces = popularPlaces[city][key];

    // Validate it's an array
    if (!Array.isArray(rawPlaces)) {
      console.warn(`⚠️ Invalid data format for ${city} - ${locationType}`);
      return res.status(200).json([]);
    }

    if (rawPlaces.length === 0) {
      console.warn(`⚠️ No places in ${city} - ${locationType}`);
      return res.status(200).json([]);
    }

    // Extract place names
    const places = rawPlaces
      .filter((p) => p && p.name)
      .map((p) => p.name);

    console.log(`✅ Places for ${city} - ${locationType}:`, places.length, "places");
    console.log("Places:", places);
    
    return res.status(200).json(places);
  } catch (err) {
    console.error("❌ getPlaces error:", err.message);
    console.error("Stack:", err.stack);
    return res.status(500).json({
      error: "Failed to fetch places",
      message: err.message
    });
  }
};
