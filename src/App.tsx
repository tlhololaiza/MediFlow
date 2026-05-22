import React from 'react'
import { Route, Routes, Link } from 'react-router-dom'
import Doctors from './pages/Doctors'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Register from './pages/Register'

const App = () => {
  return (
    <div>
      <ul>
        <img src="src/assets/navbar_logo.png" alt="MediFlow Logo" />
        <li><a href="/">Home</a></li>
        <li><a href="/doctors">Doctors</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="/contact">Contact</a></li>
      </ul>
      <Link to="/register"><button>Create Account</button></Link>
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>

      <footer>
        <img src="src/assets/navbar_logo.png" alt="MediFlow Footer Logo" />
        <p>&copy; 2023 MediFlow. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default App
