import { useEffect, useState } from "react";
import "./InputSection.css";
import { API_BASE_URL } from "../services/api";

// 🔥 SAFE FETCH HELPER
const safeFetch = async (url, options = {}) => {
  const res = await fetch(url, {
    mode: "cors",
    ...options
  });

  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }

  return res.json();
};

export default function InputSection({ onPredict, detectedCity }) {
  const [cities, setCities] = useState([]);
  const [city, setCity] = useState("");

  const [locationTypes, setLocationTypes] = useState([]);
  const [locationType, setLocationType] = useState("");

  const [places, setPlaces] = useState([]);
  const [place, setPlace] = useState("");

  const [loadingCities, setLoadingCities] = useState(true);
  const [loadingLocationTypes, setLoadingLocationTypes] = useState(false);
  const [loadingPlaces, setLoadingPlaces] = useState(false);

  /* ===============================
     FETCH CITIES
  =============================== */
  useEffect(() => {
    setLoadingCities(true);

    safeFetch(`${API_BASE_URL}/api/places/cities`)
      .then(data => setCities(Array.isArray(data) ? data : []))
      .catch(err => {
        console.error("❌ Cities fetch failed:", err.message);
        setCities([]);
      })
      .finally(() => setLoadingCities(false));
  }, []);

  /* ===============================
     AUTO DETECT CITY
  =============================== */
  useEffect(() => {
    if (!detectedCity || cities.length === 0) return;

    const match = cities.find(c =>
      detectedCity.toLowerCase().includes(c.toLowerCase())
    );

    if (match) setCity(match);
  }, [detectedCity, cities]);

  /* ===============================
     FETCH LOCATION TYPES
  =============================== */
  useEffect(() => {
    if (!city) return;

    setLoadingLocationTypes(true);
    setLocationTypes([]);
    setLocationType("");
    setPlaces([]);
    setPlace("");

    safeFetch(
      `${API_BASE_URL}/api/places/location-types?city=${encodeURIComponent(city)}`
    )
      .then(data => setLocationTypes(Array.isArray(data) ? data : []))
      .catch(err => {
        console.error("❌ Location types failed:", err.message);
        setLocationTypes([]);
      })
      .finally(() => setLoadingLocationTypes(false));
  }, [city]);

  /* ===============================
     FETCH PLACES
  =============================== */
  useEffect(() => {
    if (!city || !locationType) return;

    setLoadingPlaces(true);
    setPlaces([]);
    setPlace("");

    safeFetch(
      `${API_BASE_URL}/api/places?city=${encodeURIComponent(city)}&locationType=${encodeURIComponent(locationType)}`
    )
      .then(data => setPlaces(Array.isArray(data) ? data : []))
      .catch(err => {
        console.error("❌ Places fetch failed:", err.message);
        setPlaces([]);
      })
      .finally(() => setLoadingPlaces(false));
  }, [city, locationType]);

  /* ===============================
     PREDICT
  =============================== */
  const handlePredict = async () => {
    try {
      const payload = {
        city,
        locationType,
        place: place || "Not specified"
      };

      const data = await safeFetch(
        `${API_BASE_URL}/api/predict`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        }
      );

      onPredict(data);

      document
        .querySelector("#results")
        ?.scrollIntoView({ behavior: "smooth" });
    } catch (err) {
      console.error("❌ Prediction failed:", err.message);
      alert("Prediction service temporarily unavailable. Try again.");
    }
  };

  return (
    <section className="input-section" id="predict">
      <div className="input-box">
        <h2 className="section-title">Predict Crowd Level</h2>

        <div className="input-grid">
          {/* CITY */}
          <div className="form-group">
            <label>City</label>
            <select
              value={city}
              onChange={e => setCity(e.target.value)}
              disabled={loadingCities}
            >
              <option value="">
                {loadingCities ? "Loading cities..." : "Select city"}
              </option>
              {cities.map((c, i) => (
                <option key={i} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* LOCATION TYPE */}
          <div className="form-group">
            <label>Location Type</label>
            <select
              value={locationType}
              onChange={e => setLocationType(e.target.value)}
              disabled={!city || loadingLocationTypes}
            >
              <option value="">
                {loadingLocationTypes ? "Loading..." : "Select location type"}
              </option>
              {locationTypes.map((l, i) => (
                <option key={i} value={l}>{l}</option>
              ))}
            </select>
          </div>

          {/* PLACE */}
          <div className="form-group">
            <label>Place</label>
            <select
              value={place}
              onChange={e => setPlace(e.target.value)}
              disabled={!city || !locationType || loadingPlaces}
            >
              <option value="">
                {loadingPlaces
                  ? "Loading places..."
                  : places.length === 0
                  ? "No places found"
                  : "Select place"}
              </option>
              {places.map((p, i) => (
                <option key={i} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          className="predict-btn"
          onClick={handlePredict}
          disabled={!city || !locationType}
        >
          Predict Crowd Level
        </button>
      </div>
    </section>
  );
}
