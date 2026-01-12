export function predictCrowd(places = []) {
  if (!Array.isArray(places) || places.length === 0) {
    return "LOW";
  }

  let score = 0;

  /* ---------- PLACE WEIGHTS (CAPPED & REALISTIC) ---------- */
  let transport = 0;
  let commercial = 0;
  let hospital = 0;
  let education = 0;
  let other = 0;

  for (const place of places) {
    const name = place.toLowerCase();

    if (
      name.includes("bus stand") ||
      name.includes("bus station") ||
      name.includes("railway") ||
      name.includes("metro")
    ) {
      transport++;
    } else if (
      name.includes("mall") ||
      name.includes("market") ||
      name.includes("shopping")
    ) {
      commercial++;
    } else if (
      name.includes("hospital") ||
      name.includes("medical")
    ) {
      hospital++;
    } else if (
      name.includes("college") ||
      name.includes("school") ||
      name.includes("university")
    ) {
      education++;
    } else {
      other++;
    }
  }

  // Cap influence (prevents fake HIGH)
  score += Math.min(transport * 5, 10);
  score += Math.min(commercial * 4, 8);
  score += Math.min(hospital * 3, 6);
  score += Math.min(education * 3, 6);
  score += Math.min(other * 1, 4);

  /* ---------- TIME BOOST (ONLY IF BASE CROWD EXISTS) ---------- */
  const hour = new Date().getHours();

  if (score >= 5) {
    if (hour >= 8 && hour <= 10) score += 2;   // Morning rush
    if (hour >= 17 && hour <= 20) score += 3; // Evening rush
  }

  /* ---------- FINAL CROWD ---------- */
  if (score >= 16) return "HIGH";
  if (score >= 8) return "MEDIUM";
  return "LOW";
}
