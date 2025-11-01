import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(formData);
      navigate("/shop");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-left">
          <h2>Signin</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
            />

            <div className="forgot-password">
              <Link to="/forgot-password">Forgot Password?</Link>
            </div>

            {error && <p className="error-text">{error}</p>}

            <button type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Signin"}
            </button>

            <p className="or-text">or sign in with</p>
            <div className="social-icons">
              <i className="fab fa-facebook-f" aria-hidden="true"></i>
              <i className="fab fa-twitter" aria-hidden="true"></i>
              <i className="fab fa-google" aria-hidden="true"></i>
            </div>
          </form>
        </div>

        <div className="login-right">
          <h2>Welcome back!</h2>
          <p>
            Welcome back! We’re happy to have you here. It’s great to see you
            again. We hope you had a safe and enjoyable time away.
          </p>
          <p className="signup-text">
            No account yet? <Link to="/register">Signup</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
