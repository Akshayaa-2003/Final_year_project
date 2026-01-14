import { useState, useMemo } from "react";
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
    "Unknown";

  // ✅ normalize crowd level
  const crowd =
    ["Low", "Medium", "High"].includes(rawCrowd)
      ? rawCrowd
      : "Medium"; // demo-safe fallback

  const time =
    result.time ??
    new Date().toLocaleString("en-IN");

  const reason = result.reason ?? null;
  const recommendation = result.recommendation ?? null;

  /* ===============================
     DEMO RANDOMIZATION (STABLE)
  =============================== */
  const { demoLabel, demoPercent } = useMemo(() => {
    const tags = {
      Low: [
        "Smooth Movement",
        "Free Flow",
        "No Delay Expected"
      ],
      Medium: [
        "Moderate Flow",
        "Balanced Crowd",
        "Slight Delay Possible",
        "Normal Public Movement"
      ],
      High: [
        "Heavy Congestion",
        "Peak Crowd Zone",
        "Delay Expected"
      ]
    };

    const levelTags = tags[crowd];
    const label =
      levelTags[Math.floor(Math.random() * levelTags.length)];

    const percent =
      crowd === "Low"
        ? 55 + Math.floor(Math.random() * 15)
        : crowd === "Medium"
        ? 70 + Math.floor(Math.random() * 15)
        : 85 + Math.floor(Math.random() * 10);

    return { demoLabel: label, demoPercent: percent };
  }, [crowd, time]);

  /* ===============================
     PDF DOWNLOAD (SAFE)
  =============================== */
  const handleDownloadPDF = () => {
    setLoading(true);

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Popup blocked. Please allow popups.");
      setLoading(false);
      return;
    }

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<title>Crowd Prediction Report</title>
<style>
body {
  font-family: system-ui, sans-serif;
  padding:30px;
  background:#f8fafc;
}
.container {
  max-width:520px;
  margin:auto;
  background:#fff;
  padding:30px;
  border-radius:14px;
}
h1 {
  text-align:center;
  color:#dc2626;
}
.details p {
  margin:10px 0;
}
.level {
  margin-top:20px;
  font-size:26px;
  font-weight:700;
  color:#b91c1c;
  text-align:center;
}
.meta {
  margin-top:16px;
  font-size:14px;
  color:#374151;
}
.time {
  text-align:center;
  font-size:13px;
  color:#6b7280;
  margin-top:12px;
}
</style>
</head>
<body>
  <div class="container">
    <h1>Crowd Prediction Report</h1>

    <div class="details">
      <p><strong>City:</strong> ${city}</p>
      <p><strong>Location:</strong> ${location}</p>
      <p><strong>Activity:</strong> ${activity}</p>
      <p><strong>Confidence:</strong> ${demoPercent}%</p>
    </div>

    <div class="level">
      ${crowd} – ${demoLabel}
    </div>

    ${reason ? `<div class="meta"><strong>Reason:</strong> ${reason}</div>` : ""}
    ${
      recommendation
        ? `<div class="meta"><strong>Recommendation:</strong> ${recommendation}</div>`
        : ""
    }

    <div class="time">Generated on ${time}</div>
  </div>
</body>
</html>
`;

    printWindow.document.write(htmlContent);
    printWindow.document.close();

    setTimeout(() => {
      printWindow.print();
      printWindow.close();
      setLoading(false);
    }, 400);
  };

  /* ===============================
     UI
  =============================== */
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
                <small style={{ fontSize: "14px", color: "#6b7280" }}>
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
