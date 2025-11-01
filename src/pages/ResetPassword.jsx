import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location.state]);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!email || !otp || !password) {
      setMessage("All fields are required.");
      return;
    }

    try {
      const response = await axios.post("/api/auth/reset-password", {
        email,
        otp,
        password,
      });
      setMessage(response.data.message);

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        background: "linear-gradient(135deg, #0ea5e9, #2563eb)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "#ffffff",
          borderRadius: "16px",
          padding: "32px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            fontSize: "24px",
            fontWeight: "700",
            marginBottom: "24px",
            color: "#2563eb",
          }}
        >
          🔒 Reset Password
        </h2>

        <form onSubmit={handleResetPassword}>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "12px 14px",
              marginBottom: "14px",
              border: "2px solid #e0e7ff",
              borderRadius: "8px",
              fontSize: "15px",
              outline: "none",
              transition: "border-color 0.3s",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
            onBlur={(e) => (e.target.style.borderColor = "#e0e7ff")}
          />

          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "12px 14px",
              marginBottom: "14px",
              border: "2px solid #e0e7ff",
              borderRadius: "8px",
              fontSize: "15px",
              outline: "none",
              transition: "border-color 0.3s",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
            onBlur={(e) => (e.target.style.borderColor = "#e0e7ff")}
          />

          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "12px 14px",
              marginBottom: "20px",
              border: "2px solid #e0e7ff",
              borderRadius: "8px",
              fontSize: "15px",
              outline: "none",
              transition: "border-color 0.3s",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
            onBlur={(e) => (e.target.style.borderColor = "#e0e7ff")}
          />

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              fontSize: "16px",
              fontWeight: "600",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              background: "linear-gradient(90deg, #3b82f6, #0ea5e9)",
              color: "#fff",
              boxShadow: "0 4px 10px rgba(59,130,246,0.3)",
              transition: "transform 0.2s ease",
            }}
            onMouseEnter={(e) => (e.target.style.transform = "scale(1.03)")}
            onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
          >
            Reset Password
          </button>
        </form>

        {message && (
          <p
            style={{
              marginTop: "16px",
              textAlign: "center",
              fontSize: "14px",
              fontWeight: "500",
              color: message.toLowerCase().includes("success")
                ? "#10b981"
                : "#dc2626",
            }}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
