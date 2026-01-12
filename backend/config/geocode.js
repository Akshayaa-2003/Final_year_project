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

    const subArea =
      address.suburb ||
      address.neighbourhood ||
      address.quarter ||
      address.hamlet ||
      address.village;

    const city =
      address.city ||
      address.town ||
      address.municipality;

    const district =
      address.county ||           // Coimbatore District
      address.state_district;     // fallback

    // 🔥 INDIA-SAFE DECISION LOGIC
    // If city and district conflict → trust district
    if (subArea && district) {
      return `${subArea}, ${district}`;
    }

    if (city && district) {
      return `${city}, ${district}`;
    }

    if (district) return district;
    if (city) return city;
    if (subArea) return subArea;

    return "Unknown Area";
  } catch (err) {
    console.error("Geocode Error:", err.message);
    return "Unknown Area";
  }
}
