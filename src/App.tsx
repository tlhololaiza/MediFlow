import { Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Doctors from './pages/Doctors/Doctors'
import Home from './pages/Home/Home'
import About from './pages/About/About'
import Contact from './pages/Contact/Contact'
import Register_Login from './pages/Register_Login/Register_Login'
import Booking from './pages/Booking/Booking'
import Confirmation from './pages/Booking Confirmed/Confirmation'
import Navbar from './components/Navbar/Navbar'
import Profile from './pages/Profile/Profile'
import Appointments from './pages/Appointments/Appointments'

const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Register_Login />} />
        
        {/* Protected Routes */}
        <Route path="/booking/:doctorId" element={<ProtectedRoute><Booking /></ProtectedRoute>} />
        <Route path="/confirmation" element={<ProtectedRoute><Confirmation /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/appointments" element={<ProtectedRoute><Appointments /></ProtectedRoute>} />
      </Routes>
    </div>
  )
}

export default App