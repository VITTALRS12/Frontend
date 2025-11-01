import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './v.css';

const VerifyOtp = () => {
  const { verifyOtp } = useAuth();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');

  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await verifyOtp({ email, otpCode: otp });
      if (res?.token) {
        navigate('/');
      } else {
        setError('Invalid OTP or token not received');
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verify-container">
      <div className="verify-box">
        <h2>Verify OTP</h2>
        <p className="instruction">Please enter the OTP sent to your email address.</p>

        <form onSubmit={handleVerify} className="verify-form">
          <label>Email</label>
          <input type="email" value={email} disabled className="input" />

          <label>OTP</label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            placeholder="Enter 6-digit OTP"
            className="input"
          />

          {error && <p className="error-text">{error}</p>}

          <button type="submit" className="verify-button" disabled={loading || otp.length !== 6}>
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyOtp;
