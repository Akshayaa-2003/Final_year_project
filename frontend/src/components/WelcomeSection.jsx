import "./WelcomeSection.css";

export default function WelcomeSection() {
  const handleStart = () => {
    document.getElementById("predict")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <section className="welcome">
      <div className="welcome-container">
        {/* CENTER TEXT + BUTTON */}
        <div className="welcome-center">
          <div className="welcome-text">
            <h1>
              Crowd <span>Prediction</span>
            </h1>
            <p>
              Predict crowd density at public locations using
              machine learning and real-time contextual data
              to plan smarter and safer.
            </p>
          </div>
          <button className="welcome-btn" onClick={handleStart}>
            Get Started
          </button>
        </div>

        {/* RIGHT IMAGE (ILLUSTRATION ONLY) */}
        <div className="welcome-right-image">
          <img
            src="/illustration.png"
            alt="Crowd prediction illustration"
          />
        </div>
      </div>
    </section>
  );
}
