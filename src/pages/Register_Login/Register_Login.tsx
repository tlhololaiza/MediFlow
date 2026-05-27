<link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'></link>
import './Register_Login.css'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/Authcontext'

const Register_Login = () => {
  const [isActive, setIsActive] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [userType, setUserType] = useState<'patient' | 'doctor'>('patient')
  const { signup, login } = useAuth()
  const navigate = useNavigate()

  const handleRegisterClick = () => {
    setIsActive(true)
    setError('')
  }

  const handleLoginClick = () => {
    setIsActive(false)
    setError('')
  }

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(email, password)
      // Redirect based on user type - will be set after login
      setTimeout(() => {
        navigate('/profile')
      }, 500)
    } catch (err: any) {
      setError(err.message || 'Failed to login')
    } finally {
      setLoading(false)
    }
  }

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long')
      return
    }

    setLoading(true)
    try {
      await signup(email, password, userType)
      // Redirect based on user type
      if (userType === 'doctor') {
        navigate('/doctor/dashboard')
      } else {
        navigate('/profile')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to register')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`container ${isActive ? 'active' : ''}`}>
        {/*Login Box*/}
        <div className="form-box login">
          <form onSubmit={handleLoginSubmit}>
            <h1>Login</h1>
            {error && <div style={{ color: 'red', marginBottom: '10px', fontSize: '14px' }}>{error}</div>}
            <div className="input-box">
              <input 
                type="email" 
                placeholder="Email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <img src="src/assets/bxs-envelope.svg" alt="User Icon" className="input-icon" />
            </div>
            <div className="input-box">
              <input 
                type="password" 
                placeholder="Password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <img src="src/assets/bxs-lock-alt.svg" alt="Lock Icon" className="input-icon" />
            </div>
            <div className="forgot-link">
              <a href="#">Forgot password?</a>
            </div>
            <button type="submit" className="btn" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
            <p>or login with social platforms</p>
            <div className="social-icons">
              <a href="#"><img src="src/assets/bxl-facebook.svg" alt="Facebook Icon" /></a>
              <a href="#"><img src="src/assets/bxl-google.svg" alt="Google Icon" /></a>
              <a href="#"><img src="src/assets/bxl-twitter.svg" alt="Twitter Icon" /></a>
            </div>
          </form>
        </div>

        {/*Register Box*/}
        <div className="form-box register">
          <form onSubmit={handleRegisterSubmit}>
            <h1>Register</h1>
            {error && <div style={{ color: 'red', marginBottom: '10px', fontSize: '14px' }}>{error}</div>}
            
            {/* User Type Selection */}
            <div style={{ marginBottom: '15px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                <input 
                  type="radio" 
                  name="userType" 
                  value="patient" 
                  checked={userType === 'patient'}
                  onChange={(e) => setUserType(e.target.value as 'patient' | 'doctor')}
                />
                <span>Patient</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                <input 
                  type="radio" 
                  name="userType" 
                  value="doctor" 
                  checked={userType === 'doctor'}
                  onChange={(e) => setUserType(e.target.value as 'patient' | 'doctor')}
                />
                <span>Doctor</span>
              </label>
            </div>
            
            <div className="input-box">
              <input 
                type="email" 
                placeholder="Email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <img src="src/assets/bxs-envelope.svg" alt="Envelope Icon" className="input-icon" />
            </div>
            <div className="input-box">
              <input 
                type="password" 
                placeholder="Password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <img src="src/assets/bxs-lock-alt.svg" alt="Lock Icon" className="input-icon" />
            </div>
            <div className="input-box">
              <input 
                type="password" 
                placeholder="Confirm Password" 
                required 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <img src="src/assets/bxs-lock-alt.svg" alt="Lock Icon" className="input-icon" />
            </div>
            
            <button type="submit" className="btn" disabled={loading}>{loading ? 'Registering...' : 'Register'}</button>
            <p>or register with social platforms</p>
            <div className="social-icons">
              <a href="#"><img src="src/assets/bxl-facebook.svg" alt="Facebook Icon" /></a>
              <a href="#"><img src="src/assets/bxl-google.svg" alt="Google Icon" /></a>
              <a href="#"><img src="src/assets/bxl-twitter.svg" alt="Twitter Icon" /></a>
            </div>
          </form>
        </div>

        {/*Toggle Box*/}
        <div className="toggle-box">
          <div className="toggle-panel toggle-left">
            <h1>Welcome Back!</h1>
            <p>Don't have an account?</p>
            <button className="btn register-btn" onClick={handleRegisterClick}>Register</button>
          </div>

          <div className="toggle-panel toggle-right">
            <h1>Welcome!</h1>
            <p>Already have an account?</p>
            <button className="btn login-btn" onClick={handleLoginClick}>Login</button>
          </div>

        </div>
      </div>
    )
  }

export default Register_Login
