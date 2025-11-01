// src/pages/SignupPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './SignupPage.css';

const SignupPage = () => {
  const { register, verifyOtp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    referralCode: '',
    otpCode: ''
  });

  // Capture referral code from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const refCode = params.get('ref');
    if (refCode) {
      setForm((prev) => ({ ...prev, referralCode: refCode }));
    }
  }, [location.search]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      setStep(2);
    } catch (err) {
      console.error("Registration error:", err);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      await verifyOtp({ email: form.email, otpCode: form.otpCode });
      navigate('/referral-dashboard');
    } catch (err) {
      console.error("OTP verification error:", err);
    }
  };

  return (
    <div className="signup-container">
      {step === 1 ? (
        <form onSubmit={handleRegister}>
          <h2>Create Account</h2>
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={form.fullName}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password (6-8 digits)"
            value={form.password}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />
          {form.referralCode && (
            <input
              type="text"
              name="referralCode"
              value={form.referralCode}
              readOnly
            />
          )}
          <button type="submit">Send OTP</button>
        </form>
      ) : (
        <form onSubmit={handleVerify}>
          <h2>Verify OTP</h2>
          <input
            type="text"
            name="otpCode"
            placeholder="Enter OTP"
            value={form.otpCode}
            onChange={handleChange}
            required
          />
          <button type="submit" className="verify-button">
            Verify
          </button>
        </form>
      )}
    </div>
  );
};

export default SignupPage;
