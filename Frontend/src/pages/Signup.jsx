import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/api";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const signup = async () => {
    setError("");
    if (!username || !email || !password) {
      setError("All fields are required.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    try {
      setLoading(true);
      const { data } = await API.post("/auth/signup", { username, email, password });
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Sign up failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKey = e => e.key === "Enter" && signup();

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Create account</h1>
        <p className="subtitle">Join the MCP server registry</p>

        {error && (
          <div className="error-banner">
            {error}
          </div>
        )}

        <input
          placeholder="Username (letters, numbers, _ or -)"
          value={username}
          onChange={e => { setUsername(e.target.value); setError(""); }}
          onKeyDown={handleKey}
          autoComplete="username"
        />

        <input
          placeholder="Email address"
          type="email"
          value={email}
          onChange={e => { setEmail(e.target.value); setError(""); }}
          onKeyDown={handleKey}
          autoComplete="email"
        />

        <input
          placeholder="Password (min 8 characters)"
          type="password"
          value={password}
          onChange={e => { setPassword(e.target.value); setError(""); }}
          onKeyDown={handleKey}
          autoComplete="new-password"
        />

        {password.length > 0 && (
          <div style={{ marginTop: "8px", fontSize: "12px", color: password.length >= 8 ? "#4ade80" : "rgba(255,255,255,0.3)" }}>
            {password.length >= 8 ? "✓ Password strength: good" : `${8 - password.length} more characters needed`}
          </div>
        )}

        <button onClick={signup} disabled={loading}>
          {loading ? "Creating account..." : "Create Account"}
        </button>

        <p className="auth-footer">
          Already have an account?{" "}
          <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}