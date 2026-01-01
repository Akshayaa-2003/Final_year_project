import { tamilNaduCities } from "./cityData.js";

/* ===============================
   NORMALIZE CITY NAME
================================ */
export const resolveCity = (rawCity) => {
  if (!rawCity) return "";

  const lower = rawCity.toLowerCase();

  // Direct match
  const exact = tamilNaduCities.find(
    c => c.toLowerCase() === lower
  );
  if (exact) return exact;

  // Partial match (IMPORTANT)
  const partial = tamilNaduCities.find(
    c => lower.includes(c.toLowerCase()) || c.toLowerCase().includes(lower)
  );

  return partial || rawCity;
};
