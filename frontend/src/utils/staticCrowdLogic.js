export function predictCrowdFromPlaces(places = []) {
  let score = 0;

  places.forEach((p) => {
    const name = p.toLowerCase();

    if (name.includes("mall")) score += 3;
    else if (name.includes("market")) score += 3;
    else if (name.includes("bus")) score += 2;
    else if (name.includes("station")) score += 2;
    else if (name.includes("cinema")) score += 2;
    else if (name.includes("park")) score += 1;
    else if (name.includes("hospital")) score += 1;
  });

  if (score >= 7) return "High";
  if (score >= 4) return "Medium";
  return "Low";
}
