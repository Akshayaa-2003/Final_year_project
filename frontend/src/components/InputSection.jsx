import { useState } from "react";
import "./InputSection.css";

export default function InputSection({ onPredict }) {
  const cityLocations = {
    Chennai: ["T Nagar", "Marina Beach", "Egmore"],
    Bangalore: ["MG Road", "Majestic", "Whitefield"],
    Hyderabad: ["Charminar", "Hitech City", "Secunderabad"],
  };

  const [city, setCity] = useState("");
  const [location, setLocation] = useState("");
  const [activity, setActivity] = useState("");

  const handlePredict = () => {
    onPredict({
      city,
      location,
      activity,
      crowdLevel: "Medium",
    });

    setTimeout(() => {
      document.querySelector(".result-section")?.scrollIntoView({
        behavior: "smooth",
      });
    }, 100);
  };

  return (
    <section className="input-section" id="predict">
      <div className="input-container">
        <div className="input-box">
          <h2 className="section-title">Predict Crowd Level</h2>

          <div className="input-grid">
            <div className="form-group">
              <label>City</label>
              <select
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                  setLocation("");
                }}
              >
                <option value="">Select city</option>
                {Object.keys(cityLocations).map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Location</label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                disabled={!city}
              >
                <option value="">Select location</option>
                {city &&
                  cityLocations[city].map((loc) => (
                    <option key={loc}>{loc}</option>
                  ))}
              </select>
            </div>

            <div className="form-group">
              <label>Social Media Activity</label>
              <select
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
              >
                <option value="">Select level</option>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>
          </div>

          <button
            className="predict-btn"
            onClick={handlePredict}
            disabled={!city || !location || !activity}
          >
            Predict Now
          </button>
        </div>
      </div>
    </section>
  );
}
