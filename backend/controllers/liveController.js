import axios from "axios";

/* =====================================
   LIVE LOCATION → NEARBY PLACES
===================================== */
export const getNearbyPlaces = async (req, res) => {
  try {
    const { lat, lng } = req.body;

    // Validate input
    if (!lat || !lng || typeof lat !== "number" || typeof lng !== "number") {
      return res.status(400).json({
        error: "Valid latitude and longitude required",
        nearbyPlaces: []
      });
    }

    // Validate coordinates are in India range
    if (lat < 8 || lat > 35 || lng < 68 || lng > 97) {
      return res.status(400).json({
        error: "Location outside India",
        nearbyPlaces: []
      });
    }

    /* 🔥 OVERPASS QUERY - 3KM RADIUS */
    const query = `
[out:json][timeout:20];
(
  node(around:3000,${lat},${lng})["amenity"="bus_station"];
  node(around:3000,${lat},${lng})["amenity"="railway_station"];
  node(around:3000,${lat},${lng})["amenity"="marketplace"];
  node(around:3000,${lat},${lng})["shop"="mall"];
  node(around:3000,${lat},${lng})["amenity"="hospital"];
  node(around:3000,${lat},${lng})["amenity"="restaurant"];
  node(around:3000,${lat},${lng})["leisure"="park"];
  node(around:3000,${lat},${lng})["tourism"="attraction"];
);
out center;
`;

    console.log(`🔍 Fetching nearby places for: ${lat}, ${lng}`);

    const response = await axios.post(
      "https://overpass-api.de/api/interpreter",
      query,
      {
        headers: {
          "Content-Type": "text/plain",
          "User-Agent": "crowd-prediction-app/1.0"
        },
        timeout: 25000
      }
    );

    // Extract and clean place names
    const places = [
      ...new Set(
        (response.data.elements || [])
          .map(el => el.tags?.name)
          .filter(name => name && name.trim().length > 2)
          .map(name => name.trim())
      )
    ]
      .sort()
      .slice(0, 8);

    console.log(`✅ Found ${places.length} nearby places`);

    return res.status(200).json({
      nearbyPlaces: places,
      latitude: lat,
      longitude: lng,
      count: places.length,
      timestamp: new Date().toISOString()
    });

  } catch (err) {
    console.error("❌ Nearby places error:", err.message);

    // Return fallback data on error
    return res.status(200).json({
      nearbyPlaces: [
        "Central Market",
        "Main Hospital",
        "Railway Station",
        "Bus Terminal",
        "Shopping Mall",
        "Local Park"
      ],
      count: 6,
      message: "Using fallback data",
      error: err.message
    });
  }
};
