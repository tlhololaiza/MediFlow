import { useState, useEffect } from 'react'
import { useAuth } from '../../context/Authcontext'
import { getDoctorAppointments, updateAppointmentStatus } from '../../services/firestoreService'
import './DoctorAppointments.css'

const DoctorAppointments = () => {
  const { currentUser } = useAuth()
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editStatus, setEditStatus] = useState('')
  const itemsPerPage = 6

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!currentUser) return

      try {
        setLoading(true)
        const doctorAppointments = await getDoctorAppointments(currentUser.uid)
        setAppointments(doctorAppointments)
      } catch (err) {
        console.error('Error fetching appointments:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAppointments()
  }, [currentUser])

  const handleStatusChange = async (appointmentId: string) => {
    try {
      await updateAppointmentStatus(appointmentId, editStatus)
      const updated = appointments.map(apt =>
        apt.id === appointmentId ? { ...apt, status: editStatus } : apt
      )
      setAppointments(updated)
      setEditingId(null)
    } catch (err) {
      console.error('Error updating appointment:', err)
    }
  }

  const filteredAppointments = appointments.filter(apt => {
    if (activeTab === 'all') return true
    return apt.status?.toLowerCase() === activeTab.toLowerCase()
  })

  const paginatedAppointments = filteredAppointments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage)

  if (loading) {
    return (
      <div className="doctor-appointments-page">
        <div className="appointments-header">
          <h1>Appointments Management</h1>
          <p>Manage your patient appointments.</p>
        </div>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <p>Loading appointments...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="doctor-appointments-page">
      <div className="doctor-appointments-header">
        <h1>Appointments Management</h1>
        <p>View and manage your patient appointments.</p>
      </div>

      <div className="doctor-appointments-container">
        <div className="doctor-appointments-main">
          {/* Tabs */}
          <div className="doctor-appointments-tabs">
            <button
              className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => { setActiveTab('all'); setCurrentPage(1) }}
            >
              All ({appointments.length})
            </button>
            <button
              className={`tab-btn ${activeTab === 'booked' ? 'active' : ''}`}
              onClick={() => { setActiveTab('booked'); setCurrentPage(1) }}
            >
              Upcoming
            </button>
            <button
              className={`tab-btn ${activeTab === 'completed' ? 'active' : ''}`}
              onClick={() => { setActiveTab('completed'); setCurrentPage(1) }}
            >
              Completed
            </button>
            <button
              className={`tab-btn ${activeTab === 'cancelled' ? 'active' : ''}`}
              onClick={() => { setActiveTab('cancelled'); setCurrentPage(1) }}
            >
              Cancelled
            </button>
          </div>

          {/* Appointments List */}
          <div className="doctor-appointments-list">
            {paginatedAppointments.length > 0 ? (
              paginatedAppointments.map((apt) => (
                <div key={apt.id} className="doctor-appointment-card">
                  <div className="doctor-apt-header">
                    <div className="patient-info">
                      <h3>{apt.patientName || 'Patient'}</h3>
                      <p className="patient-email">{apt.patientEmail || 'N/A'}</p>
                    </div>
                    <span className={`status-badge ${apt.status?.toLowerCase()}`}>
                      {apt.status}
                    </span>
                  </div>

                  <div className="doctor-apt-details">
                    <div className="detail-item">
                      <i className='bx bx-calendar'></i>
                      <div>
                        <label>Date</label>
                        <p>{apt.date}</p>
                      </div>
                    </div>
                    <div className="detail-item">
                      <i className='bx bx-time'></i>
                      <div>
                        <label>Time</label>
                        <p>{apt.time}</p>
                      </div>
                    </div>
                    <div className="detail-item">
                      <i className='bx bx-credit-card'></i>
                      <div>
                        <label>Fee</label>
                        <p>ZAR {apt.consultationFee}</p>
                      </div>
                    </div>
                    <div className="detail-item">
                      <i className='bx bx-credit-card'></i>
                      <div>
                        <label>Payment</label>
                        <p>{apt.paymentMethod || 'Not specified'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="doctor-apt-notes">
                    <label>Notes</label>
                    <p>{apt.notes || 'No notes added'}</p>
                  </div>

                  <div className="doctor-apt-footer">
                    {editingId === apt.id ? (
                      <div className="status-edit">
                        <select 
                          value={editStatus} 
                          onChange={(e) => setEditStatus(e.target.value)}
                          className="status-select"
                        >
                          <option value="Booked">Upcoming</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                          <option value="No Show">No Show</option>
                        </select>
                        <button 
                          className="doctor-save-btn"
                          onClick={() => handleStatusChange(apt.id)}
                        >
                          Save
                        </button>
                        <button 
                          className="cancel-btn"
                          onClick={() => setEditingId(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="doctor-apt-actions">
                        <button 
                          className="doctor-edit-btn"
                          onClick={() => {
                            setEditingId(apt.id)
                            setEditStatus(apt.status)
                          }}
                        >
                          <i className='bx bx-edit'></i>
                          Update Status
                        </button>
                        <button className="contact-btn">
                          <i className='bx bx-envelope'></i>
                          Contact Patient
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="no-appointments">
                <i className='bx bx-calendar-x'></i>
                <h3>No appointments found</h3>
                <p>You don't have any {activeTab !== 'all' ? activeTab : ''} appointments.</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button 
                className="page-nav" 
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
              >
                <i className='bx bx-chevron-left'></i>
              </button>
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index + 1}
                  className={`page-num ${currentPage === index + 1 ? 'active' : ''}`}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
              <button 
                className="page-nav" 
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
              >
                <i className='bx bx-chevron-right'></i>
              </button>
            </div>
          )}
        </div>
      </div>

      
    </div>
  )
}

export default DoctorAppointments
