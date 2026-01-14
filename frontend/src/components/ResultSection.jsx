import { useState } from "react";
import "./ResultSection.css";

export default function ResultSection({ result }) {
  const [loading, setLoading] = useState(false);

  if (!result || typeof result !== "object") return null;

  /* ===============================
     SAFE FIELD MAPPING (OLD + NEW)
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

  const crowd =
    result.finalCrowd ??
    result.crowdLevel ??
    "Unknown";

  const confidence =
    result.confidence ?? null;

  const reason =
    result.reason ?? null;

  const recommendation =
    result.recommendation ?? null;

  const time =
    result.time ??
    new Date().toLocaleString("en-IN");

  /* ===============================
     PDF DOWNLOAD (SAFE + MIXED)
  =============================== */
  const handleDownloadPDF = () => {
    setLoading(true);

    const printWindow = window.open("", "_blank");

    if (!printWindow) {
      alert("Popup blocked. Please allow popups to download the report.");
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
  font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
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
      ${
        confidence
          ? `<p><strong>Confidence:</strong> ${confidence}%</p>`
          : ""
      }
    </div>

    <div class="level">${crowd} Crowd Expected</div>

    ${
      reason
        ? `<div class="meta"><strong>Reason:</strong> ${reason}</div>`
        : ""
    }

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

            {confidence && (
              <div className="result-item">
                <span className="item-label">Confidence</span>
                <span className="item-value">{confidence}%</span>
              </div>
            )}

            <div className="result-item full-width">
              <span className="item-label">Crowd Level</span>
              <span className={`item-value large ${crowd.toLowerCase()}`}>
                {crowd}
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
