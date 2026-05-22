import React from 'react'
import './Specialties.css'

const Specialties = () => {
  const specialties = [
    { name: 'General physician', icon: 'src/assets/General_physician.svg' },
    { name: 'Gynecologist', icon: 'src/assets/Gynecologist.svg' },
    { name: 'Dermatologist', icon: 'src/assets/Dermatologist.svg' },
    { name: 'Pediatricians', icon: 'src/assets/Pediatricians.svg' },
    { name: 'Neurologist', icon: 'src/assets/Neurologist.svg' },
    { name: 'Gastroenterologist', icon: 'src/assets/Gastroenterologist.svg' },
  ]

  return (
    <section className="specialties">
      <div className="specialties-container">
        <h2>Doctor Specialties</h2>
        <p>Simply browse through our extensive list of trusted doctors, schedule your appointment hassle-free.</p>
        
        <div className="specialties-grid">
          {specialties.map((specialty, index) => (
            <div key={index} className="specialty-card">
              <div className="specialty-icon">
                <img src={specialty.icon} alt={specialty.name} />
              </div>
              <p>{specialty.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Specialties
