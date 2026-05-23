import { Route, Routes } from 'react-router-dom'
import Doctors from './pages/Doctors'
import Home from './pages/Home/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Register_Login from './pages/Register_Login/Register_Login'
import Navbar from './components/Navbar/Navbar'

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
      </Routes>

    </div>
  )
}

export default App
