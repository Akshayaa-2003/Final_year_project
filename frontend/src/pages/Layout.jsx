import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import "./Layout.css";

export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      <div className="layout">
        <Sidebar />
        <main className="layout-content">
          {children}
        </main>
      </div>
    </>
  );
}
