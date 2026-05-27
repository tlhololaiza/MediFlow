import { useState, useEffect } from 'react'
import Footer from '../../components/Footer/Footer'
import { useAuth } from '../../context/Authcontext'
import { getPatientAppointments, updateAppointmentStatus } from '../../services/firestoreService'
import './Appointments.css'

const Appointments = () => {
  const { currentUser } = useAuth()
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  // Fetch appointments from Firestore
  useEffect(() => {
    const fetchAppointments = async () => {
      if (!currentUser) return

      try {
        setLoading(true)
        const userAppointments = await getPatientAppointments(currentUser.uid)
        setAppointments(userAppointments)
      } catch (err) {
        console.error('Error fetching appointments:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAppointments()
  }, [currentUser])

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Completed':
        return 'completed'
      case 'Cancelled':
        return 'cancelled'
      case 'No Show':
        return 'no-show'
      case 'Upcoming':
        return 'upcoming'
      default:
        return ''
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
      <div className="appointments-page">
        <div className="appointments-header">
          <h1>Appointment History</h1>
          <p>View and manage your appointments.</p>
        </div>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <p>Loading appointments...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="appointments-page">
      <div className="appointments-header">
        <h1>Appointment History</h1>
        <p>View and manage your past appointments.</p>
      </div>

      <div className="appointments-container">
        {/* Main Content */}
        <div className="appointments-main">
          {/* Tabs */}
          <div className="appointments-tabs">
            <button
              className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => { setActiveTab('all'); setCurrentPage(1) }}
            >
              All
            </button>
            <button
              className={`tab-btn ${activeTab === 'upcoming' ? 'active' : ''}`}
              onClick={() => { setActiveTab('upcoming'); setCurrentPage(1) }}
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
            <button
              className={`tab-btn ${activeTab === 'no show' ? 'active' : ''}`}
              onClick={() => { setActiveTab('no show'); setCurrentPage(1) }}
            >
              No Show
            </button>
          </div>

          {/* Filter and Date Range */}
          <div className="filter-section">
            <div className="date-range">
              <i className='bx bx-calendar'></i>
              <span>May 1, 2024 - May 31, 2024</span>
            </div>
            <button className="filter-btn">
              <i className='bx bx-filter'></i>
              Filter
            </button>
          </div>

          {/* Appointments List */}
          <div className="appointments-list">
            {paginatedAppointments.length > 0 ? (
              paginatedAppointments.map((apt) => (
                <div key={apt.id} className="appointment-card">
                  <div className="apt-doctor-info">
                    <img src={'https://via.placeholder.com/60'} alt={apt.doctorName} className="doctor-img" />
                    <div className="doctor-details">
                      <h3>{apt.doctorName}</h3>
                      <p className="specialty">{apt.specialty}</p>
                      <div className="rating">
                        <i className='bx bxs-star'></i>
                        <span>4.8</span>
                        <span className="reviews">(120 reviews)</span>
                      </div>
                    </div>
                  </div>

                  <div className="apt-details-grid">
                    <div className="apt-detail">
                      <i className='bx bx-calendar'></i>
                      <div>
                        <p className="label">Date</p>
                        <p className="value">{apt.date}</p>
                        <p className="sub">-</p>
                      </div>
                    </div>

                    <div className="apt-detail">
                      <i className='bx bx-time'></i>
                      <div>
                        <p className="label">Time</p>
                        <p className="value">{apt.time}</p>
                        <p className="sub">30 min</p>
                      </div>
                    </div>

                    <div className="apt-detail">
                      <i className='bx bx-map'></i>
                      <div>
                        <p className="label">Location</p>
                        <p className="value">Medical Center</p>
                        <p className="sub">City</p>
                      </div>
                    </div>
                  </div>

                  <div className="apt-footer">
                    <span className={`status-badge ${getStatusColor(apt.status)}`}>
                      {apt.status === 'Completed' && <i className='bx bx-check-circle'></i>}
                      {apt.status === 'Cancelled' && <i className='bx bx-x-circle'></i>}
                      {apt.status === 'No Show' && <i className='bx bx-time'></i>}
                      {apt.status}
                    </span>
                    <button className="view-details-btn">
                      View Details
                      <i className='bx bx-chevron-right'></i>
                    </button>
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
              <button className="page-nav" onClick={() => setCurrentPage(1)}>
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
              <button className="page-nav" onClick={() => setCurrentPage(totalPages)}>
                <i className='bx bx-chevron-right'></i>
              </button>
            </div>
          )}

          {/* Results Info */}
          <div className="results-info">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredAppointments.length)} of {filteredAppointments.length} appointments
          </div>
        </div>

        {/* Sidebar */}
        <div className="appointments-sidebar">
          {/* Summary Card */}
          <div className="summary-card">
            <div className="summary-header">
              <h3>Appointment Summary</h3>
              <i className='bx bx-calendar'></i>
            </div>
            <div className="summary-stats">
              <div className="summary-stat">
                <span className="stat-label">Total Appointments</span>
                <span className="stat-value">{appointments.length}</span>
              </div>
              <div className="summary-stat completed">
                <span className="stat-label">Completed</span>
                <span className="stat-value">{appointments.filter(a => a.status === 'Completed').length}</span>
              </div>
              <div className="summary-stat cancelled">
                <span className="stat-label">Cancelled</span>
                <span className="stat-value">{appointments.filter(a => a.status === 'Cancelled').length}</span>
              </div>
              <div className="summary-stat no-show">
                <span className="stat-label">No Show</span>
                <span className="stat-value">{appointments.filter(a => a.status === 'No Show').length}</span>
              </div>
              <div className="summary-stat upcoming">
                <span className="stat-label">Upcoming</span>
                <span className="stat-value">{appointments.filter(a => a.status === 'Booked').length}</span>
              </div>
            </div>
          </div>

          {/* Can't Find Card */}
          <div className="help-card">
            <h3>Can't find your appointment?</h3>
            <p>If you can't find the appointment you're looking for, please contact our support team.</p>
            <button className="contact-support-btn">
              <i className='bx bx-headphone'></i>
              Contact Support
            </button>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions-sidebar">
            <h3>Quick Actions</h3>
            <div className="action-item">
              <i className='bx bx-calendar-plus'></i>
              <div>
                <p>Book New Appointment</p>
              </div>
              <i className='bx bx-chevron-right'></i>
            </div>
            <div className="action-item">
              <i className='bx bx-search-alt'></i>
              <div>
                <p>Find Doctors</p>
              </div>
              <i className='bx bx-chevron-right'></i>
            </div>
            <div className="action-item">
              <i className='bx bx-file'></i>
              <div>
                <p>View Prescriptions</p>
              </div>
              <i className='bx bx-chevron-right'></i>
            </div>
            <div className="action-item">
              <i className='bx bx-credit-card'></i>
              <div>
                <p>Payment History</p>
              </div>
              <i className='bx bx-chevron-right'></i>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Appointments
