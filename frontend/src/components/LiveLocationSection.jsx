import { useState } from "react";
import "./LiveLocationSection.css";
import { API_BASE_URL } from "../services/api";

export default function LiveLocationSection() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [area, setArea] = useState("");
  const [places, setPlaces] = useState([]);
  const [crowdNow, setCrowdNow] = useState("");
  const [crowdLater, setCrowdLater] = useState("");

  /* ===============================
     SIMPLE CROWD LOGIC (REALISTIC)
  =============================== */
  const getCrowdLevel = (hour) => {
    if ((hour >= 8 && hour <= 10) || (hour >= 17 && hour <= 20)) {
      return "High";
    }
    if (hour >= 11 && hour <= 16) {
      return "Medium";
    }
    return "Low";
  };

  const handleLiveLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported on this device");
      return;
    }

    setLoading(true);
    setError("");
    setArea("");
    setPlaces([]);
    setCrowdNow("");
    setCrowdLater("");

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;

          /* ===============================
             1️⃣ REVERSE GEOCODE (AREA FIRST)
          =============================== */
          const geoRes = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
            {
              headers: {
                "User-Agent": "crowd-prediction-app"
              }
            }
          );

          if (!geoRes.ok) throw new Error("Geo failed");

          const geo = await geoRes.json();

          const detectedArea =
            geo.address?.suburb ||
            geo.address?.neighbourhood ||
            geo.address?.city_district ||
            geo.address?.city ||
            geo.address?.town ||
            geo.address?.village ||
            "Nearby Area";

          setArea(detectedArea);

          /* ===============================
             2️⃣ NEARBY PLACES (BACKEND)
          =============================== */
          const placeRes = await fetch(
            `${API_BASE_URL}/api/location/nearby`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                lat: latitude,
                lng: longitude
              })
            }
          );

          if (!placeRes.ok) throw new Error("Places failed");

          const placeData = await placeRes.json();

          setPlaces(
            Array.isArray(placeData.nearbyPlaces)
              ? placeData.nearbyPlaces.slice(0, 4)
              : []
          );

          /* ===============================
             3️⃣ CROWD PREDICTION
          =============================== */
          const nowHour = new Date().getHours();
          setCrowdNow(getCrowdLevel(nowHour));
          setCrowdLater(getCrowdLevel((nowHour + 1) % 24));

        } catch (err) {
          console.error(err);
          setError("Unable to detect nearby data");
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
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  return (
    <section className="live-section">
      <div className="live-layout">

        {/* 🔵 LEFT – PROCESS */}
        <div className="live-left">
          <h2>Live Location Detection</h2>

          <ol className="live-steps">
            <li className={area ? "done" : ""}>Detecting area</li>
            <li className={places.length ? "done" : ""}>Finding nearby places</li>
            <li className={crowdNow ? "done" : ""}>Predicting crowd</li>
          </ol>

          <button
            className="live-btn"
            onClick={handleLiveLocation}
            disabled={loading}
          >
            {loading ? "Detecting..." : "📍 Detect My Location"}
          </button>

          {error && <p className="live-error">{error}</p>}
        </div>

        {/* 🟢 RIGHT – RESULT */}
        <div className="live-right">
          {!area && !loading && (
            <p className="hint">Results will appear here</p>
          )}

          {area && (
            <>
              <h3>📍 {area}</h3>

              <div className="places-box">
                <h4>Nearby Places</h4>
                {places.length > 0 ? (
                  <ul>
                    {places.map((p, i) => (
                      <li key={`${p}-${i}`}>{p}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="hint">No nearby places found</p>
                )}
              </div>

              <div className="crowd-box">
                <p>
                  <strong>Now:</strong>
                  <span className={`crowd ${crowdNow.toLowerCase()}`}>
                    {" "}{crowdNow}
                  </span>
                </p>
                <p>
                  <strong>After 1 hour:</strong>
                  <span className={`crowd ${crowdLater.toLowerCase()}`}>
                    {" "}{crowdLater}
                  </span>
                </p>
              </div>
            </>
          )}
        </div>

      </div>
    </section>
  );
}
