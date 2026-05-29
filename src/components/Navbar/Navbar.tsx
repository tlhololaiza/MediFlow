import { Link, NavLink } from 'react-router-dom'
import './Navbar.css'
import { useAuth } from '../../context/AuthContext'

const Navbar = () => {
  const { currentUser, userType } = useAuth()
  
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        <img src="src/assets/navbar_logo_2.png" alt="MediFlow Logo" />
      </Link>
      
      <ul className="navbar-menu">
        <li><NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink></li>
        {userType !== 'doctor' && (
          <li><NavLink to="/doctors" className={({ isActive }) => isActive ? 'active' : ''}>Doctors</NavLink></li>
        )}
        {currentUser && userType !== 'doctor' && (
          <li><NavLink to="/appointments" className={({ isActive }) => isActive ? 'active' : ''}>Appointments</NavLink></li>
        )}
        {currentUser && userType === 'doctor' && (
          <li><NavLink to="/doctor/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>Dashboard</NavLink></li>
        )}
        <li><NavLink to="/about" className={({ isActive }) => isActive ? 'active' : ''}>About</NavLink></li>
        <li><NavLink to="/contact" className={({ isActive }) => isActive ? 'active' : ''}>Contact</NavLink></li>
      </ul>
      
      <div className="navbar-btn">
        {currentUser ?( 
          <>
            <Link to={userType === 'doctor' ? '/doctor/dashboard' : '/profile'}>
              <button>{userType === 'doctor' ? 'Doctor Dashboard' : 'My Profile'}</button>
            </Link>
          </>
        ) : (
          <Link to="/login"><button>Member Access</button></Link>
        )}
      </div>
    </nav>
  )
}

export default Navbar
