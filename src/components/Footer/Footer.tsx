import React from 'react'
import { Link } from 'react-router-dom'
import './Footer.css'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section footer-about">
          <img src="src/assets/navbar_logo_2.png" alt="MediFlow Logo" className="footer-logo" />
          <p>Experience seamless healthcare management with MediFlow. Your health, our priority.</p>
        </div>

        <div className="footer-section">
          <h3>COMPANY</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About us</Link></li>
            <li><Link to="/contact">Contact us</Link></li>
            <li><a href="#privacy">Privacy policy</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>GET IN TOUCH</h3>
          <p><a href="tel:+27-123-456-7890">+27-123-456-7890</a></p>
          <p><a href="mailto:help@mediflow.com">help@mediflow.com</a></p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2026 MediFlow. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer
