import { Link, NavLink, useNavigate } from 'react-router-dom'
import './Navbar.css'
import { useAuth } from '../../context/Authcontext'

const Navbar = () => {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/')
    } catch (err) {
      console.error('Failed to logout', err)
    }
  }

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        <img src="src/assets/navbar_logo_2.png" alt="MediFlow Logo" />
      </Link>
      
      <ul className="navbar-menu">
        <li><NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink></li>
        <li><NavLink to="/doctors" className={({ isActive }) => isActive ? 'active' : ''}>Doctors</NavLink></li>
        {currentUser ?(<li><NavLink to="/appointments" className={({ isActive }) => isActive ? 'active' : ''}>Appointments</NavLink></li>) : null}
        <li><NavLink to="/about" className={({ isActive }) => isActive ? 'active' : ''}>About</NavLink></li>
        <li><NavLink to="/contact" className={({ isActive }) => isActive ? 'active' : ''}>Contact</NavLink></li>
      </ul>
      
      <div className="navbar-btn">
        {currentUser ?( 
          <>
            <Link to="/profile"><button>My Profile</button></Link>
          </>
        ) : (
          <Link to="/login"><button>Member Access</button></Link>
        )}
      </div>
    </nav>
  )
}

export default Navbar
