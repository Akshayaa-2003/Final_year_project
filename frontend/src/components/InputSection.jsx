import { useEffect, useState } from "react";
import "./InputSection.css";
import { API_BASE_URL } from "../services/api";
import { popularPlaces } from "../data/popularPlaces"; // Import static data

// 🔥 SAFE FETCH HELPER
const safeFetch = async (url, options = {}) => {
  try {
    const res = await fetch(url, {
      mode: "cors",
      ...options
    });

    if (!res.ok) {
      throw new Error(`Request failed: ${res.status}`);
    }

    return res.json();
  } catch (err) {
    console.error("❌ Fetch error:", err.message);
    throw err;
  }
};

export default function InputSection({ onPredict, detectedCity }) {
  const [cities, setCities] = useState([]);
  const [city, setCity] = useState("");
  const [cityError, setCityError] = useState("");

  const [locationTypes, setLocationTypes] = useState([]);
  const [locationType, setLocationType] = useState("");

  const [places, setPlaces] = useState([]);
  const [place, setPlace] = useState("");

  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingLocationTypes, setLoadingLocationTypes] = useState(false);
  const [loadingPlaces, setLoadingPlaces] = useState(false);
  const [predictLoading, setPredictLoading] = useState(false);

  /* ===============================
     LOAD CITIES (FROM LOCAL DATA)
  =============================== */
  useEffect(() => {
    setLoadingCities(true);
    setCityError("");

    try {
      // Get cities from static data
      const cityList = Object.keys(popularPlaces);
      
      if (cityList.length === 0) {
        setCityError("No cities available");
      } else {
        setCities(cityList);
        console.log("✅ Cities loaded:", cityList.length);
      }
    } catch (err) {
      console.error("❌ Cities load failed:", err.message);
      setCityError("Failed to load cities.");
      setCities([]);
    } finally {
      setLoadingCities(false);
    }
  }, []);

  /* ===============================
     AUTO DETECT CITY
  =============================== */
  useEffect(() => {
    if (!detectedCity || cities.length === 0) return;

    const match = cities.find((c) =>
      detectedCity.toLowerCase().includes(c.toLowerCase())
    );

    if (match) {
      setCity(match);
      setCityError("");
    }
  }, [detectedCity, cities]);

  /* ===============================
     GET LOCATION TYPES (FROM LOCAL DATA)
  =============================== */
  useEffect(() => {
    if (!city) {
      setLocationTypes([]);
      setLocationType("");
      return;
    }

    setLoadingLocationTypes(true);
    setLocationTypes([]);
    setLocationType("");
    setPlaces([]);
    setPlace("");

    try {
      // Get types from static data
      const types = Object.keys(popularPlaces[city]).map((key) =>
        key.replaceAll("_", " ")
      );

      setLocationTypes(types);
      console.log(`✅ Location types for ${city}:`, types);
    } catch (err) {
      console.error("❌ Location types failed:", err.message);
      setLocationTypes([]);
    } finally {
      setLoadingLocationTypes(false);
    }
  }, [city]);

  /* ===============================
     GET PLACES (FROM LOCAL DATA)
  =============================== */
  useEffect(() => {
    if (!city || !locationType) {
      setPlaces([]);
      setPlace("");
      return;
    }

    setLoadingPlaces(true);
    setPlaces([]);
    setPlace("");

    try {
      // Convert location type key (spaces to underscores)
      const key = locationType.replaceAll(" ", "_");

      // Get places from static data
      const rawPlaces = popularPlaces[city][key];

      if (Array.isArray(rawPlaces)) {
        const placesList = rawPlaces.map((p) => p.name);
        setPlaces(placesList);
        console.log(`✅ Places for ${city} - ${locationType}:`, placesList);
      } else {
        setPlaces([]);
      }
    } catch (err) {
      console.error("❌ Places fetch failed:", err.message);
      setPlaces([]);
    } finally {
      setLoadingPlaces(false);
    }
  }, [city, locationType]);

  /* ===============================
     PREDICT (STILL USES BACKEND API)
  =============================== */
  const handlePredict = async () => {
    if (!city || !locationType) {
      alert("Please select city and location type");
      return;
    }

    setPredictLoading(true);

    try {
      const payload = {
        city,
        locationType,
        place: place || "General"
      };

      const data = await safeFetch(`${API_BASE_URL}/api/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      onPredict(data);

      // Scroll to results
      setTimeout(() => {
        document.querySelector("#results")?.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }, 300);
    } catch (err) {
      console.error("❌ Prediction failed:", err.message);
      alert("Failed to predict. Please try again.");
    } finally {
      setPredictLoading(false);
    }
  };

  return (
    <section className="input-section" id="predict">
      <div className="input-box">
        <h2 className="section-title">Predict Crowd Level</h2>
        <p className="section-subtitle">
          Select your location details to get crowd predictions
        </p>

        <div className="input-grid">
          {/* CITY */}
          <div className="form-group">
            <label htmlFor="city-select">City</label>
            <select
              id="city-select"
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
                setCityError("");
              }}
              disabled={loadingCities}
              aria-busy={loadingCities}
            >
              <option value="">
                {loadingCities ? "Loading cities..." : "Select city"}
              </option>
              {cities.map((c, i) => (
                <option key={i} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {cityError && <small className="form-error">{cityError}</small>}
          </div>

          {/* LOCATION TYPE */}
          <div className="form-group">
            <label htmlFor="type-select">Location Type</label>
            <select
              id="type-select"
              value={locationType}
              onChange={(e) => setLocationType(e.target.value)}
              disabled={!city || loadingLocationTypes}
              aria-busy={loadingLocationTypes}
            >
              <option value="">
                {loadingLocationTypes
                  ? "Loading..."
                  : city
                  ? "Select location type"
                  : "Choose city first"}
              </option>
              {locationTypes.map((l, i) => (
                <option key={i} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>

          {/* PLACE */}
          <div className="form-group">
            <label htmlFor="place-select">Place (Optional)</label>
            <select
              id="place-select"
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              disabled={!city || !locationType || loadingPlaces}
              aria-busy={loadingPlaces}
            >
              <option value="">
                {loadingPlaces
                  ? "Loading places..."
                  : places.length === 0
                  ? "No places found"
                  : "Select place (optional)"}
              </option>
              {places.map((p, i) => (
                <option key={i} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          className="predict-btn"
          onClick={handlePredict}
          disabled={!city || !locationType || predictLoading}
          aria-busy={predictLoading}
        >
          {predictLoading ? (
            <>
              <span className="spinner"></span>
              Predicting...
            </>
          ) : (
            "Predict Crowd Level"
          )}
        </button>
      </div>
    </section>
  );
}
