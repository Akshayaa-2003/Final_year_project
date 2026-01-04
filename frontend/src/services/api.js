export const API_BASE_URL =
  "https://crowd-prediction-website-01.onrender.com";

export const predictCrowd = async (payload) => {
  const response = await fetch(`${API_BASE_URL}/api/predict`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Prediction failed");
  }

  return response.json();
};
