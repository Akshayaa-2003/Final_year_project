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
     ⏰ TIME FACTOR
  =============================== */
  if (hour >= 7 && hour <= 10) score += 2;      // Morning rush
  if (hour >= 17 && hour <= 21) score += 3;    // Evening rush
  if (hour >= 12 && hour <= 14) score += 1;    // Lunch crowd

  /* ===============================
     📅 DAY FACTOR
  =============================== */
  if (day === 0 || day === 6) score += 2;       // Weekend
  if (day >= 1 && day <= 5 && hour >= 9 && hour <= 18) score += 1;

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
     👥 ACTIVITY LEVEL
  =============================== */
  const activityWeight = {
    Low: 0,
    Medium: 1,
    High: 2
  };

  score += activityWeight[activityLevel] ?? 0;

  /* ===============================
     📍 PLACE NAME BOOST
  =============================== */
  const placeName = place.toLowerCase();

  if (placeName.includes("central")) score += 2;
  if (placeName.includes("junction")) score += 2;
  if (placeName.includes("terminus")) score += 2;
  if (placeName.includes("main")) score += 1;
  if (placeName.includes("new")) score -= 1;

  /* ===============================
     🎯 FINAL CROWD LEVEL
  =============================== */
  let crowdLevel = "Low";

  if (score >= 9) crowdLevel = "High";
  else if (score >= 5) crowdLevel = "Medium";

  return {
    crowdLevel,
    score,
    hour,
    day,
    time: now.toLocaleString("en-IN")
  };
}
