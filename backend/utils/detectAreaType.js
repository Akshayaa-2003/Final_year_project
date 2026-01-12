export function detectAreaType(places = []) {
  if (!Array.isArray(places) || places.length === 0) {
    return "Public Area";
  }

  let hospital = 0;
  let transport = 0;
  let education = 0;
  let commercial = 0;

  for (const p of places) {
    const type = p.type;

    if (type === "hospital" || type === "clinic") hospital++;

    if (
      type === "bus_station" ||
      type === "bus_stop" ||
      type === "station" ||
      type === "metro"
    ) {
      transport++;
    }

    if (
      type === "school" ||
      type === "college" ||
      type === "university"
    ) {
      education++;
    }

    if (
      type === "shop" ||
      type === "marketplace" ||
      type === "mall"
    ) {
      commercial++;
    }
  }

  const total = places.length;

  /* ---------- DECISION LOGIC ---------- */

  // Hospital-dominated area (strict but safe)
  if (hospital >= 3 && hospital / total >= 0.5) {
    return "Hospital Area";
  }

  // Transport hubs
  if (transport >= 2 && transport >= education && transport >= commercial) {
    return "Transport Area";
  }

  // Education zones
  if (education >= 3) {
    return "Educational Area";
  }

  // Commercial zones
  if (commercial >= 4) {
    return "Commercial Area";
  }

  return "Public Area";
}
