import axios from "axios";

/* =====================================
   GET NEARBY PLACES (SMART + DISTANCE)
===================================== */
export const getNearbyPlaces = async (req, res) => {
  try {
    const { lat, lng } = req.body;

    if (typeof lat !== "number" || typeof lng !== "number") {
      return res.status(400).json({
        error: "Valid latitude & longitude required"
      });
    }

    /* 🔥 SMALLER RADIUS = MORE ACCURATE (2 KM) */
    const query = `
[out:json][timeout:25];
(
  node(around:2000,${lat},${lng})["highway"="bus_stop"];
  node(around:2000,${lat},${lng})["amenity"="bus_station"];
  node(around:2000,${lat},${lng})["public_transport"="station"];

  node(around:2000,${lat},${lng})["amenity"="marketplace"];
  node(around:2000,${lat},${lng})["shop"="mall"];
  node(around:2000,${lat},${lng})["amenity"="hospital"];
  node(around:2000,${lat},${lng})["amenity"="cinema"];
);
out center tags;
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

    const elements = response.data?.elements || [];

    /* ===============================
       PRIORITY (INDIA REALISTIC)
    =============================== */
    const priorityScore = (name = "") => {
      const n = name.toLowerCase();
      if (n.includes("bus")) return 1;
      if (n.includes("stand") || n.includes("terminus")) return 1;
      if (n.includes("market")) return 2;
      if (n.includes("mall")) return 3;
      if (n.includes("hospital")) return 4;
      if (n.includes("cinema")) return 5;
      return 9;
    };

    /* ===============================
       DISTANCE (HAVERSINE – SAFE)
    =============================== */
    const distanceKm = (lat1, lon1, lat2, lon2) => {
      const R = 6371;
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) ** 2;
      return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    };

    /* ===============================
       CLEAN + SCORE + SORT
    =============================== */
    const places = [
      ...new Map(
        elements
          .filter(el => el.tags?.name)
          .map(el => {
            const lat2 = el.lat ?? el.center?.lat;
            const lon2 = el.lon ?? el.center?.lon;

            if (!lat2 || !lon2) return null;

            return [
              el.tags.name,
              {
                name: el.tags.name,
                distance: distanceKm(lat, lng, lat2, lon2),
                priority: priorityScore(el.tags.name)
              }
            ];
          })
          .filter(Boolean)
      ).values()
    ]
      .filter(p => p.distance <= 2.5) // 🔥 HARD FILTER (NO TIRUPPUR!)
      .sort((a, b) =>
        a.priority - b.priority || a.distance - b.distance
      )
      .slice(0, 5);

    res.json({
      nearbyPlaces: places.map(p => p.name),
      count: places.length
    });

  } catch (err) {
    console.error("Nearby fetch error:", err.message);
    res.status(500).json({
      nearbyPlaces: [],
      error: "Failed to fetch nearby places"
    });
  }
};
