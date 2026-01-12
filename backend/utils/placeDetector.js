export function filterPlannedPlaces(elements = []) {
  if (!Array.isArray(elements)) return [];

  const pattern =
    /(mall|shopping|market|hospital|clinic|bus\s*stand|bus\s*station|railway\s*station|metro|college|school|university)/i;

  return elements
    .map(el => el?.tags?.name?.trim())
    .filter(name => typeof name === "string" && pattern.test(name));
}
