// SIMPLE CROWD LOGIC (STATIC)

export const predictCrowdFromPlaces = (places) => {
  const count = places.length;

  if (count <= 2) return "Low";
  if (count <= 4) return "Medium";
  return "High";
};
