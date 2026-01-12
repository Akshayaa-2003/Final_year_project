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

    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      return res.status(400).json({
        message: "Valid latitude and longitude are required",
      });
    }

    /* ---------- AREA NAME (API ONLY) ---------- */
    let area = "Unknown Area";
    try {
      area = await getAreaName(lat, lng);
    } catch (e) {
      console.error("getAreaName failed:", e.message);
    }

    /* ---------- OVERPASS QUERY (WIDER + MULTI TYPE) ---------- */
    const radius = 1500;

    const query = `
      [out:json];
      (
        node(around:${radius}, ${lat}, ${lng})["amenity"="hospital"];
        node(around:${radius}, ${lat}, ${lng})["amenity"="bus_station"];
        node(around:${radius}, ${lat}, ${lng})["amenity"="school"];
        node(around:${radius}, ${lat}, ${lng})["amenity"="college"];
        node(around:${radius}, ${lat}, ${lng})["shop"];
      );
      out tags 20;
    `;

    let elements = [];
    try {
      const response = await fetch(
        "https://overpass-api.de/api/interpreter",
        {
          method: "POST",
          body: query,
        }
      );

      if (response.ok) {
        const data = await response.json();
        elements = Array.isArray(data.elements) ? data.elements : [];
      } else {
        console.error("Overpass error:", response.status);
      }
    } catch (e) {
      console.error("Overpass fetch failed:", e.message);
    }

    /* ---------- ANALYZE PLACES ---------- */
    const places = [];
    let hospital = 0;
    let transport = 0;
    let education = 0;
    let commercial = 0;

    for (const el of elements) {
      const tags = el.tags || {};
      if (!tags.name) continue;

      places.push(tags.name);

      if (tags.amenity === "hospital") hospital++;
      if (tags.amenity === "bus_station") transport++;
      if (tags.amenity === "school" || tags.amenity === "college") education++;
      if (tags.shop) commercial++;
    }

    const totalPlaces = places.length;

    /* ---------- AREA TYPE (SMART & RARE) ---------- */
    let areaType = "Public Area";

    if (hospital >= 5 && hospital / totalPlaces >= 0.6) {
      areaType = "Hospital Area";
    } else if (transport >= 3) {
      areaType = "Transport Area";
    } else if (education >= 3) {
      areaType = "Educational Area";
    } else if (commercial >= 4) {
      areaType = "Commercial Area";
    }

    /* ---------- CROWD LEVEL (HONEST) ---------- */
    let crowdLevel = "LOW";
    if (totalPlaces >= 8) crowdLevel = "HIGH";
    else if (totalPlaces >= 4) crowdLevel = "MEDIUM";

    /* ---------- FINAL RESPONSE ---------- */
    res.json({
      success: true,
      location: area,              // from geocode only
      areaType,                    // smart logic
      places: places.slice(0, 10), // limit
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
    res.status(500).json({
      message: "Live crowd detection failed",
    });
  }
};
