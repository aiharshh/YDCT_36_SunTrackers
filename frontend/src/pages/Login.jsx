import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../firebase";
import "../styles/Login.css";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isValidEmailSimple = (v) => /^[^\s@]+@[^\s@]+\.com$/i.test(v.trim());

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const cleanEmail = email.trim().toLowerCase();
    if (!isValidEmailSimple(cleanEmail)) {
      setError("Email must be valid and end with .com");
      return;
    }

    setLoading(true);
    const res = isRegistering
      ? await registerUser(cleanEmail, password)
      : await loginUser(cleanEmail, password);
    setLoading(false);

    if (res.user) {
      navigate("/home");
      return;
    }

    setError(res.error || "Authentication failed. Please check your details.");
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <span className="login-logo" aria-hidden="true">⚡</span>
          <span className="login-brandText">PowerWestJava</span>
        </div>

        <p className="login-subtitle">
          {isRegistering ? "Create an Account" : "Welcome Back"}
        </p>

        <form className="login-form" onSubmit={handleSubmit}>
          <label className="login-label">Email</label>
          <div className="login-field">
            <span className="login-icon" aria-hidden="true">
              <i className="bi bi-envelope-fill" />
            </span>
            <input
              className="login-input"
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <label className="login-label">Password</label>
          <div className="login-field">
            <span className="login-icon" aria-hidden="true">
              <i className="bi bi-lock-fill" />
            </span>
            <input
              className="login-input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={isRegistering ? "new-password" : "current-password"}
              required
            />
          </div>

          <button className="login-btn" type="submit" disabled={loading}>
            {loading ? "Please wait..." : isRegistering ? "Sign Up" : "Log In"}
          </button>
        </form>

        {error && <div className="login-alert">{error}</div>}

        <div className="login-links">
          <div className="login-switch">
            {isRegistering ? "Already have an account?" : "No account yet?"}
            <button
              type="button"
              className="login-linkBtn"
              onClick={() => setIsRegistering((v) => !v)}
            >
              {isRegistering ? "Log In" : "Sign Up"}
            </button>
          </div>

          <div className="login-skip">
            Just browsing?
            <button type="button" className="login-linkBtn" onClick={() => navigate("/home")}>
              Go to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}