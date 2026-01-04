import { useState, useEffect } from "react";
import {
  FiHome,
  FiMapPin,
  FiBarChart2,
  FiTruck,
  FiClock,
  FiMenu
} from "react-icons/fi";
import "./Sidebar.css";

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect screen size
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 900;
      setIsMobile(mobile);
      if (!mobile) setOpen(false);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth" });
    if (isMobile) setOpen(false);
  };

  return (
    <>
      {/* Mobile toggle */}
      {isMobile && (
        <button
          className="sidebar-toggle"
          onClick={() => setOpen(true)}
          aria-label="Open sidebar"
        >
          <FiMenu size={22} />
        </button>
      )}

      {/* Mobile overlay */}
      {isMobile && open && (
        <div
          className="sidebar-overlay"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`sidebar ${open ? "open" : ""}`}
        onMouseEnter={!isMobile ? () => setOpen(true) : undefined}
        onMouseLeave={!isMobile ? () => setOpen(false) : undefined}
      >
        <div className="sidebar-header">
          <h2 className="sidebar-logo">CrowdPredict</h2>
        </div>

        <nav className="sidebar-nav">
          <button onClick={() => scrollToSection("home")}>
            <FiHome className="nav-icon" />
            <span>Home</span>
          </button>

          <button onClick={() => scrollToSection("live-crowd")}>
            <FiMapPin className="nav-icon" />
            <span>Live Crowd</span>
          </button>

          <button onClick={() => scrollToSection("predict")}>
            <FiBarChart2 className="nav-icon" />
            <span>Predict Crowd</span>
          </button>

          <button onClick={() => scrollToSection("transport")}>
            <FiTruck className="nav-icon" />
            <span>Travel Advisory</span>
          </button>

          <button onClick={() => scrollToSection("history")}>
            <FiClock className="nav-icon" />
            <span>History</span>
          </button>
        </nav>
      </aside>
    </>
  );
}
