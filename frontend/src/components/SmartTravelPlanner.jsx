import { useState, useEffect } from "react";
import axios from "axios";
import "./SmartTravelPlanner.css";

/* ===============================
   API KEYS
================================ */
const WEATHER_API_KEY = "fb274fd8d1c797f3f457677f26d7e3b8";
const TOMTOM_API_KEY = "JkbGWD1bRLNA6AEDKETsaHqLkS4d0Sp9";

/* ===============================
   TAMIL NADU DATA
================================ */
const CITY_DATA = {
  Chennai: { lat: 13.0827, lon: 80.2707, places: ["CMBT","Guindy","Tambaram","Velachery","Anna Nagar","T Nagar","Egmore","Parrys","Broadway","Adyar","Guindy MRTS"] },
  Coimbatore: { lat: 11.0168, lon: 76.9558, places: ["Gandhipuram","Ukkadam","Peelamedu","Singanallur","RS Puram","Saibaba Colony","Saravanampatti","Podanur","Town Hall","Kuniyamuthur","Avinashi Road"] },
  Madurai: { lat: 9.9252, lon: 78.1198, places: ["Periyar","Mattuthavani","Anna Nagar","Arapalayam","Simmakkal","Thirunagar","Villapuram","Madurai Junction","Tiruparankundram","Thoppur"] },
  Tiruchirappalli: { lat: 10.7905, lon: 78.7047, places: ["Chatram","Central Bus Stand","Srirangam","Cantonment","Thillai Nagar","Woraiyur","Pallapatti","Golden Rock","K.K. Nagar","Edamalaipatti Pudur"] },
  Salem: { lat: 11.6643, lon: 78.1460, places: ["New Bus Stand","Old Bus Stand","Hasthampatti","Five Roads","Fairlands","Ammapet","Salem Junction","Omalur","Suramangalam","Bargur"] },
  Tirunelveli: { lat: 8.7139, lon: 77.7567, places: ["Palayamkottai","Junction","Vannarapettai","Melapalayam","Town","Tirunelveli Central","Palayam","Koodankulam","Vasudevanallur","Ambasamudram"] },
  Thoothukudi: { lat: 8.8100, lon: 78.1400, places: ["VOC Bus Stand","Railway Station","Port Area","Muthiahpuram","Thoothukudi Central","Ettayapuram","Sathankulam","Kayathar","Srivaikundam","Ervadi"] },
  Thanjavur: { lat: 10.7870, lon: 79.1378, places: ["Old Bus Stand","New Bus Stand","Medical College","Papanasam","Kumbakonam","Kottur","Thiruvaiyaru","Budalur","Orathanadu","Mannargudi"] },
  Dindigul: { lat: 10.3673, lon: 77.9803, places: ["Bus Stand","Railway Station","Oddanchatram","Vedasandur","Palani","Natham","Nilakottai","Batlagundu","Kodaikanal","Pallapatti"] },
  Erode: { lat: 11.3410, lon: 77.7172, places: ["Central Bus Stand","Erode Junction","Perundurai","Bhavani","Gobichettipalayam","Modakurichi","Sathyamangalam","Kodumudi","Chennimalai","Nambiyur"] },
  Vellore: { lat: 12.9165, lon: 79.1325, places: ["Katpadi","Vellore Bus Stand","Bagayam","Sathuvachari","Gudiyatham","Walajah","Ambur","Tirupattur","Arcot","Sholinghur"] },
  Ranipet: { lat: 12.9272, lon: 79.3333, places: ["Arcot","Ranipet","Walajah","Arakkonam","Sholinghur","Nellikuppam","Nemili","Puliyambatti","Kalavai","Vellore Industrial Area"] },
  Tirupattur: { lat: 12.4934, lon: 78.5678, places: ["Vaniyambadi","Tirupattur","Ambur","Natrampalli","Alangayam","Vellore Main Road","Thandarambattu","Uthangarai","Kalasapakkam","Kallakurichi"] },
  Krishnagiri: { lat: 12.5186, lon: 78.2137, places: ["Hosur","Krishnagiri","Denkanikottai","Pochampalli","Bargur","Shoolagiri","Mathur","Uthangarai","Pochampalli Junction","Kaveripattinam"] },
  Dharmapuri: { lat: 12.1211, lon: 78.1582, places: ["Dharmapuri","Harur","Palacode","Nallampalli","Pappireddipatti","Karimangalam","Kadathur","Marandahalli","Hosur Road","Kethanur"] },
  Namakkal: { lat: 11.2189, lon: 78.1672, places: ["Namakkal","Rasipuram","Tiruchengode","Sendamangalam","Paramathi Velur","Kollimalai","Mohamedpet","Kumarapalayam","Vennandur","Velur"] },
  Karur: { lat: 10.9601, lon: 78.0766, places: ["Karur","Vengamedu","Kulithalai","Krishnarayapuram","Kadavur","Thanthoni","Pugalur","Mettur Road","K.Paramathi","K. Pudur"] },
  Ariyalur: { lat: 11.1401, lon: 79.0747, places: ["Ariyalur","Jayankondam","Udayarpalayam","Andimadam","Sendurai","Taluk Bus Stand","Ariyalur Junction","Pillaiperumalnatham","Mathur","Sethur"] },
  Perambalur: { lat: 11.2342, lon: 78.8820, places: ["Perambalur","Veppanthattai","Alathur","Kunnam","Veppanthattai Junction","Thungapuram","Perambalur Bus Stand","Thuraiyur Road","Kolathur","Kadavur"] },
  Cuddalore: { lat: 11.7480, lon: 79.7714, places: ["Cuddalore OT","Cuddalore NT","Chidambaram","Panruti","Kurinjipadi","Parangipettai","Veppur","Kattumannarkoil","Srimushnam","Kallakurichi"] },
  Villupuram: { lat: 11.9401, lon: 79.4861, places: ["Villupuram","Tindivanam","Gingee","Marakkanam","Vanur","Ulundurpet","Thiruvennainallur","Ariyur","Mailam","Andimadam"] },
  Kallakurichi: { lat: 11.7370, lon: 78.9627, places: ["Kallakurichi","Sankarapuram","Chinnasalem","Thiyagadurugam","Kalrayan Hills","Thirukkovilur","Ulundurpet","Panruti","Villupuram","Mailam"] },
  Mayiladuthurai: { lat: 11.1085, lon: 79.6540, places: ["Mayiladuthurai","Sirkazhi","Kuthalam","Kollidam","Tharangambadi","Poombuhar","Poompuhar Beach","Neelankarai","Vedaranyam","Nagapattinam"] },
  Nagapattinam: { lat: 10.7672, lon: 79.8444, places: ["Nagapattinam","Velankanni","Vedaranyam","Thirupoondi","Keezhaiyur","Sikkal","Kilvelur","Thalaignayiru","Tirukkuvalai","Kilakarai"] },
  Tiruvarur: { lat: 10.7661, lon: 79.6344, places: ["Tiruvarur","Mannargudi","Needamangalam","Koothanallur","Nannilam","Valangaiman","Thiruthuraipoondi","Vedaranyam","Thalaignayiru","Kottur"] },
  Ramanathapuram: { lat: 9.3639, lon: 78.8395, places: ["Ramanathapuram","Rameswaram","Paramakudi","Kilakarai","Kamuthi","Mudukulathur","Mandapam","Thoothukudi Road","Ervadi","Ilayangudi"] },
  Sivagangai: { lat: 9.8433, lon: 78.4809, places: ["Karaikudi","Sivaganga","Devakottai","Manamadurai","Ilayangudi","Kalayarkoil","Thirupuvanam","Chettinad","Sivagangai Bus Stand","Madurai Road"] },
  Pudukkottai: { lat: 10.3833, lon: 78.8167, places: ["Pudukkottai","Aranthangi","Iluppur","Avudaiyarkoil","Alangudi","Thirumayam","Kundrakudi","Pudukkottai Bus Stand","Pudukkottai Junction","Kottaiyur"] },
  Virudhunagar: { lat: 9.5872, lon: 77.9514, places: ["Virudhunagar","Sivakasi","Rajapalayam","Aruppukottai","Tiruchuli","Ariyapatti","Seithur","Kariapatti","Sankarankovil","Kovilpatti"] },
  Theni: { lat: 10.0104, lon: 77.4768, places: ["Theni","Periyakulam","Cumbum","Bodinayakanur","Andipatti","Uthamapalayam","Chinnamanur","Aundipatty","Periyakulam Junction","Chinnamanur Bus Stand"] },
  Tiruppur: { lat: 11.1085, lon: 77.3411, places: ["Avinashi Road","PN Road","Old Bus Stand","Palladam Road","Udumalpet","Nehru Nagar","Kangeyam","Perumanallur","Kovilpalayam","Tiruppur Bus Stand"] },
  Kancheepuram: { lat: 12.8342, lon: 79.7036, places: ["Bus Stand","Enathur","Orikkai","Sriperumbudur","Uthiramerur","Kanchipuram Junction","Kanchipuram Bus Stand","Walajabad","Thiruporur","Pallavaram"] },
  Chengalpattu: { lat: 12.6841, lon: 79.9836, places: ["Chengalpattu","Guduvanchery","Maraimalai Nagar","Tambaram","Chengalpattu Junction","Thiruporur","Kelambakkam","Kundrathur","Mahabalipuram","Pallavaram"] },
  Tiruvallur: { lat: 13.1437, lon: 79.9079, places: ["Avadi","Poonamallee","Tiruvallur","Thiruninravur","Uthukkottai","Gummidipoondi","Ponneri","Thiruvallur Bus Stand","Puzhal","Minjur"] },
  Nilgiris: { lat: 11.4100, lon: 76.7000, places: ["Ooty","Coonoor","Kotagiri","Gudalur","Udhagamandalam","Gudalur Junction","Coonoor Bus Stand","Lovedale","Gudalur Bus Stand","Kotagiri Junction"] },
  Kanyakumari: { lat: 8.0883, lon: 77.5385, places: ["Nagercoil","Kanyakumari Beach","Colachel","Marthandam","Valliyoor","Marthandanthurai","Nagercoil Bus Stand","Colachel Junction","Kanyakumari Beach","Marthandam Junction"] },
  Tenkasi: { lat: 8.9591, lon: 77.3134, places: ["Tenkasi","Courtallam","Sankarankovil","Shenkottai","Alangulam","Kadayanallur","Tenkasi Junction","Courtallam Waterfalls","Sankarankovil Bus Stand","Shenkottai Bus Stand"] }
};


/* ===============================
   TRANSPORT MODES
================================ */
const TRANSPORT_MODES = ["Bus", "Train", "Metro"];

/* ===============================
   CROWD LABELS
================================ */
const CROWD_LABEL = { 1: "Low", 2: "Medium", 3: "High" };

/* ===============================
   SOCIAL MEDIA SIMULATION
================================ */
function getSocialMediaCrowdSignal({ city, place, hour, mode }) {
  let score = city === "Chennai" ? 1.5 : 1.2;
  if (hour >= 8 && hour <= 10) score += 0.8;
  if (hour >= 18 && hour <= 21) score += 1.0;
  if (place.toLowerCase().includes("bus") || place.toLowerCase().includes("junction")) score += 0.7;
  if (mode === "Metro") score += 0.5;
  score += Math.random() * 0.5;
  return Math.min(3, Math.max(1, Math.round(score)));
}

/* ===============================
   TOMTOM ROUTE FUNCTION
================================ */
async function getTomTomRoute({ city }) {
  if (!TOMTOM_API_KEY) return 20;

  try {
    const { lat, lon } = CITY_DATA[city];
    const url = `https://api.tomtom.com/routing/1/calculateRoute/${lat},${lon}:${lat},${lon}/json?key=${TOMTOM_API_KEY}&travelMode=car`;
    const res = await axios.get(url);
    return Math.round(res.data.routes[0]?.summary?.travelTimeInSeconds / 60) || 20;
  } catch (err) {
    console.error("TomTom API Error:", err);
    return 20;
  }
}

/* ===============================
   MAIN COMPONENT
================================ */
export default function SmartTransportCrowd() {
  const [city, setCity] = useState("Chennai");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [mode, setMode] = useState("Bus");
  const [time, setTime] = useState("");
  const [weather, setWeather] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  /* Live Time */
  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(`${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`);
    };
    update();
    const i = setInterval(update, 60000);
    return () => clearInterval(i);
  }, []);

  /* Weather */
  useEffect(() => {
    const { lat, lon } = CITY_DATA[city];
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${WEATHER_API_KEY}`)
      .then(res => res.json())
      .then(d => setWeather({ temp: d.main.temp, isRain: d.weather[0].main.toLowerCase().includes("rain") }))
      .catch(() => setWeather(null));
  }, [city]);

  /* Crowd Calculation */
  const calculateCrowd = async () => {
    if (!from || !to || from === to) return;
    setLoading(true);

    const hour = time ? Number(time.split(":")[0]) : new Date().getHours();
    const travelTime = await getTomTomRoute({ city });
    const socialScore = getSocialMediaCrowdSignal({ city, place: from, hour, mode });

    const current = socialScore;
    const future = h => Math.min(3, current + h);

    setResult({
      now: CROWD_LABEL[current],
      after1: CROWD_LABEL[future(1)],
      after2: CROWD_LABEL[future(2)],
      travelTime,
      advice:
        current === 3
          ? "Heavy crowd expected — avoid peak hours."
          : current === 2
          ? "Moderate crowd — some seats may be limited."
          : "Low crowd — comfortable travel."
    });

    setLoading(false);
  };

  const places = CITY_DATA[city].places;

  return (
    <section className="planner-section">
      <div className="planner-card">
        <h2>Smart Public Transport Crowd Predictor</h2>

        <div className="form-grid">
          <div className="form-group full">
            <label>City</label>
            <select value={city} onChange={e => { setCity(e.target.value); setFrom(""); setTo(""); setResult(null); }}>
              {Object.keys(CITY_DATA).map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label>From</label>
            <select value={from} onChange={e => setFrom(e.target.value)}>
              <option value="">Select place</option>
              {places.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label>To</label>
            <select value={to} onChange={e => setTo(e.target.value)}>
              <option value="">Select place</option>
              {places.filter(p => p !== from).map(p => <option key={p}>{p}</option>)}
            </select>
          </div>

          <div className="form-group full">
            <label>Transport Mode</label>
            <select value={mode} onChange={e => setMode(e.target.value)}>
              {TRANSPORT_MODES.map(m => <option key={m}>{m}</option>)}
            </select>
          </div>

          <div className="form-group full">
            <button onClick={calculateCrowd} disabled={loading}>
              {loading ? "Predicting..." : "Predict Crowd"}
            </button>
          </div>
        </div>

        {result && (
          <div className={`result-card ${result.now.toLowerCase()}`}>
            <div className="result-header">
              <strong>{from} → {to}</strong>
              <span>{mode} · {time}</span>
            </div>

            <div className="result-stats">
              <div><label>Now</label><span>{result.now}</span></div>
              <div><label>+1 Hr</label><span>{result.after1}</span></div>
              <div><label>+2 Hr</label><span>{result.after2}</span></div>
              <div><label>Travel</label><span>{result.travelTime} min</span></div>
            </div>

            <div className="result-advice">🚍 {result.advice}</div>
          </div>
        )}
      </div>
    </section>
  );
}
