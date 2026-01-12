export function getTimeWeight() {
  const hour = new Date().getHours();

  if (hour >= 8 && hour <= 10) return 3;   // Morning rush
  if (hour >= 17 && hour <= 20) return 4; // Evening rush
  return 1;
}
