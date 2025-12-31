exports.getCrowdLevel = (activity) => {
  if (activity === "High") return "High";
  if (activity === "Medium") return "Medium";
  return "Low";
};
