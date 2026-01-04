import { useState } from "react";
import "./LiveLocationSection.css";
import { STATIC_PLACES } from "../utils/staticPlaces";
import { predictCrowdFromPlaces } from "../utils/staticCrowdLogic";

export default function LiveLocationSection() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [area, setArea] = useState("");
  const [places, setPlaces] = useState([]);
  const [crowdLevel, setCrowdLevel] = useState("");

  const handleLiveLocation = () => {
    if (!navigator.geolocation) {
      setError("Location services are not supported");
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

          // 🔹 GET AREA NAME (OPENSTREETMAP)
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
            { headers: { "User-Agent": "crowd-prediction-app" } }
          );

          const data = await res.json();
          const areaName =
            data.address?.suburb ||
            data.address?.city ||
            data.address?.town ||
            "Your Area";

          setArea(areaName);

          // 🔹 STATIC PLACES (DEMO PURPOSE)
          const demoPlaces = STATIC_PLACES.slice(
            0,
            Math.floor(Math.random() * STATIC_PLACES.length) + 2
          );

          setPlaces(demoPlaces);
        } catch (err) {
          setError("Unable to detect area. Please try again.");
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError("Location permission denied");
        setLoading(false);
      }
    );
  };

  const handlePredictCrowd = () => {
    const level = predictCrowdFromPlaces(places);
    setCrowdLevel(level);
  };

  return (
    <section className="live-section">
      <div className="live-card">
        <div className="card-header">
          <h2>Live Crowd Prediction</h2>
          <p className="subtitle">
            Detect your location and estimate crowd level nearby
          </p>
        </div>

        <button
          className="live-btn"
          onClick={handleLiveLocation}
          disabled={loading}
        >
          {loading ? "Detecting..." : "Detect My Location"}
        </button>

        {error && <div className="error-box">{error}</div>}

        {area && (
          <div className="results-section">
            <div className="area-box">
              <span className="label">Detected Area</span>
              <h3>{area}</h3>
            </div>

            <div className="places-box">
              <span className="label">Nearby Public Places</span>
              <div className="places-grid">
                {places.map((p, i) => (
                  <div key={i} className="place-card">
                    {p}
                  </div>
                ))}
              </div>
            </div>

            <button
              className="predict-btn"
              onClick={handlePredictCrowd}
            >
              Predict Crowd Level
            </button>

            {crowdLevel && (
              <div className={`crowd-result ${crowdLevel.toLowerCase()}`}>
                <span>Estimated Crowd Level</span>
                <strong>{crowdLevel}</strong>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
