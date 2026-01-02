import "../styles/page.css";
import "../styles/crowdHistory.css";

export default function CrowdHistory({ history, onClear }) {
  return (
    <div className="page-container">
      <div className="history-header">
        <div>
          <h1>Crowd History</h1>
          <p>Live crowd predictions from this session.</p>
        </div>

        {history && history.length > 0 && (
          <button
            className="clear-history-btn"
            onClick={onClear}
          >
            Clear History
          </button>
        )}
      </div>

      {!history || history.length === 0 ? (
        <div className="history-empty">
          <p>No predictions yet</p>
          <span>Run a prediction to start tracking data.</span>
        </div>
      ) : (
        <div className="history-list">
          {history.map((item, index) => (
            <div className="history-item" key={index}>
              <div className="history-left">
                <h4>{item.city || "Unknown Location"}</h4>
                <span className="history-time">{item.time}</span>
              </div>

              <div className="history-right">
                <span
                  className={`history-level ${
                    item.level?.toLowerCase() || "low"
                  }`}
                >
                  {item.level || "N/A"}
                </span>
                <span className="history-percent">
                  {typeof item.percentage === "number"
                    ? `${item.percentage}%`
                    : "--"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
