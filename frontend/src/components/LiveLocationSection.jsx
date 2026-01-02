import { useState } from "react";
import "./LiveLocationSection.css";
import { API_BASE_URL } from "../services/api";
import { predictCrowdFromPlaces } from "../utils/staticCrowdLogic";

export default function LiveLocationSection() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [area, setArea] = useState("");
  const [places, setPlaces] = useState([]);
  const [crowdLevel, setCrowdLevel] = useState("");

  const handleLiveLocation = () => {
    if (!navigator.geolocation) {
      setError("Location services are not available on your device.");
      return;
    }

    setLoading(true);
    setError("");
    setArea("");
    setPlaces([]);
    setCrowdLevel("");

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;

          /* STEP 1: Get Area Name */
          const geoRes = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
            { headers: { "User-Agent": "crowd-prediction-app" } }
          );
          const geo = await geoRes.json();

          const areaName =
            geo.address?.suburb ||
            geo.address?.neighbourhood ||
            geo.address?.city ||
            "Current Area";

          setArea(areaName);

          /* STEP 2: Fetch Nearby Places */
          let nearbyPlaces = [];
          try {
            const res = await fetch(`${API_BASE_URL}/api/location/nearby`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ lat: latitude, lng: longitude })
            });

            if (res.ok) {
              const data = await res.json();
              nearbyPlaces = Array.isArray(data.nearbyPlaces)
                ? data.nearbyPlaces.slice(0, 6)
                : [];
            }
          } catch (err) {
            console.error("Nearby places fetch failed:", err);
          }

          setPlaces(nearbyPlaces);
        } catch (err) {
          setError(
            "Location detected, but unable to fetch nearby places. Please try again."
          );
          console.error("Location error:", err);
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError("Location permission denied. Enable location access to continue.");
        setLoading(false);
      }
    );
  };

  const handlePredictCrowd = () => {
    if (places.length === 0) return;
    const level = predictCrowdFromPlaces(places);
    setCrowdLevel(level);
  };

  return (
    <section className="live-section">
      <div className="live-card">
        {/* HEADER */}
        <div className="card-header">
          <h2>Live Crowd Prediction</h2>
          <p className="subtitle">
            Detect your location and predict crowd levels at nearby public places
          </p>
        </div>

        {/* LOCATION DETECTION */}
        <button
          className="live-btn"
          onClick={handleLiveLocation}
          disabled={loading}
          aria-busy={loading}
        >
          {loading ? (
            <>
              <span className="spinner"></span>
              Detecting location...
            </>
          ) : (
            "Detect My Location"
          )}
        </button>

        {error && (
          <div className="error-box" role="alert">
            <span className="error-icon">!</span>
            <p className="error-text">{error}</p>
          </div>
        )}

        {/* DETECTED AREA */}
        {area && (
          <div className="results-section">
            {/* Area Box */}
            <div className="area-box">
              <span className="label">Detected Area</span>
              <h3 className="area-name">{area}</h3>
            </div>

            {/* Places Box */}
            <div className="places-box">
              <span className="label">Nearby Public Places</span>

              {places.length > 0 ? (
                <div className="places-grid">
                  {places.map((place, idx) => (
                    <div key={idx} className="place-card">
                      <span className="place-name">{place}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <p className="hint">No public places detected nearby</p>
                </div>
              )}
            </div>

            {/* Predict Button */}
            <button
              className="predict-btn"
              onClick={handlePredictCrowd}
              disabled={places.length === 0}
            >
              Predict Crowd Level
            </button>

            {/* Crowd Result */}
            {crowdLevel && (
              <div className={`crowd-result crowd-result--${crowdLevel.toLowerCase()}`}>
                <span className="result-label">Estimated Crowd Level</span>
                <span className="result-value">{crowdLevel}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
