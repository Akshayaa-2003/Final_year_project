export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL.replace(/\/$/, "");

// 🔮 PREDICT API
export const predictCrowd = async (payload) => {
  const response = await fetch(`${API_BASE_URL}/api/crowd/predict`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Prediction failed");
  }

  return data;
};
