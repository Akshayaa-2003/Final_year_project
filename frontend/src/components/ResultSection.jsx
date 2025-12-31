import { useState } from "react";
import "./ResultSection.css";

export default function ResultSection({ result }) {
  const [loading, setLoading] = useState(false);

  const handleDownloadPDF = () => {
    setLoading(true);
    const printWindow = window.open('', '_blank');
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Crowd Prediction Report</title>
        <style>
          body { font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif; margin:0; padding:40px; background:#f8fafc; color:#111827; line-height:1.5; }
          .container { max-width:500px; margin:0 auto; background:white; padding:40px; border-radius:12px; box-shadow:0 10px 40px rgba(0,0,0,0.1); }
          h1 { color:#d32f2f; font-size:24px; font-weight:600; margin-bottom:30px; text-align:center; }
          .details { background:#f8fafc; padding:24px; border-radius:8px; border:1px solid #e5e7eb; margin-bottom:30px; }
          .details p { margin:10px 0; font-size:15px; }
          .crowd-highlight { padding:20px; background:#fef2f2; border-radius:8px; border:1px solid #fecaca; text-align:center; }
          .crowd-level { font-size:28px; font-weight:700; color:#d32f2f; margin:0; }
          .timestamp { color:#6b7280; font-size:13px; margin-top:10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Crowd Prediction Report</h1>
          <div class="details">
            <p><strong>City:</strong> ${result.city}</p>
            <p><strong>Location:</strong> ${result.location}</p>
            <p><strong>Social Activity:</strong> ${result.activity}</p>
            <p><strong>Predicted Level:</strong> ${result.crowdLevel}</p>
          </div>
          <div class="crowd-highlight">
            <div class="crowd-level">${result.crowdLevel} Expected</div>
            <div class="timestamp">Generated ${new Date().toLocaleDateString('en-IN')}</div>
          </div>
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
    }, 300);
  };

  if (!result) return null;

  return (
    <section className="result-section slide-in" id="results">
      <div className="result-container">
        <div className="result-card">
          <h2 className="result-title">Prediction Results</h2>
          
          <div className="result-grid">
            <div className="result-item">
              <span className="item-label">City</span>
              <span className="item-value">{result.city}</span>
            </div>
            <div className="result-item">
              <span className="item-label">Location</span>
              <span className="item-value">{result.location}</span>
            </div>
            <div className="result-item">
              <span className="item-label">Activity</span>
              <span className="item-value">{result.activity}</span>
            </div>
            <div className="result-item full-width">
              <span className="item-label">Crowd Level</span>
              <span className="item-value large">{result.crowdLevel}</span>
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
