import { useState, useMemo, useEffect } from 'react'
import DoctorCard from "../../components/DoctorCard/DoctorCard"
import Footer from "../../components/Footer/Footer"
import { getDoctors } from "../../services/firestoreService"
import './Doctors.css'

interface Doctor {
  id: string
  name: string
  specialty: string
  available: boolean
  image: string
}

const Doctors = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSpecialty, setSelectedSpecialty] = useState('All')
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)

  const specialties = [
    'All',
    'General physician',
    'Gynecologist',
    'Dermatologist',
    'Pediatricians',
    'Neurologist',
    'Gastroenterologist',
  ]

  // Fetch doctors from Firestore
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true)
        const doctorsList = await getDoctors()
        setDoctors(doctorsList)
      } catch (err) {
        console.error('Error fetching doctors:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchDoctors()
  }, [])

  // Filter doctors based on search term and selected specialty
  const filteredDoctors = useMemo(() => {
    return doctors.filter(doctor => {
      const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesSpecialty = selectedSpecialty === 'All' || doctor.specialty === selectedSpecialty
      return matchesSearch && matchesSpecialty
    })
  }, [doctors, searchTerm, selectedSpecialty])

  return (
    <div className="doctors-page">
      <div className="doctors-container">
        {/* Filter Panel */}
        <div className="filter-panel">
          <div className="filter-header">
            <h2>Filter Doctors</h2>
          </div>
          
          <div className="filter-section">
            <h3>Specialty</h3>
            <div className="specialty-filters">
              {specialties.map((specialty) => (
                <button
                  key={specialty}
                  className={`specialty-btn ${selectedSpecialty === specialty ? 'active' : ''}`}
                  onClick={() => setSelectedSpecialty(specialty)}
                >
                  {specialty}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="doctors-content">
          {/* Search Bar */}
          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder="Search doctors by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={loading}
            />
            <i className='bx bx-search search-icon'></i>
          </div>

          {/* Doctor Cards Grid */}
          <div className="doctors-grid">
            {loading ? (
              <div className="no-results">
                <p>Loading doctors...</p>
              </div>
            ) : filteredDoctors.length > 0 ? (
              filteredDoctors.map((doctor) => (
                <DoctorCard
                  key={doctor.id}
                  id={doctor.id}
                  name={doctor.name}
                  specialty={doctor.specialty}
                  available={doctor.available}
                  image={doctor.image}
                />
              ))
            ) : (
              <div className="no-results">
                <p>No doctors found matching your criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="doctors-footer">
        <Footer/>
      </div>
    </div>
  )
}

export default Doctors
