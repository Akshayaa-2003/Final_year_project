import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Profile.css";

export default function Profile() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // 🔒 Safety fallback (normally ProtectedRoute handles this)
  if (!user) {
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
