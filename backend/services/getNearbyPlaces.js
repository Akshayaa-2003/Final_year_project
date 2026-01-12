import fetch from "node-fetch";

export async function getNearbyPlaces(lat, lng) {
  const radius = 1500; // meters

  const query = `
    [out:json][timeout:25];
    (
      node["amenity"~"hospital|clinic"](around:${radius},${lat},${lng});
      node["amenity"~"school|college|university"](around:${radius},${lat},${lng});
      node["amenity"~"bus_station|bus_stop"](around:${radius},${lat},${lng});
      node["railway"="station"](around:${radius},${lat},${lng});
      node["aeroway"="aerodrome"](around:${radius},${lat},${lng});

      node["amenity"="marketplace"](around:${radius},${lat},${lng});
      node["amenity"="restaurant"](around:${radius},${lat},${lng});
      node["amenity"="bank"](around:${radius},${lat},${lng});
      node["amenity"="atm"](around:${radius},${lat},${lng});
      node["shop"](around:${radius},${lat},${lng});

      node["amenity"="place_of_worship"](around:${radius},${lat},${lng});
      node["leisure"="park"](around:${radius},${lat},${lng});
    );
    out tags 20;
  `;

  try {
    const res = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
        "User-Agent": "crowd-prediction-app/1.0",
      },
      body: query,
    });

    if (!res.ok) throw new Error("Overpass API error");

    const data = await res.json();
    const elements = Array.isArray(data.elements) ? data.elements : [];

    /* ---------- WEIGHTS ---------- */
    const weightMap = {
      hospital: 3,
      clinic: 2,
      school: 2,
      college: 3,
      university: 4,
      bus_station: 3,
      bus_stop: 2,
      station: 4,
      aerodrome: 5,
      marketplace: 3,
      restaurant: 2,
      bank: 2,
      atm: 1,
      shop: 1,
      place_of_worship: 3,
      park: 1,
      other: 1,
    };

    /* ---------- NORMALIZE TYPE CORRECTLY ---------- */
    const places = elements
      .map((e) => {
        const tags = e.tags || {};
        if (!tags.name) return null;

        let type = "other";

        if (tags.amenity) type = tags.amenity;
        else if (tags.railway === "station") type = "station";
        else if (tags.aeroway) type = tags.aeroway;
        else if (tags.leisure === "park") type = "park";
        else if (tags.shop) type = "shop";

        return {
          name: tags.name.trim(),
          type,
          weight: weightMap[type] || 1,
        };
      })
      .filter(Boolean);

    /* ---------- DEDUPLICATE ---------- */
    const unique = [];
    const seen = new Set();

    for (const p of places) {
      const key = p.name.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(p);
      }
    }

    return unique;
  } catch (err) {
    console.error("Nearby Places Error:", err.message);
    return [];
  }
}
