export function getTimeWeight() {
  const hour = new Date().getHours();

  // Morning office / school rush
  if (hour >= 8 && hour <= 10) return 2;

  // Evening peak
  if (hour >= 17 && hour <= 20) return 3;

  // Late night / early morning → no boost
  if (hour >= 22 || hour <= 5) return 0;

  // Normal daytime
  return 1;
}
