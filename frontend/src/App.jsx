import { useState } from "react";
import Navbar from "./components/Navbar";
import WelcomeSection from "./components/WelcomeSection";
import LiveLocationSection from "./components/LiveLocationSection";
import InputSection from "./components/InputSection";
import ResultSection from "./components/ResultSection";

export default function App() {
  const [result, setResult] = useState(null);
  const [detectedCity, setDetectedCity] = useState("");

  return (
    <>
      <Navbar />
      <WelcomeSection />

      {/* 🔥 LIVE LOCATION SLIDE */}
      <LiveLocationSection
        onDetect={({ city }) => {
          setDetectedCity(city);
        }}
      />

      {/* 🔥 INPUT SLIDE */}
      <InputSection
        detectedCity={detectedCity}
        onPredict={setResult}
      />

      <ResultSection result={result} />
    </>
  );
}
