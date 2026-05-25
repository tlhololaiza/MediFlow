import React from 'react'
import { useNavigate } from 'react-router-dom'
import './DoctorCard.css'
import docImage from '../../assets/doc1.png'

interface DoctorCardProps {
  id?: number
  name?: string
  specialty?: string
  available?: boolean
  image?: string
}

const DoctorCard: React.FC<DoctorCardProps> = ({
  id = 1,
  name = 'Dr. Richard James',
  specialty = 'General physician',
  available = true,
  image = docImage
}) => {
  const navigate = useNavigate()

  const handleCardClick = () => {
    navigate(`/booking/${id}`)
  }

  return (
    <div className="doctor-card" onClick={handleCardClick}>
      <div className="doctor-image-container">
        <img src={image} alt={name} className="doctor-image" />
      </div>
      <div className="doctor-info">
        <div className="availability-status">
          <span className={`status-indicator ${available ? 'available' : 'unavailable'}`}></span>
          <span className={`status-text ${available ? '' : 'unavailable'}`}>{available ? 'Available' : 'Unavailable'}</span>
        </div>
        <h3 className="doctor-name">{name}</h3>
        <p className="doctor-specialty">{specialty}</p>
      </div>
    </div>
  )
}

export default DoctorCard
