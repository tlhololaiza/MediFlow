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
import DoctorDashboard from './pages/DoctorDashboard/DoctorDashboard'
import DoctorAppointments from './pages/DoctorDashboard/DoctorAppointments'
import ManageAvailability from './pages/DoctorDashboard/ManageAvailability'
import AdminDashboard from './pages/Admin Dashboard/AdminDashboard'
import AdminUsers from './pages/Admin Dashboard/AdminUsers'
import AdminDoctors from './pages/Admin Dashboard/AdminDoctors'
import AdminAppointments from './pages/Admin Dashboard/AdminAppointments'

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
        
        {/* Doctor Routes */}
        <Route path="/doctor/dashboard" element={<ProtectedRoute requiredRole="doctor"><DoctorDashboard /></ProtectedRoute>} />
        <Route path="/doctor/appointments" element={<ProtectedRoute requiredRole="doctor"><DoctorAppointments /></ProtectedRoute>} />
        <Route path="/doctor/availability" element={<ProtectedRoute requiredRole="doctor"><ManageAvailability /></ProtectedRoute>} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute requiredRole="admin"><AdminUsers /></ProtectedRoute>} />
        <Route path="/admin/doctors" element={<ProtectedRoute requiredRole="admin"><AdminDoctors /></ProtectedRoute>} />
        <Route path="/admin/appointments" element={<ProtectedRoute requiredRole="admin"><AdminAppointments /></ProtectedRoute>} />
      </Routes>
    </div>
  )
}

export default App