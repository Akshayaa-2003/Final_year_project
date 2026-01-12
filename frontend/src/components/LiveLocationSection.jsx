import { useState, useEffect } from "react";
import "./LiveLocationSection.css";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function LiveLocationSection() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [area, setArea] = useState("");
  const [areaType, setAreaType] = useState("");
  const [places, setPlaces] = useState([]);
  const [crowdLevel, setCrowdLevel] = useState("");
  const [accuracy, setAccuracy] = useState(null);

  const [coords, setCoords] = useState(null);

  /* ---------- NORMALIZE PLACES ---------- */
  const normalizePlaces = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (typeof data === "string")
      return data.split(",").map((p) => p.trim());
    if (typeof data === "object")
      return Object.values(data).map((p) =>
        typeof p === "string" ? p : p.name
      );
    return [];
  };

  /* ---------- CALL BACKEND ---------- */
  const fetchCrowdData = async (lat, lng) => {
    const res = await fetch(`${API_BASE_URL}/api/crowd/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lat, lng }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Server error");

    const nearbyPlaces = normalizePlaces(data.places);

    setArea(data.location || "Unknown Area");
    setPlaces(nearbyPlaces);

    /* ---------- HARD SAFETY RULES ---------- */

    // ✅ Area Type
    if (nearbyPlaces.length <= 1) {
      setAreaType("Public Area");
    } else {
      setAreaType(data.areaType || "Public Area");
    }

    // ✅ Crowd Level
    if (nearbyPlaces.length >= 8) {
      setCrowdLevel("HIGH");
    } else if (nearbyPlaces.length >= 4) {
      setCrowdLevel("MEDIUM");
    } else {
      setCrowdLevel("LOW");
    }
  };

  /* ---------- DETECT USER LOCATION ---------- */
  const handleLiveLocation = () => {
    if (!navigator.geolocation) {
      setError("Location services not supported");
      return;
    }

    setLoading(true);
    setError("");
    setArea("");
    setAreaType("");
    setPlaces([]);
    setCrowdLevel("");
    setAccuracy(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;

        // ❌ BAD GPS
        if (accuracy > 200) {
          setError(
            "Low GPS accuracy detected. Please enable GPS and try again."
          );
          setLoading(false);
          return;
        }

        try {
          setAccuracy(Math.round(accuracy));
          setCoords({ lat: latitude, lng: longitude });
          await fetchCrowdData(latitude, longitude);
        } catch (err) {
          console.error(err);
          setError("Unable to fetch live crowd data");
        } finally {
          setLoading(false);
        }
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
    if (!coords || accuracy > 200) return;

    const interval = setInterval(() => {
      fetchCrowdData(coords.lat, coords.lng);
    }, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, [coords, accuracy]);

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

        {area && (
          <div className="results-section">
            {/* AREA */}
            <div className="area-box">
              <span className="label">Your Current Area</span>
              <h3>{area}</h3>

              {accuracy && (
                <p className="accuracy">
                  GPS Accuracy: ±{accuracy} meters
                </p>
              )}

              <p className="area-type">
                Area Type: <strong>{areaType}</strong>
              </p>
            </div>

            {/* PLACES */}
            <div className="places-box">
              <span className="label">Nearby Places</span>
              <div className="places-grid">
                {places.length > 0 ? (
                  places.slice(0, 8).map((place, index) => (
                    <div key={index} className="place-card">
                      📍 {place}
                    </div>
                  ))
                ) : (
                  <div className="place-card">
                    No nearby places found
                  </div>
                )}
              </div>
            </div>

            {/* CROWD */}
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
