export function detectAreaType(places) {
  let hospital = 0;
  let transport = 0;
  let education = 0;
  let commercial = 0;

  places.forEach(p => {
    if (p.type === "hospital") hospital++;
    if (p.type === "bus_station" || p.type === "station") transport++;
    if (p.type === "school" || p.type === "college") education++;
    if (p.type === "shop") commercial++;
  });

  const total = places.length;

  // 🔥 STRICT hospital rule
  if (hospital >= 5 && hospital / total >= 0.6) {
    return "Hospital Area";
  }

  if (transport >= 3) return "Transport Area";
  if (education >= 3) return "Educational Area";
  if (commercial >= 4) return "Commercial Area";

  return "Public Area";
}
