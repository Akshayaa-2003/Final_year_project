import { useEffect, useState } from "react";
import "./InputSection.css";
import { popularPlaces } from "../data/popularPlaces";

/* ===============================
   SMART STATIC CROWD PREDICTION
   (Mixed Result – Demo Friendly)
================================ */
const predictCrowdLevel = ({ city, locationType, place }) => {
  let score = 0;
  const type = locationType.toLowerCase();

  if (city) score += 1;

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

  let crowdLevel = "Low";
  let confidence = 65;
  let reason = "Low public movement observed";
  let recommendation = "Comfortable visit, no congestion expected";

  if (score <= 2) {
    crowdLevel = "Low";
    confidence = 65;
    reason = "Minimal activity in this area";
    recommendation = "Best time to travel comfortably";
  } else if (score <= 4) {
    crowdLevel = "Medium";
    confidence = 78;
    reason = "Routine activity with moderate public presence";
    recommendation = "Plan with small buffer time";
  } else {
    crowdLevel = "High";
    confidence = 90;
    reason = "Peak activity zone with heavy public movement";
    recommendation = "Avoid peak hours if possible";
  }

  return {
    crowdLevel,
    confidence,
    reason,
    recommendation
  };
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

  /* LOAD CITIES */
  useEffect(() => {
    setLoadingCities(true);
    try {
      const cityList = Object.keys(popularPlaces);
      setCities(cityList);
    } catch {
      setCityError("Failed to load cities");
    } finally {
      setLoadingCities(false);
    }
  }, []);

  /* AUTO DETECT CITY */
  useEffect(() => {
    if (!detectedCity || cities.length === 0) return;
    const match = cities.find((c) =>
      detectedCity.toLowerCase().includes(c.toLowerCase())
    );
    if (match) setCity(match);
  }, [detectedCity, cities]);

  /* LOAD LOCATION TYPES */
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
      const types = Object.keys(popularPlaces[city]).map((k) =>
        k.replaceAll("_", " ")
      );
      setLocationTypes(types);
    } finally {
      setLoadingLocationTypes(false);
    }
  }, [city]);

  /* LOAD PLACES */
  useEffect(() => {
    if (!city || !locationType) {
      setPlaces([]);
      setPlace("");
      return;
    }

    setLoadingPlaces(true);
    try {
      const key = locationType.replaceAll(" ", "_");
      const raw = popularPlaces[city][key];
      setPlaces(Array.isArray(raw) ? raw.map((p) => p.name) : []);
    } finally {
      setLoadingPlaces(false);
    }
  }, [city, locationType]);

  /* PREDICT */
  const handlePredict = () => {
    if (!city || !locationType) return;

    setPredictLoading(true);

    const payload = {
      city,
      locationType,
      place: place || "General"
    };

    const mixed = predictCrowdLevel(payload);

    const result = {
      ...payload,
      ...mixed,
      time: new Date().toLocaleString("en-IN")
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
          <div className="form-group">
            <label>City</label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              disabled={loadingCities}
            >
              <option value="">
                {loadingCities ? "Loading..." : "Select city"}
              </option>
              {cities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            {cityError && <small className="form-error">{cityError}</small>}
          </div>

          <div className="form-group">
            <label>Location Type</label>
            <select
              value={locationType}
              onChange={(e) => setLocationType(e.target.value)}
              disabled={!city || loadingLocationTypes}
            >
              <option value="">
                {!city ? "Choose city first" : "Select location type"}
              </option>
              {locationTypes.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Place (Optional)</label>
            <select
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              disabled={!locationType || loadingPlaces}
            >
              <option value="">Select place</option>
              {places.map((p) => (
                <option key={p} value={p}>{p}</option>
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
