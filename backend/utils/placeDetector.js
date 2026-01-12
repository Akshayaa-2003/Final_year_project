export function filterPlannedPlaces(elements) {
  return elements
    .map(el => el.tags?.name || "")
    .filter(name =>
      /mall|hospital|bus/i.test(name)
    );
}
