import { useEffect, useState } from "react";
import "./InputSection.css";
import { popularPlaces } from "../data/popularPlaces";

/* ===============================
   STATIC CROWD PREDICTION LOGIC
   (College Demo Friendly)
================================ */
const predictCrowdLevel = ({ city, locationType, place }) => {
  let score = 0;

  if (city) score += 1;

  const type = locationType.toLowerCase();

  if (
    type.includes("bus") ||
    type.includes("railway") ||
    type.includes("market")
  ) {
    score += 3;
  } else if (
    type.includes("mall") ||
    type.includes("hospital")
  ) {
    score += 2;
  } else {
    score += 1;
  }

  if (place && place !== "General") score += 1;

  if (score <= 2) return "Low";
  if (score <= 4) return "Medium";
  return "High";
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
     LOAD CITIES (STATIC DATA)
  =============================== */
  useEffect(() => {
    setLoadingCities(true);
    setCityError("");

    try {
      const cityList = Object.keys(popularPlaces);

      if (cityList.length === 0) {
        setCityError("No cities available");
      } else {
        setCities(cityList);
        console.log("✅ Cities loaded:", cityList.length);
      }
    } catch (err) {
      console.error("❌ Cities load failed:", err.message);
      setCityError("Failed to load cities");
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
     LOAD LOCATION TYPES
  =============================== */
  useEffect(() => {
    if (!city) {
      setLocationTypes([]);
      setLocationType("");
      setPlaces([]);
      setPlace("");
      return;
    }

    setLoadingLocationTypes(true);

    try {
      const types = Object.keys(popularPlaces[city]).map((key) =>
        key.replaceAll("_", " ")
      );
      setLocationTypes(types);
    } catch (err) {
      console.error("❌ Location types failed:", err.message);
      setLocationTypes([]);
    } finally {
      setLoadingLocationTypes(false);
    }
  }, [city]);

  /* ===============================
     LOAD PLACES
  =============================== */
  useEffect(() => {
    if (!city || !locationType) {
      setPlaces([]);
      setPlace("");
      return;
    }

    setLoadingPlaces(true);

    try {
      const key = locationType.replaceAll(" ", "_");
      const rawPlaces = popularPlaces[city][key];

      if (Array.isArray(rawPlaces)) {
        setPlaces(rawPlaces.map((p) => p.name));
      } else {
        setPlaces([]);
      }
    } catch (err) {
      console.error("❌ Places load failed:", err.message);
      setPlaces([]);
    } finally {
      setLoadingPlaces(false);
    }
  }, [city, locationType]);

  /* ===============================
     PREDICT (STATIC – NO API)
  =============================== */
  const handlePredict = () => {
    if (!city || !locationType) {
      alert("Please select city and location type");
      return;
    }

    setPredictLoading(true);

    const payload = {
      city,
      locationType,
      place: place || "General"
    };

    const level = predictCrowdLevel(payload);

    const result = {
      ...payload,
      crowdLevel: level,
      time: new Date().toLocaleTimeString()
    };

    onPredict(result);

    setTimeout(() => {
      document.querySelector("#results")?.scrollIntoView({
        behavior: "smooth"
      });
    }, 300);

    setPredictLoading(false);
  };

  return (
    <section className="input-section" id="predict">
      <div className="input-box">
        <h2 className="section-title">Predict Crowd Level</h2>
        <p className="section-subtitle">
          Select your location details to estimate crowd density
        </p>

        <div className="input-grid">
          {/* CITY */}
          <div className="form-group">
            <label>City</label>
            <select
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
                setCityError("");
              }}
              disabled={loadingCities}
            >
              <option value="">
                {loadingCities ? "Loading..." : "Select city"}
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
            <label>Location Type</label>
            <select
              value={locationType}
              onChange={(e) => setLocationType(e.target.value)}
              disabled={!city || loadingLocationTypes}
            >
              <option value="">
                {!city
                  ? "Choose city first"
                  : loadingLocationTypes
                  ? "Loading..."
                  : "Select location type"}
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
            <label>Place (Optional)</label>
            <select
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              disabled={!city || !locationType || loadingPlaces}
            >
              <option value="">
                {loadingPlaces
                  ? "Loading..."
                  : places.length === 0
                  ? "No places found"
                  : "Select place"}
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
        >
          {predictLoading ? "Predicting..." : "Predict Crowd Level"}
        </button>
      </div>
    </section>
  );
}
