import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getAllAppointments, updateAppointmentStatus } from '../../services/firestoreService'
import './AdminAppointments.css'

const AdminAppointments = () => {
  const { currentUser } = useAuth()
  const [appointments, setAppointments] = useState<any[]>([])
  const [filteredAppointments, setFilteredAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    fetchAppointments()
  }, [currentUser])

  useEffect(() => {
    filterAppointments()
  }, [appointments, searchTerm, filterStatus])

  const fetchAppointments = async () => {
    try {
      setLoading(true)
      const allAppointments = await getAllAppointments()
      setAppointments(allAppointments.filter(a => !a.deletedAt))
    } catch (err) {
      console.error('Error fetching appointments:', err)
    } finally {
      setLoading(false)
    }
  }

  const filterAppointments = () => {
    let filtered = appointments

    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(a => a.status?.toLowerCase() === filterStatus)
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(a =>
        a.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.doctorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.email?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredAppointments(filtered)
  }

  const handleStatusChange = async (appointmentId: string, newStatus: string) => {
    try {
      await updateAppointmentStatus(appointmentId, newStatus)
      setAppointments(
        appointments.map(a =>
          a.id === appointmentId ? { ...a, status: newStatus } : a
        )
      )
      if (selectedAppointment?.id === appointmentId) {
        setSelectedAppointment({ ...selectedAppointment, status: newStatus })
      }
      alert('Status updated successfully!')
    } catch (err) {
      console.error('Error updating status:', err)
      alert('Failed to update status')
    }
  }

  const handleViewAppointment = (appointment: any) => {
    setSelectedAppointment(appointment)
    setShowModal(true)
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return '#32ff1f'
      case 'booked':
      case 'upcoming':
        return '#1f5dff'
      case 'cancelled':
        return '#ff1f1f'
      case 'pending':
        return '#e9ff1f'
      default:
        return '#999'
    }
  }

  if (loading) {
    return (
      <div className="admin-appointments-page">
        <div className="admin-appointments-header">
          <h1>Manage Appointments</h1>
        </div>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <p>Loading appointments...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-appointments-page">
      {/* Header */}
      <div className="admin-appointments-header">
        <div className="admin-header-top">
          <div>
            <h1>Manage Appointments</h1>
            <p>View and manage all patient appointments</p>
          </div>
        </div>
      </div>

      <div className="admin-appointments-container">
        {/* Toolbar */}
        <div className="admin-appointments-toolbar">
          <div className="search-box">
            <i className='bx bx-search'></i>
            <input
              type="text"
              placeholder="Search by patient name, doctor, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-buttons">
            <button
              className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
              onClick={() => setFilterStatus('all')}
            >
              All ({appointments.length})
            </button>
            <button
              className={`filter-btn ${filterStatus === 'booked' ? 'active' : ''}`}
              onClick={() => setFilterStatus('booked')}
            >
              Upcoming ({appointments.filter(a => a.status === 'Booked').length})
            </button>
            <button
              className={`filter-btn ${filterStatus === 'completed' ? 'active' : ''}`}
              onClick={() => setFilterStatus('completed')}
            >
              Completed ({appointments.filter(a => a.status === 'Completed').length})
            </button>
            <button
              className={`filter-btn ${filterStatus === 'cancelled' ? 'active' : ''}`}
              onClick={() => setFilterStatus('cancelled')}
            >
              Cancelled ({appointments.filter(a => a.status === 'Cancelled').length})
            </button>
            <button
              className={`filter-btn ${filterStatus === 'pending' ? 'active' : ''}`}
              onClick={() => setFilterStatus('pending')}
            >
              Pending ({appointments.filter(a => a.status === 'Pending').length})
            </button>
          </div>
        </div>

        {/* Appointments Table */}
        <div className="admin-appointments-table-wrapper">
          {filteredAppointments.length > 0 ? (
            <table className="admin-appointments-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Date & Time</th>
                  <th>Specialty</th>
                  <th>Status</th>
                  <th>Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map(apt => (
                  <tr key={apt.id}>
                    <td>
                      <div className="patient-cell">
                        <div className="patient-avatar">{apt.fullName?.charAt(0) || 'P'}</div>
                        <div className="patient-info">
                          <p className="patient-name">{apt.fullName || 'N/A'}</p>
                          <p className="patient-email">{apt.email || 'N/A'}</p>
                        </div>
                      </div>
                    </td>
                    <td>{apt.doctorName || 'N/A'}</td>
                    <td>
                      <div className="datetime-cell">
                        <p>{apt.date || 'N/A'}</p>
                        <p className="time">{apt.time || 'N/A'}</p>
                      </div>
                    </td>
                    <td>{apt.specialty || 'N/A'}</td>
                    <td>
                      <span className={`status-badge status-${apt.status?.toLowerCase()}`}>
                        {apt.status || 'Pending'}
                      </span>
                    </td>
                    <td>${apt.consultationFee || 0}</td>
                    <td>
                      <button
                        className="btn-view"
                        onClick={() => handleViewAppointment(apt)}
                        title="View details"
                      >
                        <i className='bx bx-show'></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="no-results">
              <i className='bx bx-search-alt-2'></i>
              <p>No appointments found</p>
            </div>
          )}
        </div>
      </div>

      {/* Appointment Details Modal */}
      {showModal && selectedAppointment && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Appointment Details</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                <i className='bx bx-x'></i>
              </button>
            </div>

            <div className="modal-body">
              {/* Patient Information */}
              <div className="detail-section">
                <h3>Patient Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Name</label>
                    <p>{selectedAppointment.fullName || 'N/A'}</p>
                  </div>
                  <div className="detail-item">
                    <label>Email</label>
                    <p>{selectedAppointment.email || 'N/A'}</p>
                  </div>
                  <div className="detail-item">
                    <label>Phone</label>
                    <p>{selectedAppointment.phone || 'N/A'}</p>
                  </div>
                  <div className="detail-item">
                    <label>Age</label>
                    <p>{selectedAppointment.age || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Appointment Information */}
              <div className="admin-detail-section">
                <h3>Appointment Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Doctor</label>
                    <p>{selectedAppointment.doctorName || 'N/A'}</p>
                  </div>
                  <div className="detail-item">
                    <label>Specialty</label>
                    <p>{selectedAppointment.specialty || 'N/A'}</p>
                  </div>
                  <div className="detail-item">
                    <label>Date</label>
                    <p>{selectedAppointment.date || 'N/A'}</p>
                  </div>
                  <div className="detail-item">
                    <label>Time</label>
                    <p>{selectedAppointment.time || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Medical Information */}
              <div className="admin-detail-section">
                <h3>Medical Information</h3>
                <div className="detail-item">
                  <label>Symptoms/Reason</label>
                  <p>{selectedAppointment.reason || 'N/A'}</p>
                </div>
                <div className="detail-item">
                  <label>Medical History</label>
                  <p>{selectedAppointment.medicalHistory || 'None provided'}</p>
                </div>
              </div>

              {/* Payment Information */}
              <div className="admin-detail-section">
                <h3>Payment Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Consultation Fee</label>
                    <p>${selectedAppointment.consultationFee || 0}</p>
                  </div>
                  <div className="detail-item">
                    <label>Payment Status</label>
                    <p>{selectedAppointment.paymentStatus || 'Pending'}</p>
                  </div>
                </div>
              </div>

              {/* Status Management */}
              <div className="admin-detail-section">
                <h3>Manage Status</h3>
                <div className="status-options">
                  {['Booked', 'Completed', 'Cancelled', 'Pending'].map(status => (
                    <button
                      key={status}
                      className={`status-option ${selectedAppointment.status === status ? 'active' : ''}`}
                      onClick={() => handleStatusChange(selectedAppointment.id, status)}
                      style={{
                        borderColor: getStatusColor(status),
                        color: selectedAppointment.status === status ? 'white' : getStatusColor(status),
                        background: selectedAppointment.status === status ? getStatusColor(status) : 'transparent'
                      }}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-close" onClick={() => setShowModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminAppointments
