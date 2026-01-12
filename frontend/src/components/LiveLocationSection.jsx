import { useState, useEffect, useCallback } from "react";
import "./LiveLocationSection.css";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

/* ---------- HELPERS ---------- */

const normalizePlaces = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data.filter(Boolean);
  if (typeof data === "string")
    return data.split(",").map((p) => p.trim()).filter(Boolean);
  return [];
};

const detectAreaType = (places = []) => {
  if (places.length === 0) return "Public Area";

  const text = places.join(" ").toLowerCase();

  if (/hospital|clinic|medical/.test(text)) return "Hospital Area";
  if (/bus|railway|station|metro|airport/.test(text)) return "Transport Area";
  if (/college|school|university/.test(text)) return "Educational Area";
  if (/mall|market|shop|complex/.test(text)) return "Commercial Area";

  return "Public Area";
};

const calculateCrowdLevel = (count) => {
  if (count >= 10) return "HIGH";
  if (count >= 5) return "MEDIUM";
  return "LOW";
};

export default function LiveLocationSection() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [area, setArea] = useState("");
  const [areaType, setAreaType] = useState("");
  const [places, setPlaces] = useState([]);
  const [crowdLevel, setCrowdLevel] = useState("");
  const [accuracy, setAccuracy] = useState(null);
  const [coords, setCoords] = useState(null);

  /* ---------- BACKEND ---------- */
  const fetchCrowdData = useCallback(async (lat, lng) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/crowd/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lat, lng }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      const nearbyPlaces = normalizePlaces(data.places);

      setArea(data.location || "Unknown Area");
      setPlaces(nearbyPlaces);
      setAreaType(detectAreaType(nearbyPlaces));
      setCrowdLevel(calculateCrowdLevel(nearbyPlaces.length));
    } catch (err) {
      console.error(err);
      setError("Unable to fetch live crowd data");
    }
  }, []);

  /* ---------- LOCATION ---------- */
  const handleLiveLocation = () => {
    if (!navigator.geolocation) {
      setError("Location services not supported");
      return;
    }

    setLoading(true);
    setError("");
    setArea("");
    setPlaces([]);
    setCrowdLevel("");
    setAccuracy(null);
    setCoords(null);

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const roundedAccuracy = Math.round(coords.accuracy);
        setAccuracy(roundedAccuracy);

        // 🚫 HARD BLOCK — DO NOT TRUST DESKTOP WIFI
        if (roundedAccuracy > 5000) {
          setError(
            "Location accuracy is too low. Please use mobile GPS for live crowd prediction."
          );
          setLoading(false);
          return;
        }

        const location = {
          lat: coords.latitude,
          lng: coords.longitude,
        };

        setCoords(location);
        await fetchCrowdData(location.lat, location.lng);
        setLoading(false);
      },
      () => {
        setError("Location permission denied");
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0,
      }
    );
  };

  /* ---------- AUTO REFRESH ---------- */
  useEffect(() => {
    if (!coords) return;

    const interval = setInterval(() => {
      fetchCrowdData(coords.lat, coords.lng);
    }, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, [coords, fetchCrowdData]);

  const canShowResults = accuracy !== null && accuracy <= 5000 && area;

  return (
    <section className="live-section">
      <div className="live-card">
        <div className="card-header">
          <h2>Live Crowd Prediction</h2>
          <p className="subtitle">
            Detect your location and estimate nearby crowd
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

        {/* ✅ TRUSTED RESULTS ONLY */}
        {canShowResults && (
          <div className="results-section">
            <div className="area-box">
              <span className="label">Your Current Area</span>
              <h3>{area}</h3>
              <p className="accuracy">
                GPS Accuracy: ±{accuracy} meters
              </p>
              <p className="area-type">
                Area Type: <strong>{areaType}</strong>
              </p>
            </div>

            <div className="places-box">
              <span className="label">Nearby Places</span>
              <div className="places-grid">
                {places.length ? (
                  places.slice(0, 8).map((p, i) => (
                    <div key={i} className="place-card">
                      📍 {p}
                    </div>
                  ))
                ) : (
                  <div className="place-card">
                    No nearby places found
                  </div>
                )}
              </div>
            </div>

            <div className={`crowd-result ${crowdLevel.toLowerCase()}`}>
              <span>Estimated Crowd Level</span>
              <strong>{crowdLevel}</strong>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
