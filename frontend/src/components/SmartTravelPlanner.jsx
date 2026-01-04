import { useState } from "react";
import "./SmartTravelPlanner.css";

export default function SmartTravelPlanner({
  city = "Chennai",
  crowdLevel = "medium",
}) {
  // ✅ SIMPLE STATIC PLACES (college-friendly)
  const places = [
    "CMBT",
    "Koyambedu",
    "Guindy",
    "T. Nagar",
    "Marina Beach",
    "Parrys",
  ];

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [fromTime, setFromTime] = useState("");
  const [toTime, setToTime] = useState("");
  const [result, setResult] = useState(null);

  const calculateTravel = () => {
    if (!from || !to || !fromTime || !toTime || from === to) return;

    // ⏱ Base travel time
    const baseTime = Math.floor(Math.random() * 15) + 25;

    // 👥 Crowd delay
    let delay = 0;
    if (crowdLevel === "medium") delay = 10;
    if (crowdLevel === "high") delay = 25;

    setResult({
      baseTime,
      delay,
      total: baseTime + delay,
      recommendation:
        crowdLevel === "high"
          ? "Avoid travel if possible"
          : crowdLevel === "medium"
          ? "Travel with caution"
          : "Safe to travel",
    });
  };

  return (
    <section id="transport" className="planner-section">
      <div className="planner-card">
        {/* HEADER */}
        <h2>Smart Travel Planner</h2>
        <p className="subtitle">
          Plan travel in <strong>{city}</strong> based on crowd conditions
        </p>

        {/* FROM → TO */}
        <div className="planner-grid">
          <div>
            <label>From</label>
            <select value={from} onChange={(e) => setFrom(e.target.value)}>
              <option value="">Select start location</option>
              {places.map((p, i) => (
                <option key={i} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div className="planner-arrow">→</div>

          <div>
            <label>To</label>
            <select value={to} onChange={(e) => setTo(e.target.value)}>
              <option value="">Select destination</option>
              {places.map((p, i) => (
                <option key={i} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* TIME RANGE */}
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

        {/* BUTTON */}
        <button
          className="planner-btn"
          onClick={calculateTravel}
          disabled={!from || !to || !fromTime || !toTime || from === to}
        >
          Calculate Travel
        </button>

        {/* RESULT */}
        {result && (
          <div className={`planner-result ${crowdLevel}`}>
            <div className="planner-route">
              {from} → {to}
              <br />
              <span>
                {fromTime} to {toTime}
              </span>
            </div>

            <div className="planner-metrics">
              <div>
                <span>Base Time</span>
                <strong>{result.baseTime} mins</strong>
              </div>

              <div>
                <span>Crowd Delay</span>
                <strong>{result.delay} mins</strong>
              </div>

              <div>
                <span>Total Time</span>
                <strong>{result.total} mins</strong>
              </div>
            </div>

            <div className="planner-advice">
              {result.recommendation}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
