import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token') || null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedToken = localStorage.getItem('token')
        if (storedToken) {
          const { data } = await axios.get('/api/auth/me', {
            headers: { Authorization: `Bearer ${storedToken}` },
          })
          setUser(data.user)
          setToken(storedToken)
        }
      } catch (err) {
        console.error('Auth check failed:', err)
        logout()
      } finally {
        setLoading(false)
      }
    }
    checkAuth()
  }, [])

  const register = async (formData) => {
    try {
      const { data } = await axios.post('/api/auth/register', formData)
      toast.success(data.message || 'Registered successfully')
      return data
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
      throw err
    }
  }

  const verifyOtp = async (otpData) => {
    try {
      const { data } = await axios.post('/api/auth/verify-otp', otpData)
      localStorage.setItem('token', data.token)
      setToken(data.token)
      setUser(data.user)
      toast.success(data.message || 'OTP verified')
      return data
    } catch (err) {
      toast.error(err.response?.data?.message || 'OTP verification failed')
      throw err
    }
  }

  const resendOtp = async (email) => {
    try {
      const { data } = await axios.post('/api/auth/resend-otp', { email })
      toast.success(data.message || 'OTP resent successfully')
      return data
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resend OTP')
      throw err
    }
  }

  const login = async (credentials) => {
    try {
      const { data } = await axios.post('/api/auth/login', credentials)
      localStorage.setItem('token', data.token)
      setToken(data.token)
      setUser(data.user)
      toast.success(data.message || 'Login successful')
      return data
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed')
      throw err
    }
  }

  const logout = async () => {
    try {
      const storedToken = localStorage.getItem('token')
      if (storedToken) {
        await axios.post('/api/auth/logout', null, {
          headers: { Authorization: `Bearer ${storedToken}` },
        })
      }
    } catch (err) {
      console.error('Logout failed:', err)
    } finally {
      localStorage.removeItem('token')
      setToken(null)
      setUser(null)
      navigate('/login')
    }
  }

  const forgotPassword = async (email) => {
    try {
      const { data } = await axios.post('/api/auth/forgot-password', { email })
      toast.success(data.message || 'Reset link sent to your email')
      return data
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send reset link')
      throw err
    }
  }

  const resetPassword = async (resetData) => {
    try {
      const { data } = await axios.post('/api/auth/reset-password', resetData)
      toast.success(data.message || 'Password reset successful')
      return data
    } catch (err) {
      toast.error(err.response?.data?.message || 'Password reset failed')
      throw err
    }
  }

  const updateProfile = async (profileData) => {
    try {
      const storedToken = localStorage.getItem('token')
      const { data } = await axios.put('/api/auth/profile', profileData, {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
      setUser(data.user)
      toast.success(data.message || 'Profile updated successfully')
      return data
    } catch (err) {
      toast.error(err.response?.data?.message || 'Profile update failed')
      throw err
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        register,
        verifyOtp,
        resendOtp,
        login,
        logout,
        forgotPassword,
        resetPassword,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
