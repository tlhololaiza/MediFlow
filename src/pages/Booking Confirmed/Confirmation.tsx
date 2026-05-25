import { useLocation, useNavigate } from 'react-router-dom'
import Footer from '../../components/Footer/Footer'
import './Confirmation.css'

interface BookingData {
  doctorName: string
  specialty: string
  date: string
  time: string
  paymentMethod: string
  consultationFee: number
}

const Confirmation = () => {
  const location = useLocation()
  const navigate = useNavigate()
  
  const bookingData = location.state as BookingData || {
    doctorName: 'Dr. Richard James',
    specialty: 'General physician',
    date: 'Mon, Jan 20',
    time: '10:00 AM',
    paymentMethod: 'Credit/Debit Card',
    consultationFee: 50
  }

  return (
    <div className="confirmation-page">
      <section className="confirmation-section">
        <div className="confirmation-container">
          <div className="confirmation-icon">
            <i className='bx bx-check-circle'></i>
          </div>
          <h1>Booking Confirmed!</h1>
          <p>Your appointment has been successfully booked.</p>
          
          <div className="booking-details">
            <div className="detail-item">
              <div className="detail-label">
                <i className='bx bx-user'></i>
                <span>Doctor</span>
              </div>
              <div className="detail-value">{bookingData.doctorName}</div>
            </div>
            
            <div className="detail-item">
              <div className="detail-label">
                <i className='bx bx-stethoscope'></i>
                <span>Specialty</span>
              </div>
              <div className="detail-value">{bookingData.specialty}</div>
            </div>
            
            <div className="detail-item">
              <div className="detail-label">
                <i className='bx bx-calendar'></i>
                <span>Date</span>
              </div>
              <div className="detail-value">{bookingData.date}</div>
            </div>
            
            <div className="detail-item">
              <div className="detail-label">
                <i className='bx bx-time'></i>
                <span>Time</span>
              </div>
              <div className="detail-value">{bookingData.time}</div>
            </div>
            
            <div className="detail-item">
              <div className="detail-label">
                <i className='bx bx-credit-card'></i>
                <span>Payment Method</span>
              </div>
              <div className="detail-value">{bookingData.paymentMethod}</div>
            </div>
            
            <div className="detail-item total">
              <div className="detail-label">
                <i className='bx bx-dollar-circle'></i>
                <span>Total Amount</span>
              </div>
              <div className="detail-value">${bookingData.consultationFee}</div>
            </div>
          </div>

          <p className="confirmation-message">
            A confirmation email has been sent to your registered email address. 
            Please arrive 10 minutes before your appointment.
          </p>

          <div className="button-group">
            <button className="btn-back" onClick={() => navigate('/doctors')}>
              Back to Doctors
            </button>
            <button className="btn-home" onClick={() => navigate('/')}>
              Go to Home
            </button>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  )
}

export default Confirmation
