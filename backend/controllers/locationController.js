import axios from "axios";

/* =====================================
   GET NEARBY PLACES (SMART + DISTANCE)
===================================== */
export const getNearbyPlaces = async (req, res) => {
  try {
    const { lat, lng } = req.body;

    // Validate input
    if (
      typeof lat !== "number" ||
      typeof lng !== "number" ||
      !lat ||
      !lng
    ) {
      return res.status(400).json({
        error: "Valid latitude & longitude required",
        nearbyPlaces: []
      });
    }

    // Validate India bounds
    if (lat < 8 || lat > 35 || lng < 68 || lng > 97) {
      return res.status(400).json({
        error: "Location outside India",
        nearbyPlaces: []
      });
    }

    console.log(`🔍 Fetching nearby places for: ${lat}, ${lng}`);

    /* 🔥 OVERPASS QUERY - 2KM RADIUS */
    const query = `
[out:json][timeout:20];
(
  node(around:2000,${lat},${lng})["highway"="bus_stop"];
  node(around:2000,${lat},${lng})["amenity"="bus_station"];
  node(around:2000,${lat},${lng})["public_transport"="station"];
  node(around:2000,${lat},${lng})["amenity"="marketplace"];
  node(around:2000,${lat},${lng})["shop"="mall"];
  node(around:2000,${lat},${lng})["amenity"="hospital"];
  node(around:2000,${lat},${lng})["amenity"="cinema"];
  node(around:2000,${lat},${lng})["amenity"="restaurant"];
  node(around:2000,${lat},${lng})["leisure"="park"];
);
out center tags;
`;

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

    const elements = response.data?.elements || [];

    if (!Array.isArray(elements) || elements.length === 0) {
      console.log("⚠️ No elements found from Overpass API");
      return res.status(200).json({
        nearbyPlaces: [],
        count: 0,
        message: "No nearby places found"
      });
    }

    /* ===============================
       PRIORITY SCORING
    =============================== */
    const priorityScore = (name = "") => {
      const n = name.toLowerCase();
      if (n.includes("bus")) return 1;
      if (n.includes("stand") || n.includes("terminus")) return 1;
      if (n.includes("station")) return 2;
      if (n.includes("market")) return 2;
      if (n.includes("mall")) return 3;
      if (n.includes("cinema")) return 4;
      if (n.includes("hospital")) return 5;
      if (n.includes("restaurant")) return 6;
      if (n.includes("park")) return 7;
      return 9;
    };

    /* ===============================
       HAVERSINE DISTANCE FORMULA
    =============================== */
    const distanceKm = (lat1, lon1, lat2, lon2) => {
      try {
        const R = 6371; // Earth radius in km
        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLon = ((lon2 - lon1) * Math.PI) / 180;
        const a =
          Math.sin(dLat / 2) ** 2 +
          Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
      } catch (err) {
        console.error("Distance calculation error:", err);
        return Infinity;
      }
    };

    /* ===============================
       PROCESS & SORT
    =============================== */
    const processedPlaces = elements
      .filter(el => el.tags?.name && el.tags.name.trim().length > 2)
      .map(el => {
        const elLat = el.lat ?? el.center?.lat;
        const elLng = el.lon ?? el.center?.lon;

        if (!elLat || !elLng) return null;

        const distance = distanceKm(lat, lng, elLat, elLng);
        const priority = priorityScore(el.tags.name);

        return {
          name: el.tags.name.trim(),
          distance: parseFloat(distance.toFixed(2)),
          priority
        };
      })
      .filter(
        (p) => p !== null && !isNaN(p.distance) && p.distance <= 2.5
      );

    // Remove duplicates
    const uniquePlaces = [
      ...new Map(
        processedPlaces.map((p) => [p.name.toLowerCase(), p])
      ).values(),
    ];

    // Sort by priority then distance
    const sorted = uniquePlaces
      .sort(
        (a, b) =>
          a.priority - b.priority || a.distance - b.distance
      )
      .slice(0, 6);

    const placeNames = sorted.map((p) => p.name);

    console.log(`✅ Found ${placeNames.length} nearby places`);

    return res.status(200).json({
      nearbyPlaces: placeNames,
      count: placeNames.length,
      latitude: lat,
      longitude: lng,
      timestamp: new Date().toISOString()
    });

  } catch (err) {
    console.error("❌ Nearby places error:", err.message);

    // Fallback response
    return res.status(200).json({
      nearbyPlaces: [
        "Central Bus Stand",
        "City Hospital",
        "Shopping Mall",
        "Railway Station",
        "Market Area",
        "Community Park"
      ],
      count: 6,
      message: "Using fallback data (API unavailable)",
      error: err.message
    });
  }
};
