import fetch from "node-fetch";
import { getAreaName } from "../config/geocode.js";
import { predictCrowd } from "../utils/crowdLogic.js";

/**
 * POST /api/crowd/predict
 * Body: { lat, lng }
 */
export const predictCrowdController = async (req, res) => {
  try {
    /* ---------- VALIDATION ---------- */
    let { lat, lng } = req.body;

    lat = Number(lat);
    lng = Number(lng);

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return res.status(400).json({
        message: "Valid latitude and longitude are required",
      });
    }

    /* ---------- AREA NAME ---------- */
    let area = "Unknown Area";
    try {
      area = await getAreaName(lat, lng);
    } catch (e) {
      console.error("getAreaName failed:", e.message);
    }

    /* ---------- OVERPASS QUERY ---------- */
    const radius = 1500;

    const query = `
      [out:json][timeout:25];
      (
        node["amenity"="hospital"](around:${radius},${lat},${lng});
        node["amenity"="bus_station"](around:${radius},${lat},${lng});
        node["amenity"~"school|college"](around:${radius},${lat},${lng});
        node["shop"](around:${radius},${lat},${lng});
      );
      out tags 20;
    `;

    let elements = [];

    try {
      const response = await fetch(
        "https://overpass-api.de/api/interpreter",
        {
          method: "POST",
          headers: { "Content-Type": "text/plain" },
          body: query,
        }
      );

      if (!response.ok) {
        console.error("Overpass error:", response.status);
      } else {
        const data = await response.json();
        elements = Array.isArray(data.elements) ? data.elements : [];
      }
    } catch (e) {
      console.error("Overpass fetch failed:", e.message);
    }

    /* ---------- ANALYZE PLACES ---------- */
    const placeSet = new Set();

    let hospital = 0;
    let transport = 0;
    let education = 0;
    let commercial = 0;

    for (const el of elements) {
      const tags = el.tags || {};
      if (!tags.name) continue;

      placeSet.add(tags.name);

      if (tags.amenity === "hospital") hospital++;
      if (tags.amenity === "bus_station") transport++;
      if (tags.amenity === "school" || tags.amenity === "college")
        education++;
      if (tags.shop) commercial++;
    }

    const places = [...placeSet];
    const totalPlaces = places.length;

    /* ---------- AREA TYPE ---------- */
    let areaType = "Public Area";

    if (totalPlaces >= 3) {
      if (hospital >= 3) areaType = "Hospital Area";
      else if (transport >= 2) areaType = "Transport Area";
      else if (education >= 3) areaType = "Educational Area";
      else if (commercial >= 4) areaType = "Commercial Area";
    }

    /* ---------- CROWD LEVEL ---------- */
    const crowdLevel = predictCrowd(places);

    /* ---------- RESPONSE ---------- */
    return res.json({
      success: true,
      location: area,
      areaType,
      places: places.slice(0, 10),
      crowdLevel,
      meta: {
        totalPlaces,
        hospital,
        transport,
        education,
        commercial,
      },
    });
  } catch (error) {
    console.error("Crowd Controller Fatal Error:", error);
    return res.status(500).json({
      message: "Live crowd detection failed",
    });
  }
};
