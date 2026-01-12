export function getCrowdLevel(count) {
  if (count >= 8) return "HIGH";
  if (count >= 4) return "MEDIUM";
  return "LOW";
}
