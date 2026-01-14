import { useState } from "react";
import "./ResultSection.css";

export default function ResultSection({ result }) {
  const [loading, setLoading] = useState(false);

  if (!result || typeof result !== "object") return null;

  /* ===============================
     SAFE FIELD MAPPING
  =============================== */
  const city = result.city ?? "—";

  const location =
    result.place ??
    result.location ??
    result.locationType ??
    "Not specified";

  const activity =
    result.activityLevel ??
    result.activity ??
    result.locationType ??
    "Normal";

  const rawCrowd =
    result.finalCrowd ??
    result.crowdLevel ??
    "Medium";

  const crowd =
    ["Low", "Medium", "High"].includes(rawCrowd)
      ? rawCrowd
      : "Medium";

  const reason = result.reason ?? null;
  const recommendation = result.recommendation ?? null;

  const time =
    result.time ??
    new Date().toLocaleString("en-IN");

  /* ===============================
     DEMO RANDOM (NO HOOKS 🔥)
  =============================== */
  const tags = {
    Low: ["Smooth Movement", "Free Flow", "No Delay Expected"],
    Medium: [
      "Moderate Flow",
      "Balanced Crowd",
      "Slight Delay Possible",
      "Normal Public Movement"
    ],
    High: ["Heavy Congestion", "Peak Crowd Zone", "Delay Expected"]
  };

  const demoLabel =
    tags[crowd][Math.floor(Math.random() * tags[crowd].length)];

  const demoPercent =
    crowd === "Low"
      ? 55 + Math.floor(Math.random() * 15)
      : crowd === "Medium"
      ? 70 + Math.floor(Math.random() * 15)
      : 85 + Math.floor(Math.random() * 10);

  /* ===============================
     PDF DOWNLOAD
  =============================== */
  const handleDownloadPDF = () => {
    setLoading(true);
    const win = window.open("", "_blank");
    if (!win) return setLoading(false);

    win.document.write(`
      <h2>Crowd Prediction Report</h2>
      <p><b>City:</b> ${city}</p>
      <p><b>Location:</b> ${location}</p>
      <p><b>Activity:</b> ${activity}</p>
      <p><b>Crowd:</b> ${crowd} (${demoPercent}%)</p>
      <p><b>Note:</b> ${demoLabel}</p>
      <p>${time}</p>
    `);

    setTimeout(() => {
      win.print();
      win.close();
      setLoading(false);
    }, 300);
  };

  return (
    <section className="result-section" id="results">
      <div className="result-container">
        <div className="result-card">
          <h2 className="result-title">Prediction Results</h2>

          <div className="result-grid">
            <div className="result-item">
              <span className="item-label">City</span>
              <span className="item-value">{city}</span>
            </div>

            <div className="result-item">
              <span className="item-label">Location</span>
              <span className="item-value">{location}</span>
            </div>

            <div className="result-item">
              <span className="item-label">Activity</span>
              <span className="item-value">{activity}</span>
            </div>

            <div className="result-item">
              <span className="item-label">Confidence</span>
              <span className="item-value">{demoPercent}%</span>
            </div>

            <div className="result-item full-width">
              <span className="item-label">Crowd Level</span>
              <span className={`item-value large ${crowd.toLowerCase()}`}>
                {crowd}{" "}
                <small style={{ color: "#6b7280" }}>
                  ({demoLabel})
                </small>
              </span>
            </div>

            {reason && (
              <div className="result-item full-width">
                <span className="item-label">Reason</span>
                <span className="item-value">{reason}</span>
              </div>
            )}

            {recommendation && (
              <div className="result-item full-width">
                <span className="item-label">Recommendation</span>
                <span className="item-value">{recommendation}</span>
              </div>
            )}
          </div>

          <button
            className="download-btn"
            onClick={handleDownloadPDF}
            disabled={loading}
          >
            {loading ? "Generating..." : "📄 Download Report"}
          </button>
        </div>
      </div>
    </section>
  );
}
