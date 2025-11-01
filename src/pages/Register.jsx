import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import './v.css'

const Register = () => {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    referralCode: '',
    acceptTerms: false
  })
  const [errors, setErrors] = useState({})
  const [otp, setOtp] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { register, verifyOtp } = useAuth()
  const navigate = useNavigate()

  const validateField = (name, value) => {
    switch (name) {
      case 'fullName':
        if (!value.trim()) return 'Full name is required'
        return ''
      case 'email':
        if (!value) return 'Email is required'
        if (!/^\S+@\S+\.\S+$/.test(value)) return 'Invalid email format'
        return ''
      case 'phone':
        if (!value) return 'Phone number is required'
        if (!/^\d{10}$/.test(value)) return 'Phone number must be 10 digits'
        return ''
      case 'password':
        if (!value) return 'Password is required'
        if (value.length < 6 || value.length > 8) return 'Password must be 6 to 8 characters'
        return ''
      case 'confirmPassword':
        if (value !== formData.password) return 'Passwords do not match'
        return ''
      case 'acceptTerms':
        if (!value) return 'You must accept Terms of Use'
        return ''
      default:
        return ''
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = {}

    if (step === 1) {
      Object.keys(formData).forEach(key => {
        if (key !== 'referralCode') {
          const error = validateField(key, formData[key])
          if (error) newErrors[key] = error
        }
      })
      setErrors(newErrors)
      if (Object.keys(newErrors).length > 0) return
    } else if (step === 2 && !otp) {
      setErrors({ otp: 'OTP is required' })
      return
    }

    setIsSubmitting(true)
    try {
      if (step === 1) {
        await register(formData) // Calls backend /register
        setStep(2)
      } else {
        await verifyOtp({ email: formData.email, otpCode: otp }) // Calls backend /verify-otp
        navigate('/')
      }
    } catch (err) {
      setErrors({ ...errors, api: err.message || 'Registration failed' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="register-wrapper">
      <div className="register-card">
        <h1 className="register-title">REGISTER</h1>

        {errors.api && (
          <div className="register-error">{errors.api}</div>
        )}

        <form onSubmit={handleSubmit} className="register-form">
          {step === 1 ? (
            <>
              {/* Full Name */}
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`form-input ${errors.fullName ? 'error' : ''}`}
                  required
                />
                {errors.fullName && <p className="error-text">{errors.fullName}</p>}
              </div>

              {/* Email */}
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  required
                />
                {errors.email && <p className="error-text">{errors.email}</p>}
              </div>

              {/* Phone */}
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`form-input ${errors.phone ? 'error' : ''}`}
                  required
                />
                {errors.phone && <p className="error-text">{errors.phone}</p>}
              </div>

              {/* Password */}
              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  required
                />
                {errors.password && <p className="error-text">{errors.password}</p>}
                <p className="password-hint">6-8 characters required</p>
              </div>

              {/* Confirm Password */}
              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <input
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                  required
                />
                {errors.confirmPassword && <p className="error-text">{errors.confirmPassword}</p>}
              </div>

              {/* Referral Code */}
              <div className="form-group">
                <label className="form-label">Referral Code (Optional)</label>
                <input
                  name="referralCode"
                  type="text"
                  value={formData.referralCode}
                  onChange={handleChange}
                  placeholder="e.g. REF673829"
                  className="form-input"
                />
              </div>

              {/* Terms */}
              <div className="terms-group">
                <input
                  type="checkbox"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  className={`terms-checkbox ${errors.acceptTerms ? 'error' : ''}`}
                  required
                />
                <label className="terms-label">I accept Terms of Use</label>
                {errors.acceptTerms && <p className="error-text">{errors.acceptTerms}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="submit-btn"
              >
                {isSubmitting ? 'Processing...' : 'REGISTER NOW'}
              </button>
            </>
          ) : (
            <>
              {/* OTP Step */}
              <div className="form-group">
                <label className="form-label">
                  Enter OTP sent to {formData.email}
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.trim())}
                  required
                  autoFocus
                  className={`form-input ${errors.otp ? 'error' : ''}`}
                />
                {errors.otp && <p className="error-text">{errors.otp}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !otp}
                className="submit-btn"
              >
                {isSubmitting ? 'Verifying...' : 'Verify OTP'}
              </button>
            </>
          )}
        </form>

        <div className="register-footer">
          Already have an account?{' '}
          <Link to="/login" className="login-link">
            Sign In
          </Link>
          <div className="designer-credit">
            designed by <strong>BOSS</strong>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
