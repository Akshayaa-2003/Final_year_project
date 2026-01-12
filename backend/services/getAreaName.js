export async function getAreaName(lat, lng) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14&addressdetails=1`,
      {
        headers: {
          "User-Agent": "crowd-prediction-app/1.0",
          "Accept-Language": "en",
        },
      }
    );

    if (!res.ok) throw new Error("Reverse geocoding failed");

    const data = await res.json();
    const a = data.address || {};

    /* ---------- SUB AREA ---------- */
    const subArea =
      a.suburb ||
      a.neighbourhood ||
      a.village ||
      a.hamlet ||
      a.quarter ||
      "";

    /* ---------- DISTRICT LOGIC (KEY FIX) ---------- */
    let district = "";

    // 1️⃣ Prefer state_district (more reliable in TN)
    if (a.state_district) {
      district = a.state_district;
    }
    // 2️⃣ Fallback to county
    else if (a.county) {
      district = a.county;
    }

    // 3️⃣ Final fallback
    else if (a.city_district) {
      district = a.city_district;
    }

    /* ---------- CLEAN DISTRICT ---------- */
    district = district
      .replace(/\b(north|south|east|west)\b/i, "")
      .trim();

    /* ---------- COIMBATORE NORMALIZATION ---------- */
    // If either field mentions Coimbatore → lock to Coimbatore
    const districtText = `${a.state_district || ""} ${a.county || ""}`.toLowerCase();

    if (districtText.includes("coimbatore")) {
      district = "Coimbatore";
    }

    /* ---------- FINAL OUTPUT ---------- */
    if (subArea && district) return `${subArea}, ${district}`;
    if (district) return district;
    if (subArea) return subArea;

    return "Unknown Area";
  } catch (err) {
    console.error("Geocode Error:", err.message);
    return "Unknown Area";
  }
}
