import { useNavigate } from "react-router-dom";
import "./Profile.css";

export default function Profile() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    navigate("/login", { replace: true });
    return null;
  }

  return (
    <div className="profile-page">
      <div className="profile-card">
        <h2>My Profile</h2>

        <div className="profile-row">
          <span>Name:</span>
          <strong>{user.name}</strong>
        </div>

        <div className="profile-row">
          <span>Email:</span>
          <strong>{user.email}</strong>
        </div>

        <button onClick={() => navigate("/")}>
          Back to Home
        </button>
      </div>
    </div>
  );
}
