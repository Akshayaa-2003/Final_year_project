import { popularPlaces } from "../data/popularPlaces.js";

/* ===============================
   GET CITIES
=============================== */
export const getCities = (req, res) => {
  res.json(Object.keys(popularPlaces));
};

/* ===============================
   GET LOCATION TYPES (FORMAT FIX)
=============================== */
export const getLocationTypes = (req, res) => {
  const { city } = req.query;

  if (!city || !popularPlaces[city]) {
    return res.json([]);
  }

  // 🔥 Bus_Stand → Bus Stand
  const types = Object.keys(popularPlaces[city]).map(key =>
    key.replaceAll("_", " ")
  );

  res.json(types);
};

/* ===============================
   GET PLACES (FINAL FIX)
=============================== */
export const getPlaces = (req, res) => {
  const { city, locationType } = req.query; // ✅ FIX

  console.log("CITY:", city);
  console.log("TYPE:", locationType);

  if (!city || !locationType) {
    return res.json([]);
  }

  // 🔥 Bus Stand → Bus_Stand
  const key = locationType.replaceAll(" ", "_");
  console.log("KEY:", key);

  const rawPlaces = popularPlaces?.[city]?.[key];
  console.log("RAW:", rawPlaces);

  if (!rawPlaces) return res.json([]);

  // send only names
  const places = rawPlaces.map(p => p.name);

  res.json(places);
};
