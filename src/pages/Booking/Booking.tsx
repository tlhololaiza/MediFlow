import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import './Booking.css'
import docImage from '../../assets/doc1.png'
import Footer from '../../components/Footer/Footer'

interface Doctor {
  id: number
  name: string
  specialty: string
  available: boolean
  image: string
  qualifications: string
  experience: string
  consultationFee: number
}

interface TimeSlot {
  id: string
  time: string
  available: boolean
}

const Booking = () => {
  const { doctorId } = useParams<{ doctorId: string }>()
  const navigate = useNavigate()

  // Mock doctor data - in real app, this would come from an API
  const doctorsData: Record<number, Doctor> = {
    1: {
      id: 1,
      name: 'Dr. Richard James',
      specialty: 'General physician',
      available: true,
      image: docImage,
      qualifications: 'MD, Board Certified',
      experience: '15+ years of experience',
      consultationFee: 50
    },
    2: {
      id: 2,
      name: 'Dr. Sarah Mitchell',
      specialty: 'Gynecologist',
      available: true,
      image: docImage,
      qualifications: 'MD, Fellowship in Obstetrics',
      experience: '12+ years of experience',
      consultationFee: 60
    },
    3: {
      id: 3,
      name: 'Dr. John Smith',
      specialty: 'Dermatologist',
      available: false,
      image: docImage,
      qualifications: 'MD, Dermatology Specialist',
      experience: '10+ years of experience',
      consultationFee: 55
    },
    4: {
      id: 4,
      name: 'Dr. Emily Brown',
      specialty: 'Pediatricians',
      available: true,
      image: docImage,
      qualifications: 'MD, Pediatric Specialist',
      experience: '8+ years of experience',
      consultationFee: 45
    },
    5: {
      id: 5,
      name: 'Dr. Michael Chen',
      specialty: 'Neurologist',
      available: true,
      image: docImage,
      qualifications: 'MD, Neurology Specialist',
      experience: '14+ years of experience',
      consultationFee: 70
    },
    6: {
      id: 6,
      name: 'Dr. Lisa Anderson',
      specialty: 'Gastroenterologist',
      available: true,
      image: docImage,
      qualifications: 'MD, Gastroenterology Specialist',
      experience: '11+ years of experience',
      consultationFee: 65
    },
  }

  const doctor = doctorsData[Number(doctorId)] || doctorsData[1]

  // Generate time slots
  const generateTimeSlots = (): TimeSlot[] => {
    const slots: TimeSlot[] = []
    const times = ['9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM']
    
    times.forEach((time, index) => {
      slots.push({
        id: `slot-${index}`,
        time: time,
        available: Math.random() > 0.3 // 70% of slots are available
      })
    })
    
    return slots
  }

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

  const [selectedDate, setSelectedDate] = useState(generateDates()[0])
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)
  const [showPayment, setShowPayment] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null)

  const timeSlots = generateTimeSlots()
  const dates = generateDates()

  const handleBooking = () => {
    if (selectedSlot && selectedDate) {
      setShowPayment(true)
    }
  }

  const handlePaymentSelect = (method: string) => {
    setSelectedPayment(method)
  }

  const handleConfirmPayment = () => {
    if (selectedPayment && selectedSlot) {
      const bookingData = {
        doctorName: doctor.name,
        specialty: doctor.specialty,
        date: selectedDate.dateString,
        time: selectedSlot.time,
        paymentMethod: selectedPayment,
        consultationFee: doctor.consultationFee
      }
      
      console.log('Booking confirmed:', bookingData)
      
      // Navigate to confirmation page with booking data
      navigate('/confirmation', { state: bookingData })
    }
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
            <img src={doctor.image} alt={doctor.name} className="doctor-image" />
            <div className="doctor-status">
              <span className={`status-badge ${doctor.available ? 'available' : 'unavailable'}`}>
                {doctor.available ? '✓ Available' : '✗ Unavailable'}
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
                  <p>${doctor.consultationFee}</p>
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
              {timeSlots.map((slot) => (
                <button
                  key={slot.id}
                  className={`time-slot-btn ${!slot.available ? 'disabled' : ''} ${selectedSlot?.id === slot.id ? 'selected' : ''}`}
                  onClick={() => slot.available && setSelectedSlot(slot)}
                  disabled={!slot.available}
                >
                  {slot.time}
                  {!slot.available && <span className="booked-label">Booked</span>}
                </button>
              ))}
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
                  <strong>${doctor.consultationFee}</strong>
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
                disabled={!selectedPayment}
              >
                Confirm Booking
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
