import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

// ✅ Vite env (local + prod safe)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔒 Guard: env missing
    if (!API_BASE_URL) {
      alert("API not configured. Contact admin.");
      console.error("VITE_API_BASE_URL is missing");
      return;
    }

    // ✅ Validation
    if (!name || !email || !password || !confirmPassword) {
      alert("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (loading) return;
    setLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/auth/signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            password,
          }),
        }
      );

      // ✅ Prevent JSON crash
      let data = {};
      try {
        data = await response.json();
      } catch {
        throw new Error("Invalid server response");
      }

      if (!response.ok || !data.success) {
        alert(data?.message || "Signup failed");
        return;
      }

      // ✅ Save user
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/", { replace: true });

    } catch (error) {
      console.error("SIGNUP ERROR:", error);
      alert("Server not reachable");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page signup-page">
      <div className="auth-container">
        <div className="auth-card">
          <h2>Create Account</h2>
          <p className="subtitle">Sign up to get started</p>

          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="input-group">
                <label>Name</label>
                <input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="auth-btn"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <p className="switch-text">
            Already have an account?{" "}
            <span onClick={() => navigate("/login")}>
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
