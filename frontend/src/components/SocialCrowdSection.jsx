import "./SocialCrowdSection.css";

export default function SocialCrowdSection({ places }) {
  if (!places || places.length === 0) {
    return (
      <section className="social-section">
        <p className="hint">Detect location to analyze crowd</p>
      </section>
    );
  }

  const CROWD_API_KEY = pub_9a05c48d3a314e88a9cd3de74ba8e845;

  const hour = new Date().getHours();

  const classify = () => {
    let social = 0;
    let transit = 0;
    let essential = 0;

    places.forEach((p) => {
      const n = p.toLowerCase();
      if (n.includes("mall") || n.includes("market") || n.includes("cinema")) {
        social++;
      } else if (n.includes("bus") || n.includes("station")) {
        transit++;
      } else if (n.includes("hospital")) {
        essential++;
      }
    });

    if (essential >= 2 && social === 0) return "Low";
    if (social >= 2 && hour >= 17) return "High";
    if (transit >= 2) return "Medium";
    if (social === 1) return "Medium";
    return "Low";
  };

  const crowd = classify();

  return (
    <section className="social-section">
      <div className="social-box">
        <h2>Social Crowd Prediction</h2>
        <p className={`crowd ${crowd.toLowerCase()}`}>
          Crowd Level: <strong>{crowd}</strong>
        </p>
      </div>
    </section>
  );
}
