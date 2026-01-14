import { useState, useEffect } from "react";
import "./SmartTravelPlanner.css";

/* ===============================
   TAMIL NADU DISTRICTS & PLACES
================================ */
const CITY_PLACES = {
  Chennai: ["CMBT", "Guindy", "T. Nagar", "Marina Beach", "Velachery", "Adyar"],
  Coimbatore: ["Gandhipuram", "RS Puram", "Ukkadam", "Peelamedu"],
  Madurai: ["Periyar", "Mattuthavani", "Anna Nagar", "Thirunagar"],
  Trichy: ["Chatram", "Srirangam", "Thillai Nagar"],
  Salem: ["New Bus Stand", "Hasthampatti", "Fairlands"],
  Tiruppur: ["Bus Stand", "Avinashi Road", "Nallur"],
  Erode: ["Bus Stand", "Brough Road"],
  Vellore: ["Katpadi", "Gandhi Road"],
  Thanjavur: ["Bus Stand", "Main Market"],
  Tirunelveli: ["Palayamkottai", "Junction"]
};

const TRANSPORT_MODES = ["Bus", "Train", "Metro"];

const CROWD_SCORE = { low: 1, medium: 2, high: 3 };
const CROWD_LABEL = { 1: "low", 2: "medium", 3: "high" };

export default function SmartTransportCrowd() {
  const [city, setCity] = useState("Chennai");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [time, setTime] = useState("");
  const [mode, setMode] = useState("Bus");
  const [result, setResult] = useState(null);

  /* ⏰ Live Time */
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        `${String(now.getHours()).padStart(2, "0")}:${String(
          now.getMinutes()
        ).padStart(2, "0")}`
      );
    };
    updateTime();
    const i = setInterval(updateTime, 60000);
    return () => clearInterval(i);
  }, []);

  const places = CITY_PLACES[city] || [];

  /* ===============================
      CROWD CALCULATION LOGIC
  ================================ */
  const getCurrentCrowd = (hour) => {
    let score = 2;

    // Peak hours
    if ((hour >= 8 && hour <= 11) || (hour >= 17 && hour <= 20)) score++;

    // Transport mode impact
    if (mode === "Metro") score -= 1;
    if (mode === "Train") score -= 0.5;

    // Chennai always slightly higher
    if (city === "Chennai") score += 0.5;

    score = Math.min(3, Math.max(1, Math.round(score)));
    return CROWD_LABEL[score];
  };

  const futureCrowd = (current, hrs) => {
    let score = CROWD_SCORE[current] + hrs * 0.4;
    score = Math.min(3, Math.max(1, Math.round(score)));
    return CROWD_LABEL[score];
  };

  const calculateCrowd = () => {
    if (!from || !to || from === to) return;

    const hour = Number(time.split(":")[0]);
    const current = getCurrentCrowd(hour);

    const baseTime = mode === "Bus" ? 45 : mode === "Train" ? 35 : 25;
    const delay = current === "high" ? 15 : current === "medium" ? 8 : 0;

    setResult({
      current,
      after1: futureCrowd(current, 1),
      after2: futureCrowd(current, 2),
      travelTime: baseTime + delay,
      advice:
        current === "high"
          ? "Heavy crowd expected — standing passengers likely."
          : current === "medium"
          ? "Moderate crowd — seating may be limited."
          : "Low crowd — comfortable travel."
    });
  };

  return (
    <section className="planner-section">
      <div className="planner-card">
        <h2>Smart Public Transport Crowd Predictor</h2>

        {/* INPUTS */}
        <div className="planner-inputs">
          <select value={city} onChange={(e) => {
            setCity(e.target.value);
            setFrom(""); setTo(""); setResult(null);
          }}>
            {Object.keys(CITY_PLACES).map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>

          <div className="planner-grid">
            <select value={from} onChange={(e) => setFrom(e.target.value)}>
              <option value="">From</option>
              {places.map((p) => <option key={p}>{p}</option>)}
            </select>

            <span className="arrow">→</span>

            <select value={to} onChange={(e) => setTo(e.target.value)}>
              <option value="">To</option>
              {places.filter(p => p !== from).map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </div>

          <select value={mode} onChange={(e) => setMode(e.target.value)}>
            {TRANSPORT_MODES.map((m) => <option key={m}>{m}</option>)}
          </select>

          <button onClick={calculateCrowd} disabled={!from || !to}>
            Predict Crowd
          </button>
        </div>

        {/* RESULT */}
        {result && (
          <div className={`result-card ${result.current}`}>
            <div className="result-header">
              <strong>{from} → {to}</strong>
              <span>{mode} · {time}</span>
            </div>

            <div className="result-stats">
              <div><label>Now</label><span>{result.current}</span></div>
              <div><label>+1 Hr</label><span>{result.after1}</span></div>
              <div><label>+2 Hr</label><span>{result.after2}</span></div>
              <div><label>Travel</label><span>{result.travelTime} min</span></div>
            </div>

            <div className="result-advice">
              🚍 {result.advice}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
