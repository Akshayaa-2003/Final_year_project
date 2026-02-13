import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Signup.css";

export default function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();

  // 🔁 Redirect if already logged in
  useEffect(() => {
    const user = localStorage.getItem("studentUser");
    if (user) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loading) return;

    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();
    const password = form.password;
    const confirm = form.confirm;

    if (!name || !email || !password || !confirm) {
      setError("All fields are required");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    const users = JSON.parse(localStorage.getItem("students")) || [];

    if (users.some((u) => u.email === email)) {
      setError("Email already exists");
      return;
    }

    setLoading(true);

    const newUser = { name, email, password };

    // ✅ Save users list
    localStorage.setItem("students", JSON.stringify([...users, newUser]));

    // ✅ Persist logged-in user
    localStorage.setItem("studentUser", JSON.stringify(newUser));
    login(newUser);

    // ✅ Go to dashboard
    navigate("/", { replace: true });
  };

  return (
    <div className="auth-page signup-page">
      <div className="auth-container">
        <div className="auth-card">
          <h2>Create Account</h2>
          <p className="subtitle">Sign up to get started</p>

          {error && <div className="error">{error}</div>}

          <form onSubmit={handleSubmit} autoComplete="off">
            <div className="row">
              <div className="input-group">
                <label>Name</label>
                <input
                  type="text"
                  placeholder="Your name"
                  value={form.name}
                  onChange={(e) => {
                    setForm({ ...form, name: e.target.value });
                    setError("");
                  }}
                  required
                />
              </div>

              <div className="input-group">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="Your email"
                  value={form.email}
                  onChange={(e) => {
                    setForm({ ...form, email: e.target.value });
                    setError("");
                  }}
                  required
                />
              </div>
            </div>

            <div className="row">
              <div className="input-group">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={(e) => {
                    setForm({ ...form, password: e.target.value });
                    setError("");
                  }}
                  required
                />
              </div>

              <div className="input-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  placeholder="Confirm password"
                  value={form.confirm}
                  onChange={(e) => {
                    setForm({ ...form, confirm: e.target.value });
                    setError("");
                  }}
                  required
                />
              </div>
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <p className="switch-text">
            Already have an account?{" "}
            <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
