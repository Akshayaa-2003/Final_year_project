import fetch from "node-fetch";

const runTest = async () => {
  const url = "http://localhost:5000/api/predict-crowd";
  
  const testCases = [
    { city: "Chennai", mode: "Bus", hour: 9, dayOfWeek: 1, temp: 30, isRain: 0, socialScore: 1.2, travelTime: 30 }, // Peak Morning
    { city: "Ariyalur", mode: "Bus", hour: 9, dayOfWeek: 1, temp: 30, isRain: 0, socialScore: 1.2, travelTime: 20 }, // Peak Morning Small City
    { city: "Chennai", mode: "Metro", hour: 14, dayOfWeek: 3, temp: 38, isRain: 0, socialScore: 1.5, travelTime: 10 }, // Hot Metro Mid-day
    { city: "Madurai", mode: "Bus", hour: 20, dayOfWeek: 6, temp: 28, isRain: 1, socialScore: 4.5, travelTime: 60 }, // Weekend Night Rain High Social
  ];

  for (const tc of testCases) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tc)
      });
      const data = await res.json();
      console.log(`Input: ${tc.city} ${tc.mode} ${tc.hour}h -> Prediction:`, data.data?.now);
    } catch (e) {
      console.error("Error:", e.message);
    }
  }
};

runTest();
