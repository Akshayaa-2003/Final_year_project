import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-box">
        <h2 className="logo">
          Crowd<span>Predict</span>
        </h2>

        <div className="nav-badge">
          <img src="/navbar-bg.png" alt="Crowd visual" />
        </div>
      </div>
    </nav>
  );
}
