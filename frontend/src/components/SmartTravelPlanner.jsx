import { useState, useEffect } from "react";
import "./SmartTravelPlanner.css";

/* ===============================
   ALL TAMIL NADU DISTRICTS
================================ */
const CITY_PLACES = {
  Chennai: [
    "CMBT",
    "Koyambedu",
    "Guindy",
    "T. Nagar",
    "Marina Beach",
    "Parrys",
    "Adyar",
    "Velachery",
    "Mylapore",
    "Egmore"
  ],
  Coimbatore: [
    "Gandhipuram",
    "Ukkadam",
    "RS Puram",
    "Peelamedu",
    "Singanallur",
    "Saravanampatti",
    "Podanur",
    "Kovaipudur",
    "Sivananda Colony",
    "Trinity Circle"
  ],
  Madurai: [
    "Periyar Bus Stand",
    "Mattuthavani",
    "Anna Nagar",
    "Thirunagar",
    "Yanaikkal",
    "Vilangudi",
    "Simmakkal",
    "Alanganallur"
  ],
  Trichy: [
    "Chatram Bus Stand",
    "Srirangam",
    "Thillai Nagar",
    "Cantonment",
    "K.K. Nagar",
    "Puthur",
    "BHEL",
    "Golden Rock"
  ],
  Salem: [
    "New Bus Stand",
    "Old Bus Stand",
    "Hasthampatti",
    "Fairlands",
    "Sankagiri Road"
  ],
  Thanjavur: [
    "Bus Stand",
    "Main Market",
    "College Road",
    "Thanjavur Junction"
  ],
  Tirunelveli: [
    "Palayamkottai",
    "Junction",
    "Railway Station",
    "Tirunelveli Town"
  ],
  Erode: ["Clock Tower", "Central Bus Stand", "Brough Road"],
  Dindigul: ["Bus Stand", "Railway Junction", "Temple Road"],
  Kanyakumari: [
    "Nagercoil Bus Stand",
    "Kanyakumari Beach",
    "Railway Station"
  ],
  "The Nilgiris": ["Ooty Bus Stand", "Coonoor", "Kotagiri"],
  Vellore: [
    "Katpadi",
    "Vellore Bus Stand",
    "Villivakkam",
    "Walajah Road",
    "Sathuvachari",
    "Gandhi Road"
  ],
  Tiruppur: [
    "Town Bus Stand",
    "Railway Station",
    "Market",
    "Industrial Area",
    "Avinashi Road",
    "Kangeyam Road",
    "Nallur"
  ],
  Cuddalore: [
    "Bus Stand",
    "Railway Station",
    "Town Area",
    "Market",
    "Kattumannarkoil",
    "Veerampattinam",
    "Panruti"
  ],
  Nagapattinam: [
    "Bus Stand",
    "Railway Station",
    "Beach Road",
    "Town Area",
    "Keezhvelur",
    "Thirupoondi",
    "Vedaranyam"
  ],
  Villupuram: [
    "Bus Stand",
    "Railway Station",
    "Market",
    "Temple Area",
    "Tindivanam",
    "Melmalayanur",
    "Thiruvennainallur"
  ],
  Thoothukudi: [
    "V.O.C Bus Stand",
    "Railway Station",
    "Town Area",
    "Beach Road",
    "Therespuram",
    "Kayathar",
    "Sattankulam"
  ],
  Tiruvallur: [
    "Ponneri",
    "Tiruvallur Bus Stand",
    "Railway Station",
    "Market",
    "Gummidipoondi",
    "Avadi",
    "Thiruninravur"
  ],
  Karur: [
    "Bus Stand",
    "Railway Station",
    "Town Area",
    "Industrial Area",
    "K. Paramathi",
    "Kadavur",
    "Krishnarayapuram"
  ],
  Namakkal: [
    "Bus Stand",
    "Railway Station",
    "Market",
    "Town Area",
    "Kumarapalayam",
    "Rasipuram",
    "Velur"
  ],
  Ramanathapuram: [
    "Bus Stand",
    "Railway Station",
    "Market",
    "Temple Area",
    "Paramakudi",
    "Mudukulathur",
    "Rameswaram"
  ],
  Sivaganga: [
    "Bus Stand",
    "Railway Station",
    "Town Market",
    "Temple Area",
    "Karaikudi",
    "Devakottai",
    "Manamadurai"
  ],
  Theni: [
    "Bus Stand",
    "Railway Station",
    "Town Area",
    "Market",
    "Periyakulam",
    "Bodinayakanur",
    "Uthamapalayam"
  ],
  Kanchipuram: [
    "Temple Area",
    "Bus Stand",
    "Market Street",
    "Railway Station",
    "Thirupachur",
    "Walajabad",
    "Uthiramerur"
  ],
  Thiruvannamalai: [
    "Main Bus Stand",
    "Railway Station",
    "Temple Area",
    "Market",
    "Annamalai Nagar",
    "Melathikkan",
    "Chengam Road"
  ],
  Tiruppattur: [
    "Bus Stand",
    "Railway Station",
    "Town Area",
    "Market",
    "Vaniyambadi",
    "Ambur",
    "Natrampalli"
  ],
  Tenkasi: [
    "Bus Stand",
    "Railway Station",
    "Market",
    "Temple Area",
    "Shenkottai",
    "Alangulam",
    "Kadayanallur"
  ],
  Ariyalur: [
    "Bus Stand",
    "Railway Station",
    "Market",
    "Town Area",
    "Jayankondam",
    "Udayarpalayam",
    "Sendurai"
  ],
  Mayiladuthurai: [
    "Bus Stand",
    "Railway Station",
    "Temple Area",
    "Market",
    "Sirkali",
    "Kuthalam",
    "Kottur"
  ],
  Krishnagiri: [
    "Bus Stand",
    "Railway Station",
    "Market",
    "Town Area",
    "Hosur",
    "Pochampalli",
    "Uthangarai"
  ],
  Perambalur: [
    "Bus Stand",
    "Railway Station",
    "Market",
    "Town Area",
    "Veppanthattai",
    "Alathur",
    "Kunnam"
  ],
  Pudukkottai: [
    "Bus Stand",
    "Railway Station",
    "Market",
    "Town Area",
    "Aranthangi",
    "Alangudi",
    "Avudaiyarkoil"
  ],
  Ranipet: [
    "Walajah Road",
    "Ranipet Bus Stand",
    "Market",
    "Town Area",
    "Arcot",
    "Walajapet",
    "Sholingur"
  ],
  Tiruvarur: [
    "Bus Stand",
    "Railway Station",
    "Temple Area",
    "Market",
    "Mannargudi",
    "Nannilam",
    "Kodavasal"
  ],
  Dharmapuri: ["Dharmapuri Bus Stand", "Palacode", "Pennagaram"]
};

const TRANSPORT_MODES = ["Bus", "Train", "Metro"];
const crowdWeight = { low: 1, medium: 2, high: 3 };
const reverseCrowdWeight = { 1: "low", 2: "medium", 3: "high" };

export default function SmartTransportCrowd() {
  const [city, setCity] = useState("Chennai");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [mode, setMode] = useState("Bus");
  const [result, setResult] = useState(null);

  useEffect(() => {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    setCurrentTime(`${pad(now.getHours())}:${pad(now.getMinutes())}`);
  }, []);

  const PLACES = CITY_PLACES[city] || [];

  const predictCrowd = (current, hrs) => {
    let level = crowdWeight[current] + hrs * 0.3;
    level = Math.min(3, Math.max(1, Math.round(level)));
    return reverseCrowdWeight[level];
  };

  const calculateCrowd = () => {
    if (!from || !to || from === to) return;

    const hour = Number(currentTime.split(":")[0]);
    const isPeak =
      (hour >= 8 && hour <= 11) || (hour >= 17 && hour <= 20);

    let districtLevel = crowdWeight["medium"];
    let placeLevel = 1;

    let score =
      (districtLevel + placeLevel + (isPeak ? 1 : 0)) *
      (mode === "Bus" ? 1 : mode === "Train" ? 0.8 : 0.5);

    let current =
      score >= 5 ? "high" : score >= 3 ? "medium" : "low";

    const base = mode === "Bus" ? 45 : mode === "Train" ? 35 : 25;
    const delay =
      current === "high" ? 15 : current === "medium" ? 8 : 0;

    setResult({
      current,
      after1Hour: predictCrowd(current, 1),
      after2Hour: predictCrowd(current, 2),
      total: base + delay + (isPeak ? 5 : 0),
      recommendation:
        current === "high"
          ? "Very crowded inside vehicle — standing passengers likely"
          : current === "medium"
          ? "Moderate crowd — limited seating"
          : "Low crowd — comfortable travel"
    });
  };

  return (
    <section className="planner-section">
      <div className="planner-card">
        <h2>Predict Public Transport Crowd (Tamil Nadu)</h2>

        <div>
          <label>City / District</label>
          <select
            value={city}
            onChange={(e) => {
              setCity(e.target.value);
              setFrom("");
              setTo("");
              setResult(null);
            }}
          >
            {Object.keys(CITY_PLACES).map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="planner-grid">
          <div>
            <label>From</label>
            <select
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            >
              <option value="">Select</option>
              {PLACES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div className="planner-arrow">→</div>

          <div>
            <label>To</label>
            <select
              value={to}
              onChange={(e) => setTo(e.target.value)}
            >
              <option value="">Select</option>
              {PLACES.filter((p) => p !== from).map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label>Transport Mode</label>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
          >
            {TRANSPORT_MODES.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <button
          className="planner-btn"
          onClick={calculateCrowd}
          disabled={!from || !to || from === to}
        >
          Predict Transport Crowd
        </button>

        {result && (
          <div className="planner-result-section">
            <div className={`planner-result ${result.current}`}>
              <div className="planner-route">
                {from} → {to} ({mode})
                <span>{currentTime}</span>
              </div>

              <div className="planner-metrics">
                <div>
                  <span>NOW</span>
                  <strong>{result.current.toUpperCase()}</strong>
                </div>
                <div>
                  <span>AFTER 1 HR</span>
                  <strong>{result.after1Hour.toUpperCase()}</strong>
                </div>
                <div>
                  <span>AFTER 2 HR</span>
                  <strong>{result.after2Hour.toUpperCase()}</strong>
                </div>
                <div>
                  <span>TOTAL</span>
                  <strong>{result.total} min</strong>
                </div>
              </div>

              <div className="planner-advice">
                🚍 {result.recommendation}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
