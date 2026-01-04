import { useState } from "react";

import WelcomeSection from "../components/WelcomeSection";
import LiveLocationSection from "../components/LiveLocationSection";
import InputSection from "../components/InputSection";
import ResultSection from "../components/ResultSection";
import SmartTravelPlanner from "../components/SmartTravelPlanner";
import CrowdHistory from "./CrowdHistory";

export default function Home() {
  const [result, setResult] = useState(null);
  const [detectedCity, setDetectedCity] = useState("");
  const [history, setHistory] = useState([]);

  const handlePredict = (data) => {
    setResult(data);

    setHistory((prev) => [
      {
        ...data,
        city: detectedCity || data.city || "Chennai",
        time: new Date().toLocaleTimeString(),
      },
      ...prev,
    ]);
  };

  // ✅ SAFE VALUES
  const safeCity = detectedCity || "Chennai";
  const safeCrowdLevel = result?.level || "low";

  return (
    <>
      {/* ================= HOME ================= */}
      <section id="home">
        <WelcomeSection />
      </section>

      {/* ================= LIVE + INPUT ================= */}
      <section id="live-crowd">
        <LiveLocationSection
          onDetect={(data) => setDetectedCity(data.city)}
        />

        <InputSection
          detectedCity={detectedCity}
          onPredict={handlePredict}
        />

        <ResultSection result={result} />
      </section>

      {/* ================= SMART TRAVEL PLANNER ================= */}
      <section id="transport">
        <SmartTravelPlanner
          city={safeCity}
          crowdLevel={safeCrowdLevel}
        />
      </section>

      {/* ================= HISTORY ================= */}
      <section id="history">
        <CrowdHistory
          history={history}
          onClear={() => setHistory([])}
        />
      </section>
    </>
  );
}
