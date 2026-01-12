// ❌ DO NOT import anything here
// ❌ DO NOT import predictCrowd from itself

export function predictCrowd(places = []) {
  if (!Array.isArray(places) || places.length === 0) {
    return "LOW";
  }

  let score = 0;

  // Place-based weights
  for (const place of places) {
    const name = place.toLowerCase();

    if (name.includes("bus")) score += 5;
    else if (name.includes("mall")) score += 4;
    else if (name.includes("hospital")) score += 3;
    else score += 1;
  }

  // Time-based weights
  const hour = new Date().getHours();

  if (hour >= 8 && hour <= 10) score += 3;   // Morning rush
  if (hour >= 17 && hour <= 20) score += 4; // Evening rush

  if (score >= 14) return "HIGH";
  if (score >= 7) return "MEDIUM";
  return "LOW";
}
