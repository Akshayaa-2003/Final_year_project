import { useState } from "react";

import WelcomeSection from "../components/WelcomeSection";
import LiveLocationSection from "../components/LiveLocationSection";
import InputSection from "../components/InputSection";
import ResultSection from "../components/ResultSection";
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
        city: detectedCity,
        time: new Date().toLocaleTimeString(),
      },
      ...prev,
    ]);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <>
      <section id="home">
        <WelcomeSection />
      </section>

      <section id="live-crowd">
        <LiveLocationSection
          onDetect={({ city }) => setDetectedCity(city)}
        />

        <InputSection
          detectedCity={detectedCity}
          onPredict={handlePredict}
        />

        <ResultSection result={result} />
      </section>

      <section id="history">
        <CrowdHistory
          history={history}
          onClear={clearHistory}
        />
      </section>
    </>
  );
}
