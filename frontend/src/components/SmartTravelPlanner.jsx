import { useState } from "react";
import { calculateFinalCrowd } from "../utils/crowdUtils";
import "./SmartTravelPlanner.css";

/* ================= COIMBATORE DATA ================= */

const PLACES = [
  // Central
  "Gandhipuram",
  "Town Hall",
  "Ukkadam",
  "RS Puram",
  "Sungam",

  // North Coimbatore
  "Thudiyalur",
  "Saravanampatti",
  "Koundampalayam",
  "Vadavalli",
  "Periyanaickenpalayam",

  // East Coimbatore
  "Peelamedu",
  "Hope College",
  "Avinashi Road",
  "Kalapatti",
  "Neelambur",

  // South Coimbatore
  "Singanallur",
  "Ondipudur",
  "Ramanathapuram",
  "Sundarapuram",
  "Podanur",

  // West Coimbatore
  "Saibaba Colony",
  "PN Palayam",
  "Kovaipudur",
  "Thondamuthur",

  // IT / Industrial
  "Chinniyampalayam",
  "CODISSIA",
  "Tidel Park",
  "SIDCO",

  // Transport Hubs
  "Coimbatore Junction",
  "Coimbatore North",
  "Omni Bus Stand",
  "Gandhipuram Bus Stand",

  // Education / Hospitals
  "PSG Tech",
  "KMCH",
  "Ganga Hospital",
  "Government Hospital"
];

const TRANSPORT_MODES = ["Bus", "Train", "Metro"];

const crowdWeight = {
  low: 1,
  medium: 2,
  high: 3,
};

const reverseCrowdWeight = {
  1: "low",
  2: "medium",
  3: "high",
};

export default function SmartTravelPlanner({ city = "Coimbatore" }) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [fromTime, setFromTime] = useState("");
  const [toTime, setToTime] = useState("");
  const [mode, setMode] = useState("Bus");
  const [result, setResult] = useState(null);

  /* ===== MOCK SOCIAL POSTS (COIMBATORE) ===== */
  const posts = [
    { text: "Heavy traffic near Gandhipuram", minutesAgo: 10 },
    { text: "Crowded buses at Ukkadam", minutesAgo: 25 },
    { text: "Long waiting time at Town Hall", minutesAgo: 40 },
  ];

  const googleTrendScore = 72;

  const toMinutes = (time) => {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
  };

  const predictCrowd = (currentCrowd, hoursLater) => {
    let level = crowdWeight[currentCrowd];

    if (hoursLater === 1) level -= 0.5;
    if (hoursLater === 2) level -= 1;

    level = Math.max(1, Math.min(3, Math.round(level)));
    return reverseCrowdWeight[level];
  };

  const calculateTravel = () => {
    if (!from || !to || !fromTime || !toTime || from === to) return;

    const start = toMinutes(fromTime);
    const end = toMinutes(toTime);
    if (start >= end) return;

    const currentCrowd = calculateFinalCrowd(posts, googleTrendScore);

    const hour = Number(fromTime.split(":")[0]);
    const isPeak =
      (hour >= 8 && hour <= 11) || (hour >= 17 && hour <= 20);

    const baseTime =
      mode === "Bus" ? 45 : mode === "Train" ? 35 : 25;

    const crowdDelay =
      currentCrowd === "high" ? 25 :
      currentCrowd === "medium" ? 10 : 0;

    const peakDelay = isPeak ? 10 : 0;

    const total = baseTime + crowdDelay + peakDelay;

    let recommendation;
    if (total > 70) recommendation = "Avoid travel or change time";
    else if (total > 55) recommendation = "Prefer Metro or Train";
    else recommendation = "Safe to travel";

    setResult({
      current: currentCrowd,
      after1Hour: predictCrowd(currentCrowd, 1),
      after2Hour: predictCrowd(currentCrowd, 2),
      total,
      recommendation,
    });
  };

  const isDisabled =
    !from ||
    !to ||
    !fromTime ||
    !toTime ||
    from === to ||
    toMinutes(fromTime) >= toMinutes(toTime);

  return (
    <section className="planner-section">
      <div className="planner-card">
        <h2>Smart Travel Planner</h2>
        <p className="subtitle">
          Crowd-aware travel prediction in <strong>{city}</strong>
        </p>

        <div className="planner-form">
          <div className="planner-grid">
            <div>
              <label>From</label>
              <select value={from} onChange={(e) => setFrom(e.target.value)}>
                <option value="">Select</option>
                {PLACES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div className="planner-arrow">→</div>

            <div>
              <label>To</label>
              <select value={to} onChange={(e) => setTo(e.target.value)}>
                <option value="">Select</option>
                {PLACES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="planner-time-grid">
            <div>
              <label>From Time</label>
              <input
                type="time"
                value={fromTime}
                onChange={(e) => setFromTime(e.target.value)}
              />
            </div>

            <div>
              <label>To Time</label>
              <input
                type="time"
                value={toTime}
                onChange={(e) => setToTime(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label>Transport Mode</label>
            <select value={mode} onChange={(e) => setMode(e.target.value)}>
              {TRANSPORT_MODES.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <button
            className="planner-btn"
            onClick={calculateTravel}
            disabled={isDisabled}
          >
            Predict Travel
          </button>
        </div>

        {result && (
          <div className="planner-result-section show">
            <div className={`planner-result ${result.current}`}>
              <div className="planner-route">
                {from} → {to}
                <span>{fromTime} – {toTime} ({mode})</span>
              </div>

              <div className="planner-metrics">
                <div>
                  <span>NOW</span>
                  <strong>{result.current.toUpperCase()}</strong>
                </div>
                <div>
                  <span>AFTER 1 HOUR</span>
                  <strong>{result.after1Hour.toUpperCase()}</strong>
                </div>
                <div>
                  <span>AFTER 2 HOURS</span>
                  <strong>{result.after2Hour.toUpperCase()}</strong>
                </div>
                <div>
                  <span>TOTAL</span>
                  <strong>{result.total} min</strong>
                </div>
              </div>

              <div className="planner-advice">
                🚦 {result.recommendation}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
