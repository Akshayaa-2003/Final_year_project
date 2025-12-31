import { useState } from "react";
import Navbar from "./components/Navbar";
import WelcomeSection from "./components/WelcomeSection";
import InputSection from "./components/InputSection";
import ResultSection from "./components/ResultSection";

export default function App() {
  const [result, setResult] = useState(null);

  return (
    <>
      <Navbar />
      <WelcomeSection />
      <InputSection onPredict={setResult} />
      <ResultSection result={result} />
    </>
  );
}
