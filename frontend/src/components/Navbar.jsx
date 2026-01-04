import { useNavigate } from "react-router-dom";
import "./Navbar.css"; // ✅ FIXED

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // ✅ clear token
    navigate("/login", { replace: true });
  };

  return (
    <nav className="navbar">
      <div className="nav-box">
        <div className="logo">
          Crowd <span>Prediction</span>
        </div>

        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </nav>
  );
}
