import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  // 🔁 If already logged in → dashboard
  useEffect(() => {
    const user = localStorage.getItem("studentUser");
    if (user) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loading) return;

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      setError("Please fill all fields");
      return;
    }

    const users = JSON.parse(localStorage.getItem("students")) || [];

    const user = users.find(
      (u) => u.email === cleanEmail && u.password === password
    );

    if (!user) {
      setError("Invalid email or password");
      return;
    }

    setLoading(true);

    // ✅ Persist logged-in user
    localStorage.setItem("studentUser", JSON.stringify(user));
    login(user);

    // ✅ Go to dashboard
    navigate("/", { replace: true });
  };

  return (
    <div className="auth-page login-page">
      <div className="auth-container">
        <div className="auth-card">
          <h2>Welcome Back</h2>
          <p className="subtitle">Login to your account</p>

          {error && <div className="error">{error}</div>}

          <form onSubmit={handleSubmit} autoComplete="off">
            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                required
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                required
              />
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="switch-text">
            Don’t have an account?{" "}
            <Link to="/signup">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
