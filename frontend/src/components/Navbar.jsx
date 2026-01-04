import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  const handleLogout = () => {
    if (!window.confirm("Are you sure you want to logout?")) return;

    localStorage.removeItem("user");
    setOpen(false);
    navigate("/login", { replace: true });
  };

  // 🔥 Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="navbar">
      <div className="nav-box">
        <div
          className="logo"
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        >
          Crowd <span>Prediction</span>
        </div>

        {user && (
          <div className="profile-wrapper" ref={dropdownRef}>
            {/* ICON */}
            <div
              className="profile-icon"
              onClick={() => setOpen((prev) => !prev)}
              title="Account"
            >
              {user.name?.charAt(0) || "U"}
            </div>

            {/* SLIDE PANEL */}
            {open && (
              <div className="profile-dropdown">
                <div className="profile-header">
                  <div className="profile-avatar-lg">
                    {user.name?.charAt(0) || "U"}
                  </div>
                  <div>
                    <div className="profile-name">{user.name}</div>
                    <div className="profile-email">{user.email}</div>
                  </div>
                </div>

                <button
                  className="profile-action"
                  onClick={() => {
                    setOpen(false);
                    navigate("/profile");
                  }}
                >
                  View Profile
                </button>

                <button
                  className="profile-action logout"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
