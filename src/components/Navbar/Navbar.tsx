import { Link, NavLink } from 'react-router-dom'
import './Navbar.css'

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        <img src="src/assets/navbar_logo_2.png" alt="MediFlow Logo" />
      </Link>
      
      <ul className="navbar-menu">
        <li><NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink></li>
        <li><NavLink to="/doctors" className={({ isActive }) => isActive ? 'active' : ''}>Doctors</NavLink></li>
        <li><NavLink to="/about" className={({ isActive }) => isActive ? 'active' : ''}>About</NavLink></li>
        <li><NavLink to="/contact" className={({ isActive }) => isActive ? 'active' : ''}>Contact</NavLink></li>
      </ul>
      
      <div className="navbar-btn">
        <Link to="/register"><button>Create Account</button></Link>
      </div>
    </nav>
  )
}

export default Navbar
