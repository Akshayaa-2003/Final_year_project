export function calculateCrowd({
  locationType,
  place = "",
  activityLevel = "Normal"
}) {
  const now = new Date();
  const hour = now.getHours();
  const day = now.getDay(); // 0 = Sunday

  let score = 0;

  /* ===============================
     ⏰ TIME FACTOR (REALISTIC)
  =============================== */
  if (hour >= 7 && hour <= 10) score += 2;       // Morning rush
  else if (hour >= 12 && hour <= 14) score += 1; // Lunch time
  else if (hour >= 17 && hour <= 21) score += 3; // Evening peak
  else if (hour >= 22 || hour <= 5) score -= 1;  // Late night low

  /* ===============================
     📅 DAY FACTOR
  =============================== */
  if (day === 0 || day === 6) {
    score += 2; // Weekend boost
  } else if (hour >= 9 && hour <= 18) {
    score += 1; // Weekday working hours
  }

  /* ===============================
     🏙 LOCATION TYPE WEIGHT
  =============================== */
  const locationWeight = {
    "Bus Stand": 4,
    "Railway Station": 4,
    "Metro Station": 3,
    "Shopping Mall": 3,
    "Market": 3,
    "Temple": 2,
    "Beach": 2,
    "Hospital": 2,
    "Cinema Hall": 2,
    "Park": 1
  };

  score += locationWeight[locationType] ?? 1;

  /* ===============================
     👥 ACTIVITY LEVEL (SOCIAL SIGNAL)
     (No user toggle – inferred)
  =============================== */
  const activityWeight = {
    Low: 0,
    Medium: 1,
    High: 2
  };

  score += activityWeight[activityLevel] ?? 1;

  /* ===============================
     📍 PLACE NAME HEURISTICS
     (Indirect social signal)
  =============================== */
  const placeName = place.toLowerCase();

  if (
    placeName.includes("central") ||
    placeName.includes("junction") ||
    placeName.includes("terminus")
  ) {
    score += 2;
  }

  if (placeName.includes("main")) score += 1;
  if (placeName.includes("new")) score -= 1;

  /* ===============================
     🔒 CLAMP SCORE (STABILITY)
  =============================== */
  score = Math.max(0, Math.min(score, 10));

  /* ===============================
     🎯 FINAL CROWD LEVEL
  =============================== */
  let crowdLevel = "Low";

  if (score >= 8) crowdLevel = "High";
  else if (score >= 4) crowdLevel = "Medium";

  return {
    crowdLevel,
    score,
    hour,
    day,
    time: now.toLocaleString("en-IN")
  };
}
