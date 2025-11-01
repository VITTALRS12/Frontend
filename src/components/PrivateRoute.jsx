import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          fontSize: '1.5rem',
          color: '#2563eb', // blue-600
          fontWeight: 'bold',
        }}
      >
        Loading...
      </div>
    )
  }

  return user ? children : <Navigate to="/login" replace />
}

export default PrivateRoute
