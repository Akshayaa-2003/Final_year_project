import axios from "axios";

/* =====================================
   LIVE LOCATION → NEARBY PLACES (FINAL FIX)
===================================== */
export const getNearbyPlaces = async (req, res) => {
  try {
    const { lat, lng } = req.body;

    if (!lat || !lng) {
      return res.status(400).json({
        error: "Latitude & longitude required"
      });
    }

    /* 🔥 OVERPASS QUERY (3 KM – INDIA SAFE TAGS) */
    const query = `
[out:json][timeout:25];
(
  /* BUS */
  node(around:3000,${lat},${lng})["amenity"="bus_station"];
  node(around:3000,${lat},${lng})["highway"="bus_stop"];
  node(around:3000,${lat},${lng})["public_transport"="station"];

  /* RAIL */
  node(around:3000,${lat},${lng})["railway"="station"];

  /* MARKET */
  node(around:3000,${lat},${lng})["amenity"="marketplace"];

  /* MALL */
  node(around:3000,${lat},${lng})["shop"="mall"];

  /* HOSPITAL */
  node(around:3000,${lat},${lng})["amenity"="hospital"];
);
out tags;
`;

    const response = await axios.post(
      "https://overpass-api.de/api/interpreter",
      query,
      {
        headers: {
          "Content-Type": "text/plain",
          "User-Agent": "crowd-prediction-app"
        }
      }
    );

    /* 🔥 CLEAN, UNIQUE, SORTED */
    const places = [
      ...new Set(
        (response.data.elements || [])
          .map(el => el.tags?.name)
          .filter(name => name && name.length > 3)
      )
    ].slice(0, 6);

    return res.json({
      nearbyPlaces: places,
      count: places.length
    });

  } catch (err) {
    console.error("Nearby fetch error:", err.message);
    return res.status(500).json({
      nearbyPlaces: [],
      error: "Unable to detect nearby data"
    });
  }
};
