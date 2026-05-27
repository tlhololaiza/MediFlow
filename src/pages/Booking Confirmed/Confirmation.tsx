import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Footer from '../../components/Footer/Footer'
import './Confirmation.css'
import { getDoc, doc } from 'firebase/firestore'
import { db } from '../../firebaseConfig'

const Confirmation = () => {
  const location = useLocation()
  const navigate = useNavigate()
  
  const [appointment, setAppointment] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Get appointmentId from location state (passed from Booking page)
  const appointmentId = location.state?.appointmentId

  useEffect(() => {
    const fetchAppointment = async () => {
      if (!appointmentId) {
        setError('No appointment ID provided. Please book an appointment.')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const appointmentRef = doc(db, 'appointments', appointmentId)
        const appointmentSnap = await getDoc(appointmentRef)
        
        if (appointmentSnap.exists()) {
          setAppointment({
            id: appointmentSnap.id,
            ...appointmentSnap.data()
          })
        } else {
          setError('Appointment not found. Please try booking again.')
        }
      } catch (err: any) {
        setError('Error fetching appointment: ' + err.message)
        console.error('Error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAppointment()
  }, [appointmentId])

  if (loading) {
    return (
      <div className="confirmation-page">
        <section className="confirmation-section">
          <div className="confirmation-container">
            <div style={{ textAlign: 'center', padding: '50px' }}>
              <p>Loading appointment details...</p>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    )
  }

  if (error || !appointment) {
    return (
      <div className="confirmation-page">
        <section className="confirmation-section">
          <div className="confirmation-container">
            <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
              <p>{error || 'Appointment details not found'}</p>
              <button onClick={() => navigate('/doctors')} style={{ marginTop: '20px' }}>
                Book New Appointment
              </button>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    )
  }

  const bookingData = {
    appointmentId: appointment.id,
    doctorName: appointment.doctorName || 'Unknown Doctor',
    specialty: appointment.specialty || 'General',
    date: appointment.date || 'Not specified',
    time: appointment.time || 'Not specified',
    paymentMethod: appointment.paymentMethod || 'Not specified',
    consultationFee: appointment.consultationFee || 0
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
                <i className='bx bx-receipt'></i>
                <span>Appointment ID</span>
              </div>
              <div className="detail-value" style={{ fontSize: '0.9em', fontFamily: 'monospace' }}>
                {bookingData.appointmentId || 'Processing...'}
              </div>
            </div>
            
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
              <div className="detail-value">ZAR {bookingData.consultationFee}</div>
            </div>
          </div>

          <p className="confirmation-message">
            Your appointment has been successfully saved to your account. 
            You can view it anytime in your <strong>Appointments</strong> page.
            Please arrive 10 minutes before your scheduled appointment time.
          </p>

          <div className="button-group">
            <button className="btn-back" onClick={() => navigate('/appointments')}>
              View My Appointments
            </button>
            <button className="btn-home" onClick={() => navigate('/doctors')}>
              Book Another Appointment
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
