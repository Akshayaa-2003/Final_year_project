import { popularPlaces } from "../data/popularPlaces.js";

/* ===============================
   GET CITIES
=============================== */
export const getCities = (req, res) => {
  try {
    const cities = Object.keys(popularPlaces);
    return res.status(200).json(cities);
  } catch (err) {
    return res.status(500).json([]);
  }
};

/* ===============================
   GET LOCATION TYPES
=============================== */
export const getLocationTypes = (req, res) => {
  const { city } = req.query;

  if (!city || !popularPlaces[city]) {
    return res.status(200).json([]);
  }

  const types = Object.keys(popularPlaces[city]).map(key =>
    key.replaceAll("_", " ")
  );

  return res.status(200).json(types);
};

/* ===============================
   GET PLACES
=============================== */
export const getPlaces = (req, res) => {
  const { city, locationType } = req.query;

  if (!city || !locationType) {
    return res.status(200).json([]);
  }

  const key = locationType.replaceAll(" ", "_");
  const rawPlaces = popularPlaces?.[city]?.[key];

  if (!rawPlaces) {
    return res.status(200).json([]);
  }

  const places = rawPlaces.map(p => p.name);
  return res.status(200).json(places);
};
