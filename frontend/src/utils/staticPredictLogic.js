// SIMPLE STATIC CROWD PREDICTION (COLLEGE SAFE)

export const staticPredictCrowd = ({ city, locationType, place }) => {
  let score = 0;

  // city weight
  if (city) score += 1;

  // location type weight
  if (
    locationType.includes("bus") ||
    locationType.includes("railway") ||
    locationType.includes("market")
  ) {
    score += 3;
  } else if (
    locationType.includes("mall") ||
    locationType.includes("hospital")
  ) {
    score += 2;
  } else {
    score += 1;
  }

  // place selected
  if (place && place !== "General") score += 1;

  if (score <= 2) return "Low";
  if (score <= 4) return "Medium";
  return "High";
};
