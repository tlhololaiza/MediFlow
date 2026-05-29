import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import './Booking.css'
import Footer from '../../components/Footer/Footer'
import { getDoctorById, getAvailability, createAppointment } from '../../services/firestoreService'
import { useAuth } from '../../context/AuthContext'

interface TimeSlot {
  time: string
  available: boolean
}

const Booking = () => {
  const { doctorId } = useParams<{ doctorId: string }>()
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  
  const [doctor, setDoctor] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [selectedDate, setSelectedDate] = useState<any>(null)
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)
  const [showPayment, setShowPayment] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null)
  const [bookingLoading, setBookingLoading] = useState(false)

  // Generate next 7 days
  const generateDates = () => {
    const dates = []
    for (let i = 1; i <= 7; i++) {
      const date = new Date()
      date.setDate(date.getDate() + i)
      dates.push({
        id: `date-${i}`,
        date: date,
        dateString: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
      })
    }
    return dates
  }

  const dates = generateDates()
  
  // Initialize selectedDate with first generated date
  useEffect(() => {
    if (!selectedDate) {
      setSelectedDate(dates[0])
    }
  }, [dates, selectedDate])

  // Fetch doctor data from Firestore
  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        setLoading(true)
        if (doctorId) {
          const doctorData = await getDoctorById(doctorId)
          if (doctorData) {
            setDoctor(doctorData)
          } else {
            setError('Doctor not found')
          }
        }
      } catch (err: any) {
        setError(err.message)
        console.error('Error fetching doctor:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchDoctor()
  }, [doctorId])

  // Fetch availability when date is selected
  useEffect(() => {
    const fetchAvailability = async () => {
      if (selectedDate && doctorId) {
        try {
          const availabilityData = await getAvailability(doctorId, selectedDate.date.toISOString().split('T')[0])
          if (availabilityData && availabilityData.timeSlots) {
            setTimeSlots(availabilityData.timeSlots)
          } else {
            // No availability data, show default slots
            const defaultSlots = ['9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM'].map(time => ({
              time,
              available: true
            }))
            setTimeSlots(defaultSlots)
          }
        } catch (err) {
          console.error('Error fetching availability:', err)
        }
      }
    }

    fetchAvailability()
  }, [selectedDate, doctorId])
  const handleBooking = () => {
    if (selectedSlot && selectedDate) {
      setShowPayment(true)
    }
  }

  const handlePaymentSelect = (method: string) => {
    setSelectedPayment(method)
  }

  const handleConfirmPayment = async () => {
    if (!selectedPayment || !selectedSlot || !currentUser || !doctor) {
      alert('Please fill all required fields')
      return
    }

    setBookingLoading(true)
    try {
      const appointmentData = {
        patientId: currentUser.uid,
        doctorId: doctorId,
        doctorName: doctor.name,
        specialty: doctor.specialty,
        date: selectedDate.date.toISOString().split('T')[0],
        time: selectedSlot.time,
        paymentMethod: selectedPayment,
        consultationFee: doctor.consultationFee
      }

      // Create appointment in Firestore
      const appointmentId = await createAppointment(appointmentData)

      // Navigate to confirmation page with booking data
      const bookingData = {
        doctorName: doctor.name,
        specialty: doctor.specialty,
        date: selectedDate.dateString,
        time: selectedSlot.time,
        paymentMethod: selectedPayment,
        consultationFee: doctor.consultationFee,
        appointmentId
      }
      navigate('/confirmation', { state: bookingData })
    } catch (err: any) {
      alert('Error creating appointment: ' + err.message)
      console.error('Error booking appointment:', err)
    } finally {
      setBookingLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="booking-page">
        <section className="hero-section">
          <div className="hero-content">
            <h1>Book an Appointment</h1>
            <p>Schedule your consultation with a healthcare professional</p>
          </div>
        </section>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <p>Loading doctor information...</p>
        </div>
      </div>
    )
  }

  if (error || !doctor) {
    return (
      <div className="booking-page">
        <section className="hero-section">
          <div className="hero-content">
            <h1>Book an Appointment</h1>
            <p>Schedule your consultation with a healthcare professional</p>
          </div>
        </section>
        <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
          <p>{error || 'Doctor not found'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="booking-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Book an Appointment</h1>
          <p>Schedule your consultation with a healthcare professional</p>
        </div>
      </section>

      {/* Doctor Details Section */}
      <section className="doctor-details-section">
        <div className="doctor-details-container">
          <div className="doctor-image-section">
            {doctor.image && <img src={doctor.image} alt={doctor.name} className="doctor-image" />}
            <div className="doctor-status">
              <span className={`status-badge available`}>
                ✓ Available
              </span>
            </div>
          </div>

          <div className="doctor-info-section">
            <h2>{doctor.name}</h2>
            <p className="specialty">{doctor.specialty}</p>
            
            <div className="info-grid">
              <div className="info-item">
                <i className='bx bx-award'></i>
                <div>
                  <label>Qualifications</label>
                  <p>{doctor.qualifications}</p>
                </div>
              </div>
              <div className="info-item">
                <i className='bx bx-briefcase'></i>
                <div>
                  <label>Experience</label>
                  <p>{doctor.experience}</p>
                </div>
              </div>
              <div className="info-item">
                <i className='bx bx-dollar-circle'></i>
                <div>
                  <label>Consultation Fee</label>
                  <p>ZAR {doctor.consultationFee}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Form Section */}
      <section className="booking-form-section">
        <div className="booking-container">
          <h2>Select Your Appointment</h2>

          {/* Date Selection */}
          <div className="booking-section">
            <h3>Select Date</h3>
            <div className="dates-grid">
              {dates.map((date) => (
                <button
                  key={date.id}
                  className={`date-btn ${selectedDate.id === date.id ? 'selected' : ''}`}
                  onClick={() => setSelectedDate(date)}
                >
                  {date.dateString}
                </button>
              ))}
            </div>
          </div>

          {/* Time Slot Selection */}
          <div className="booking-section">
            <h3>Select Time Slot</h3>
            <div className="time-slots-grid">
              {timeSlots.length > 0 ? (
                timeSlots.map((slot, index) => (
                  <button
                    key={index}
                    className={`time-slot-btn ${!slot.available ? 'disabled' : ''} ${selectedSlot?.time === slot.time ? 'selected' : ''}`}
                    onClick={() => slot.available && setSelectedSlot(slot)}
                    disabled={!slot.available}
                  >
                    {slot.time}
                    {!slot.available && <span className="booked-label">Booked</span>}
                  </button>
                ))
              ) : (
                <p>Loading availability...</p>
              )}
            </div>
          </div>

          {/* Booking Summary */}
          {selectedSlot && (
            <div className="booking-summary">
              <h3>Appointment Summary</h3>
              <div className="summary-items">
                <div className="summary-item">
                  <span>Doctor:</span>
                  <strong>{doctor.name}</strong>
                </div>
                <div className="summary-item">
                  <span>Specialty:</span>
                  <strong>{doctor.specialty}</strong>
                </div>
                <div className="summary-item">
                  <span>Date:</span>
                  <strong>{selectedDate.dateString}</strong>
                </div>
                <div className="summary-item">
                  <span>Time:</span>
                  <strong>{selectedSlot.time}</strong>
                </div>
                <div className="summary-item total">
                  <span>Total Fee:</span>
                  <strong>ZAR {doctor.consultationFee}</strong>
                </div>
              </div>
              <button className="btn-book" onClick={handleBooking}>
                Proceed to Payment
              </button>
            </div>
          )}

          {!selectedSlot && (
            <div className="info-message">
              <i className='bx bx-info-circle'></i>
              <p>Please select a date and time slot to continue</p>
            </div>
          )}
        </div>
      </section>

      {/* Payment Modal */}
      {showPayment && (
        <div className="payment-modal-overlay">
          <div className="payment-modal">
            <div className="payment-header">
              <h2>Select Payment Method</h2>
              <button className="close-btn" onClick={() => setShowPayment(false)}>
                <i className='bx bx-x'></i>
              </button>
            </div>

            <div className="payment-methods">
              <div
                className={`payment-method ${selectedPayment === 'credit-card' ? 'selected' : ''}`}
                onClick={() => handlePaymentSelect('Credit/Debit Card')}
              >
                <div className="payment-icon">
                  <i className='bx bx-credit-card'></i>
                </div>
                <div className="payment-info">
                  <h4>Credit/Debit Card</h4>
                  <p>Visa, Mastercard, American Express</p>
                </div>
                <div className="radio-btn">
                  <input
                    type="radio"
                    name="payment"
                    value="credit-card"
                    checked={selectedPayment === 'Credit/Debit Card'}
                    onChange={() => handlePaymentSelect('Credit/Debit Card')}
                  />
                </div>
              </div>

              <div
                className={`payment-method ${selectedPayment === 'insurance' ? 'selected' : ''}`}
                onClick={() => handlePaymentSelect('Insurance')}
              >
                <div className="payment-icon">
                  <i className='bx bx-shield-alt'></i>
                </div>
                <div className="payment-info">
                  <h4>Insurance</h4>
                  <p>Pay through your health insurance</p>
                </div>
                <div className="radio-btn">
                  <input
                    type="radio"
                    name="payment"
                    value="insurance"
                    checked={selectedPayment === 'Insurance'}
                    onChange={() => handlePaymentSelect('Insurance')}
                  />
                </div>
              </div>

              <div
                className={`payment-method ${selectedPayment === 'cash' ? 'selected' : ''}`}
                onClick={() => handlePaymentSelect('Cash')}
              >
                <div className="payment-icon">
                  <i className='bx bx-wallet'></i>
                </div>
                <div className="payment-info">
                  <h4>Cash</h4>
                  <p>Pay cash at the clinic/hospital</p>
                </div>
                <div className="radio-btn">
                  <input
                    type="radio"
                    name="payment"
                    value="cash"
                    checked={selectedPayment === 'Cash'}
                    onChange={() => handlePaymentSelect('Cash')}
                  />
                </div>
              </div>
            </div>

            <div className="payment-footer">
              <button className="btn-cancel" onClick={() => setShowPayment(false)}>
                Cancel
              </button>
              <button
                className="btn-confirm"
                onClick={handleConfirmPayment}
                disabled={!selectedPayment || bookingLoading}
              >
                {bookingLoading ? 'Processing...' : 'Confirm Booking'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer/>
      
    </div>

    
  )
}

export default Booking
