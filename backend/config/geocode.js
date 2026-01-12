import fetch from "node-fetch";

export async function getAreaName(lat, lng) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14&addressdetails=1`,
      {
        headers: {
          "User-Agent": "crowd-prediction-app/1.0 (contact@example.com)",
          "Accept-Language": "en",
        },
      }
    );

    if (!res.ok) {
      throw new Error("Reverse geocoding failed");
    }

    const data = await res.json();
    const address = data.address || {};

    /* ---------- SUB AREA ---------- */
    const subArea =
      address.suburb ||
      address.neighbourhood ||
      address.quarter ||
      address.hamlet ||
      address.village ||
      "";

    /* ---------- CITY ---------- */
    const city =
      address.city ||
      address.town ||
      address.municipality ||
      "";

    /* ---------- DISTRICT (INDIA SAFE) ---------- */
    let district =
      address.state_district ||
      address.county ||
      "";

    /* ---------- CLEAN NAMES ---------- */
    const clean = (text) =>
      text
        .replace(/\b(north|south|east|west|taluk|zone|division)\b/gi, "")
        .replace(/\s{2,}/g, " ")
        .trim();

    const cleanSubArea = clean(subArea);
    const cleanCity = clean(city);
    district = clean(district);

    /* ---------- FINAL DECISION ---------- */
    // Prefer: SubArea, District
    if (cleanSubArea && district) {
      return `${cleanSubArea}, ${district}`;
    }

    // Fallback: City, District
    if (cleanCity && district) {
      return `${cleanCity}, ${district}`;
    }

    if (district) return district;
    if (cleanCity) return cleanCity;
    if (cleanSubArea) return cleanSubArea;

    return "Unknown Area";
  } catch (err) {
    console.error("Geocode Error:", err.message);
    return "Unknown Area";
  }
}
