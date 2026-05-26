<link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'></link>
import './Register_Login.css'
import { useState } from 'react'

const Register_Login = () => {
  const [isActive, setIsActive] = useState(false)

  const handleRegisterClick = () => {
    setIsActive(true)
  }

  const handleLoginClick = () => {
    setIsActive(false)
  }

  return (
    <div className={`container ${isActive ? 'active' : ''}`}>
        {/*Login Box*/}
        <div className="form-box login">
          <form action="">
            <h1>Login</h1>
            <div className="input-box">
              <input type="email" placeholder="Email" required />
              <img src="src/assets/bxs-envelope.svg" alt="User Icon" className="input-icon" />
            </div>
            <div className="input-box">
              <input type="password" placeholder="Password" required />
              <img src="src/assets/bxs-lock-alt.svg" alt="Lock Icon" className="input-icon" />
            </div>
            <div className="forgot-link">
              <a href="#">Forgot password?</a>
            </div>
            <button type="submit" className="btn">Login</button>
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
          <form action="">
            <h1>Register</h1>
            <div className="input-box">
              <input type="email" placeholder="Email" required />
              <img src="src/assets/bxs-envelope.svg" alt="Envelope Icon" className="input-icon" />
            </div>
            <div className="input-box">
              <input type="password" placeholder="Password" required />
              <img src="src/assets/bxs-lock-alt.svg" alt="Lock Icon" className="input-icon" />
            </div>
            <div className="input-box">
              <input type="password" placeholder="Confirm Password" required />
              <img src="src/assets/bxs-lock-alt.svg" alt="Lock Icon" className="input-icon" />
            </div>
            
            <button type="submit" className="btn">Register</button>
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
