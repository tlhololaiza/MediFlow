import { Route, Routes } from 'react-router-dom'
import Doctors from './pages/Doctors/Doctors'
import Home from './pages/Home/Home'
import About from './pages/About/About'
import Contact from './pages/Contact/Contact'
import Register_Login from './pages/Register_Login/Register_Login'
import Booking from './pages/Booking/Booking'
import Confirmation from './pages/Booking Confirmed/Confirmation'
import Navbar from './components/Navbar/Navbar'


const App = () => {
  return (
    <div>
      <Navbar />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/booking/:doctorId" element={<Booking />} />
        <Route path="/confirmation" element={<Confirmation />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Register_Login />} />
      </Routes>

    </div>
  )
}

export default App
