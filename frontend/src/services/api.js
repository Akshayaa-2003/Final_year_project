export const API_BASE_URL =
  "https://crowd-prediction-website-01.onrender.com";

export const predictCrowd = async (payload) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/api/predict`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // 🔐 JWT
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    // token expired / unauthorized
    throw new Error("Unauthorized or prediction failed");
  }

  return response.json();
};
