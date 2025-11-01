import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { user } = await login(formData);
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        setError('Access denied: Not an admin.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f9fafb',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '400px',
          background: '#fff',
          padding: '2rem',
          borderRadius: '1rem',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        }}
      >
        <h2
          style={{
            fontSize: '1.75rem',
            fontWeight: 'bold',
            textAlign: 'center',
            color: '#1f2937',
          }}
        >
          Admin Login
        </h2>

        {error && (
          <div
            style={{
              backgroundColor: '#fef2f2',
              color: '#b91c1c',
              border: '1px solid #fca5a5',
              padding: '0.75rem 1rem',
              fontSize: '0.875rem',
              borderRadius: '0.5rem',
              margin: '1rem 0',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label
              htmlFor="email"
              style={{
                fontWeight: '500',
                marginBottom: '0.25rem',
                display: 'block',
              }}
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
              }}
            />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label
              htmlFor="password"
              style={{
                fontWeight: '500',
                marginBottom: '0.25rem',
                display: 'block',
              }}
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
              }}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              backgroundColor: '#4f46e5',
              color: '#fff',
              padding: '0.5rem',
              borderRadius: '0.375rem',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? 'Logging in...' : 'Login as Admin'}
          </button>
        </form>

        <p
          style={{
            textAlign: 'center',
            fontSize: '0.875rem',
            color: '#6b7280',
            marginTop: '1rem',
          }}
        >
          Not an admin?{' '}
          <Link to="/login" style={{ color: '#4f46e5' }}>
            User Login
          </Link>
        </p>
      </div>
    </main>
  );
};

export default AdminLogin;
