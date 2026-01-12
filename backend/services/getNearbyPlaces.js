import fetch from "node-fetch";

export async function getNearbyPlaces(lat, lng) {
  const radius = 1500; // meters

  const query = `
    [out:json];
    (
      node["amenity"="hospital"](around:${radius},${lat},${lng});
      node["amenity"="school"](around:${radius},${lat},${lng});
      node["amenity"="college"](around:${radius},${lat},${lng});
      node["amenity"="bus_station"](around:${radius},${lat},${lng});
      node["railway"="station"](around:${radius},${lat},${lng});
      node["shop"](around:${radius},${lat},${lng});
    );
    out tags 15;
  `;

  const res = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    body: query,
  });

  const data = await res.json();

  return data.elements
    .map(e => ({
      name: e.tags?.name,
      type:
        e.tags?.amenity ||
        e.tags?.railway ||
        e.tags?.shop ||
        "other",
    }))
    .filter(p => p.name);
}
