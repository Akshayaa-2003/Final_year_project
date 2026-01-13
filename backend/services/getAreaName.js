export async function getAreaName(lat, lng) {
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return "Unknown Area";
  }

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14&addressdetails=1`,
      {
        headers: {
          "User-Agent": "crowd-prediction-app/1.0",
          "Accept-Language": "en",
          "Referer": "http://localhost", // SAFE before deploy
        },
      }
    );

    if (!res.ok) throw new Error("Reverse geocoding failed");

    const data = await res.json();
    const a = data?.address || {};

    /* ---------- SUB AREA (MOST PRECISE) ---------- */
    const subArea =
      a.suburb ||
      a.neighbourhood ||
      a.locality ||
      a.village ||
      a.hamlet ||
      a.quarter ||
      "";

    /* ---------- CITY ---------- */
    const city =
      a.city ||
      a.town ||
      a.municipality ||
      "";

    /* ---------- DISTRICT (INDIA SAFE) ---------- */
    let district =
      a.state_district ||
      a.county ||
      a.city_district ||
      "";

    /* ---------- CLEAN FUNCTION ---------- */
    const clean = (text = "") =>
      text
        .replace(
          /\b(north|south|east|west|taluk|zone|division|circle)\b/gi,
          ""
        )
        .replace(/\s{2,}/g, " ")
        .trim();

    const cleanSubArea = clean(subArea);
    const cleanCity = clean(city);
    district = clean(district);

    /* ---------- MAJOR CITY NORMALIZATION (SAFE FIX) ---------- */
    const majorCities = [
      "coimbatore",
      "chennai",
      "madurai",
      "tiruchirappalli",
      "salem",
      "erode",
    ];

    const combined = JSON.stringify(a).toLowerCase();

    // Only override district IF it is empty
    if (!district) {
      for (const c of majorCities) {
        if (combined.includes(c)) {
          district = c.charAt(0).toUpperCase() + c.slice(1);
          break;
        }
      }
    }

    /* ---------- FINAL PRIORITY (NO EMPTY RETURNS) ---------- */
    if (cleanSubArea && district)
      return `${cleanSubArea}, ${district}`;

    if (cleanCity && district)
      return `${cleanCity}, ${district}`;

    if (district) return district;
    if (cleanCity) return cleanCity;
    if (cleanSubArea) return cleanSubArea;

    return "Unknown Area";
  } catch (err) {
    console.error("Geocode Error:", err.message);
    return "Unknown Area";
  }
}
