// ✅ Render / Node 18+ SAFE fetch
const fetchFn = (...args) => fetch(...args);

export async function getNearbyPlaces(lat, lng) {
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return [];

  const radius = 1500;

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
    const res = await fetchFn("https://overpass-api.de/api/interpreter", {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
        "User-Agent": "crowd-prediction-app/1.0",
      },
      body: query,
    });

    if (!res.ok) throw new Error("Overpass API failed");

    const data = await res.json();
    const elements = Array.isArray(data.elements) ? data.elements : [];

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

    const seen = new Set();
    const places = [];

    for (const e of elements) {
      const tags = e.tags;
      if (!tags?.name) continue;

      let type = "other";
      if (tags.amenity) type = tags.amenity;
      else if (tags.railway === "station") type = "station";
      else if (tags.aeroway) type = tags.aeroway;
      else if (tags.leisure === "park") type = "park";
      else if (tags.shop) type = "shop";

      const key = `${tags.name.toLowerCase()}-${type}`;
      if (seen.has(key)) continue;

      seen.add(key);
      places.push({
        name: tags.name.trim(),
        type,
        weight: weightMap[type] || 1,
      });
    }

    return places;
  } catch (err) {
    console.error("Nearby Places Error:", err.message);
    return [];
  }
}
