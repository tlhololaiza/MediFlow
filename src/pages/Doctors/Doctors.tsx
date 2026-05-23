import { useState, useMemo } from 'react'
import DoctorCard from "../../components/DoctorCard/DoctorCard"
import Footer from "../../components/Footer/Footer"
import './Doctors.css'

interface Doctor {
  id: number
  name: string
  specialty: string
  available: boolean
  image: string
}

const Doctors = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSpecialty, setSelectedSpecialty] = useState('All')

  const specialties = [
    'All',
    'General physician',
    'Gynecologist',
    'Dermatologist',
    'Pediatricians',
    'Neurologist',
    'Gastroenterologist',
  ]

  const doctorsData: Doctor[] = [
    { id: 1, name: 'Dr. Richard James', specialty: 'General physician', available: true, image: 'src/assets/doc1.png' },
    { id: 2, name: 'Dr. Sarah Mitchell', specialty: 'Gynecologist', available: true, image: 'src/assets/doc1.png' },
    { id: 3, name: 'Dr. John Smith', specialty: 'Dermatologist', available: false, image: 'src/assets/doc1.png' },
    { id: 4, name: 'Dr. Emily Brown', specialty: 'Pediatricians', available: true, image: 'src/assets/doc1.png' },
    { id: 5, name: 'Dr. Michael Chen', specialty: 'Neurologist', available: true, image: 'src/assets/doc1.png' },
    { id: 6, name: 'Dr. Lisa Anderson', specialty: 'Gastroenterologist', available: true, image: 'src/assets/doc1.png' },
    { id: 7, name: 'Dr. Robert Wilson', specialty: 'General physician', available: true, image: 'src/assets/doc1.png' },
    { id: 8, name: 'Dr. Jennifer Davis', specialty: 'Gynecologist', available: false, image: 'src/assets/doc1.png' },
    { id: 9, name: 'Dr. David Martinez', specialty: 'Dermatologist', available: true, image: 'src/assets/doc1.png' },
    { id: 10, name: 'Dr. Amanda White', specialty: 'Pediatricians', available: true, image: 'src/assets/doc1.png' },
    { id: 11, name: 'Dr. Christopher Lee', specialty: 'Neurologist', available: true, image: 'src/assets/doc1.png' },
    { id: 12, name: 'Dr. Michelle Taylor', specialty: 'Gastroenterologist', available: true, image: 'src/assets/doc1.png' },
  ]

  // Filter doctors based on search term and selected specialty
  const filteredDoctors = useMemo(() => {
    return doctorsData.filter(doctor => {
      const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesSpecialty = selectedSpecialty === 'All' || doctor.specialty === selectedSpecialty
      return matchesSearch && matchesSpecialty
    })
  }, [searchTerm, selectedSpecialty])

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
            />
            <i className='bx bx-search search-icon'></i>
          </div>

          {/* Doctor Cards Grid */}
          <div className="doctors-grid">
            {filteredDoctors.length > 0 ? (
              filteredDoctors.map((doctor) => (
                <DoctorCard
                  key={doctor.id}
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
        <Footer />
      </div>
    </div>
  )
}

export default Doctors
