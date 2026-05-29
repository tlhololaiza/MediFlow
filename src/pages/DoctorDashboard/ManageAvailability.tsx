import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { db } from '../../firebaseConfig'
import { collection, query, where, getDocs, setDoc, doc } from 'firebase/firestore'
import './ManageAvailability.css'

const ManageAvailability = () => {
  const { currentUser } = useAuth()
  const [availability, setAvailability] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [newAvailability, setNewAvailability] = useState({
    date: '',
    startTime: '09:00',
    endTime: '17:00',
    slots: 8
  })

  useEffect(() => {
    fetchAvailability()
  }, [currentUser])

  const fetchAvailability = async () => {
    if (!currentUser) return

    try {
      setLoading(true)
      const q = query(
        collection(db, 'availability'),
        where('doctorId', '==', currentUser.uid)
      )
      const snapshot = await getDocs(q)
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setAvailability(data)
    } catch (err) {
      console.error('Error fetching availability:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddAvailability = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser || !newAvailability.date) return

    try {
      const docId = `${currentUser.uid}_${newAvailability.date}`
      await setDoc(doc(db, 'availability', docId), {
        doctorId: currentUser.uid,
        date: newAvailability.date,
        startTime: newAvailability.startTime,
        endTime: newAvailability.endTime,
        slots: newAvailability.slots,
        createdAt: new Date()
      })

      // Refresh availability list
      await fetchAvailability()
      setNewAvailability({
        date: '',
        startTime: '09:00',
        endTime: '17:00',
        slots: 8
      })
    } catch (err) {
      console.error('Error adding availability:', err)
    }
  }

  const handleDeleteAvailability = async (availabilityId: string) => {
    try {
      // Note: You'd need to implement a deleteDoc function in your service
      // For now, just remove from local state
      setAvailability(availability.filter(a => a.id !== availabilityId))
    } catch (err) {
      console.error('Error deleting availability:', err)
    }
  }

  const generateTimeSlots = (startTime: string, endTime: string, interval: number = 30) => {
    const slots = []
    const [startHour, startMin] = startTime.split(':').map(Number)
    const [endHour, endMin] = endTime.split(':').map(Number)

    let current = new Date()
    current.setHours(startHour, startMin, 0)
    const end = new Date()
    end.setHours(endHour, endMin, 0)

    while (current < end) {
      slots.push(current.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }))
      current.setMinutes(current.getMinutes() + interval)
    }

    return slots
  }

  if (loading) {
    return (
      <div className="manage-availability-page">
        <div className="availability-header">
          <h1>Manage Availability</h1>
          <p>Set your consultation hours.</p>
        </div>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <p>Loading availability...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="manage-availability-page">
      <div className="availability-header">
        <h1>Manage Availability</h1>
        <p>Set your consultation hours and time slots.</p>
      </div>

      <div className="availability-container">
        <div className="availability-main">
          {/* Add New Availability Form */}
          <div className="form-card">
            <h2>Add Availability</h2>
            <form className="availability-form" onSubmit={handleAddAvailability}>
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  required
                  value={newAvailability.date}
                  onChange={(e) => setNewAvailability({
                    ...newAvailability,
                    date: e.target.value
                  })}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Start Time</label>
                  <input
                    type="time"
                    value={newAvailability.startTime}
                    onChange={(e) => setNewAvailability({
                      ...newAvailability,
                      startTime: e.target.value
                    })}
                  />
                </div>

                <div className="form-group">
                  <label>End Time</label>
                  <input
                    type="time"
                    value={newAvailability.endTime}
                    onChange={(e) => setNewAvailability({
                      ...newAvailability,
                      endTime: e.target.value
                    })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Number of Slots</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={newAvailability.slots}
                  onChange={(e) => setNewAvailability({
                    ...newAvailability,
                    slots: parseInt(e.target.value)
                  })}
                />
              </div>

              <button type="submit" className="availability-submit-btn">
                <i className='bx bx-plus'></i>
                Add Availability
              </button>
            </form>

            {/* Time Slots Preview */}
            {newAvailability.startTime && newAvailability.endTime && (
              <div className="slots-preview">
                <h3>Available Time Slots</h3>
                <div className="slots-grid">
                  {generateTimeSlots(newAvailability.startTime, newAvailability.endTime).map((slot) => (
                    <div key={slot} className="slot-item">
                      {slot}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Current Availability List */}
          <div className="availability-list">
            <h2>Your Availability</h2>
            {availability.length > 0 ? (
              <div className="availability-grid">
                {availability.map((avail) => (
                  <div key={avail.id} className="availability-card">
                    <div className="card-header">
                      <div className="date-section">
                        <i className='bx bx-calendar'></i>
                        <div>
                          <h3>{new Date(avail.date).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}</h3>
                          <p>{avail.date}</p>
                        </div>
                      </div>
                      <button 
                        className="delete-btn"
                        onClick={() => handleDeleteAvailability(avail.id)}
                      >
                        <i className='bx bx-trash'></i>
                      </button>
                    </div>

                    <div className="card-content">
                      <div className="info-item">
                        <label>Time Range</label>
                        <p>{avail.startTime} - {avail.endTime}</p>
                      </div>
                      <div className="info-item">
                        <label>Slots Available</label>
                        <p>{avail.slots}</p>
                      </div>
                    </div>

                    <div className="slots-section">
                      <label>Generated Slots</label>
                      <div className="slots-grid">
                        {generateTimeSlots(avail.startTime, avail.endTime).slice(0, avail.slots).map((slot) => (
                          <div key={slot} className="slot-badge">
                            {slot}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-availability">
                <i className='bx bx-time'></i>
                <h3>No availability set</h3>
                <p>Add your first available time slot using the form above.</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar - Tips */}
        <div className="availability-sidebar">
          <div className="tips-card">
            <h3>Tips for Managing Availability</h3>
            <div className="tip-item">
              <i className='bx bx-info-circle'></i>
              <div>
                <h4>Set Regular Hours</h4>
                <p>Establish consistent consultation hours to help patients plan better.</p>
              </div>
            </div>
            <div className="tip-item">
              <i className='bx bx-info-circle'></i>
              <div>
                <h4>Plan Ahead</h4>
                <p>Add availability for upcoming weeks to attract more bookings.</p>
              </div>
            </div>
            <div className="tip-item">
              <i className='bx bx-info-circle'></i>
              <div>
                <h4>Manage Slots</h4>
                <p>Ensure you have enough slots available for your consultation capacity.</p>
              </div>
            </div>
          </div>

          <div className="stats-card">
            <h3>Availability Stats</h3>
            <div className="stat-row">
              <span>Active Dates</span>
              <strong>{availability.length}</strong>
            </div>
            <div className="stat-row">
              <span>Total Slots</span>
              <strong>{availability.reduce((sum, a) => sum + a.slots, 0)}</strong>
            </div>
            <div className="stat-row">
              <span>Status</span>
              <span style={{ color: availability.length > 0 ? '#4CAF50' : '#f44336' }}>
                {availability.length > 0 ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>
      </div>

      
    </div>
  )
}

export default ManageAvailability
