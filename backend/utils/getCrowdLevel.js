export function getCrowdLevel(count) {
  if (typeof count !== "number" || count <= 0) {
    return "LOW";
  }

  // Very small sample → never HIGH
  if (count < 3) {
    return "LOW";
  }

  if (count >= 10) return "HIGH";
  if (count >= 5) return "MEDIUM";

  return "LOW";
}
