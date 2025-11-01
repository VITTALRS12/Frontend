import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ResendOtp = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleResend = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('OTP resent successfully!');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setMessage(data.message || 'Failed to resend OTP');
      }
    } catch (err) {
      setMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f3f4f6',
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '0.5rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          width: '100%',
          maxWidth: '28rem',
        }}
      >
        <h2
          style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '1rem',
          }}
        >
          Resend OTP
        </h2>
        <form onSubmit={handleResend}>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              marginBottom: '1rem',
              fontSize: '1rem',
            }}
          />
          <button
            type="submit"
            style={{
              width: '100%',
              backgroundColor: '#4f46e5',
              color: 'white',
              padding: '0.5rem',
              borderRadius: '0.375rem',
              border: 'none',
              fontSize: '1rem',
              cursor: 'pointer',
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = '#4338ca')}
            onMouseOut={(e) => (e.target.style.backgroundColor = '#4f46e5')}
          >
            Resend OTP
          </button>
        </form>
        {message && (
          <p
            style={{
              textAlign: 'center',
              fontSize: '0.875rem',
              color: '#16a34a',
              marginTop: '1rem',
            }}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default ResendOtp;
