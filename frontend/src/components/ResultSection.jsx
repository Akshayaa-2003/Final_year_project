import "./ResultSection.css";

export default function ResultSection({ result }) {
  // ❌ No hooks
  // ❌ No early hook return
  // ✅ Pure static component

  if (!result || typeof result !== "object") return null;

  /* ===============================
     SAFE FIELD NORMALIZATION
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

  const crowd = ["Low", "Medium", "High"].includes(rawCrowd)
    ? rawCrowd
    : "Medium";

  const reason = result.reason ?? null;
  const recommendation = result.recommendation ?? null;

  const time =
    result.time ?? new Date().toLocaleString("en-IN");

  /* ===============================
     STATIC DEMO VALUES (NO RANDOM)
  =============================== */
  const DEMO_MAP = {
    Low: { label: "Smooth Movement", confidence: 65 },
    Medium: { label: "Balanced Crowd", confidence: 78 },
    High: { label: "Heavy Congestion", confidence: 92 }
  };

  const { label, confidence } = DEMO_MAP[crowd];

  /* ===============================
     PDF DOWNLOAD (STATIC)
  =============================== */
  const handleDownloadPDF = () => {
    const win = window.open("", "_blank");
    if (!win) {
      alert("Popup blocked. Please allow popups.");
      return;
    }

    win.document.write(`
      <html>
        <head>
          <title>Crowd Prediction Report</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 24px;
            }
            h2 {
              color: #dc2626;
            }
            p {
              font-size: 14px;
              margin: 6px 0;
            }
          </style>
        </head>
        <body>
          <h2>Crowd Prediction Report</h2>
          <p><b>City:</b> ${city}</p>
          <p><b>Location:</b> ${location}</p>
          <p><b>Activity:</b> ${activity}</p>
          <p><b>Crowd Level:</b> ${crowd} (${confidence}%)</p>
          <p><b>Note:</b> ${label}</p>
          ${reason ? `<p><b>Reason:</b> ${reason}</p>` : ""}
          ${recommendation ? `<p><b>Recommendation:</b> ${recommendation}</p>` : ""}
          <p style="margin-top:12px;color:#6b7280">${time}</p>
        </body>
      </html>
    `);

    win.document.close();
    win.print();
    win.close();
  };

  return (
    <section className="result-section" id="results">
      <div className="result-container">
        <div className="result-card">
          <h2 className="result-title">Prediction Results</h2>

          <div className="result-grid">
            <ResultItem label="City" value={city} />
            <ResultItem label="Location" value={location} />
            <ResultItem label="Activity" value={activity} />
            <ResultItem label="Confidence" value={`${confidence}%`} />

            <div className="result-item full-width">
              <span className="item-label">Crowd Level</span>
              <span className={`item-value large ${crowd.toLowerCase()}`}>
                {crowd}
                <small className="item-sub">({label})</small>
              </span>
            </div>

            {reason && (
              <ResultItem full label="Reason" value={reason} />
            )}

            {recommendation && (
              <ResultItem
                full
                label="Recommendation"
                value={recommendation}
              />
            )}
          </div>

          <button
            className="download-btn"
            onClick={handleDownloadPDF}
          >
            📄 Download Report
          </button>
        </div>
      </div>
    </section>
  );
}

/* ===============================
   PURE SUB COMPONENT
================================ */
function ResultItem({ label, value, full }) {
  return (
    <div className={`result-item ${full ? "full-width" : ""}`}>
      <span className="item-label">{label}</span>
      <span className="item-value">{value}</span>
    </div>
  );
}
