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
    "Normal";

  const crowd =
    result.finalCrowd ??
    result.crowdLevel ??
    "Unknown";

  const time =
    result.time ??
    new Date().toLocaleString("en-IN");

  /* ===============================
     PDF DOWNLOAD (SAFE)
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
      margin:0;
      padding:40px;
      background:#f8fafc;
      color:#111827;
    }
    .container {
      max-width:520px;
      margin:auto;
      background:#ffffff;
      padding:40px;
      border-radius:14px;
      box-shadow:0 12px 40px rgba(0,0,0,0.12);
    }
    h1 {
      text-align:center;
      color:#d32f2f;
      margin-bottom:30px;
    }
    .details {
      background:#f9fafb;
      padding:24px;
      border-radius:10px;
      border:1px solid #e5e7eb;
    }
    .details p {
      margin:10px 0;
      font-size:15px;
    }
    .highlight {
      margin-top:28px;
      padding:24px;
      text-align:center;
      background:#fef2f2;
      border-radius:10px;
      border:1px solid #fecaca;
    }
    .level {
      font-size:28px;
      font-weight:700;
      color:#b91c1c;
    }
    .time {
      margin-top:8px;
      font-size:13px;
      color:#6b7280;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Crowd Prediction Report</h1>

    <div class="details">
      <p><strong>City:</strong> ${city}</p>
      <p><strong>Location:</strong> ${location}</p>
      <p><strong>Activity Level:</strong> ${activity}</p>
    </div>

    <div class="highlight">
      <div class="level">${crowd} Crowd Expected</div>
      <div class="time">Generated on ${time}</div>
    </div>
  </div>
</body>
</html>
`;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();

    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
      setLoading(false);
    }, 400);
  };

  return (
    <section className="result-section slide-in" id="results">
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

            <div className="result-item full-width">
              <span className="item-label">Crowd Level</span>
              <span className="item-value large">{crowd}</span>
            </div>
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
