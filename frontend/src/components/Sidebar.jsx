import { useState, useEffect } from "react";
import "./Sidebar.css";

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect screen size
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 900;
      setIsMobile(mobile);

      // Reset sidebar state when switching modes
      if (!mobile) setOpen(false);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Safe scroll helper
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (!el) return;

    el.scrollIntoView({ behavior: "smooth" });

    // Close sidebar after click on mobile
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
          ☰
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
            Home
          </button>

          <button onClick={() => scrollToSection("live-crowd")}>
            Live Crowd
          </button>

          <button onClick={() => scrollToSection("history")}>
            History
          </button>
        </nav>
      </aside>
    </>
  );
}
