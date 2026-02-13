import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [open, setOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const dropdownRef = useRef(null);

  // 🔴 Open confirm modal
  const handleLogoutClick = () => {
    setShowConfirm(true);
  };

  // ✅ Confirm logout (AuthContext handles cleanup + redirect)
  const confirmLogout = () => {
    setShowConfirm(false);
    setOpen(false);
    logout();
  };

  // 🔥 Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
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
              {/* PROFILE ICON */}
              <div
                className="profile-icon"
                onClick={() => setOpen((prev) => !prev)}
                title="Account"
              >
                {user.name?.charAt(0)?.toUpperCase() || "U"}
              </div>

              {/* DROPDOWN */}
              {open && (
                <div className="profile-dropdown">
                  <div className="profile-header">
                    <div className="profile-avatar-lg">
                      {user.name?.charAt(0)?.toUpperCase() || "U"}
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
                    onClick={handleLogoutClick}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* 🔔 LOGOUT CONFIRM MODAL */}
      {showConfirm && (
        <div className="confirm-overlay">
          <div className="confirm-box">
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to logout?</p>

            <div className="confirm-actions">
              <button
                className="confirm-btn cancel"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>

              <button
                className="confirm-btn logout"
                onClick={confirmLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
