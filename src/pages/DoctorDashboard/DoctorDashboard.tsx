import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getUserProfile, getDoctorAppointments } from '../../services/firestoreService'
import './DoctorDashboard.css'

const DoctorDashboard = () => {
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState<any>(null)
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    upcoming: 0,
    cancelled: 0
  })

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) return

      try {
        setLoading(true)
        
        // Fetch doctor profile
        const userProfile = await getUserProfile(currentUser.uid)
        setProfile(userProfile)

        // Fetch doctor's appointments
        const doctorAppointments = await getDoctorAppointments(currentUser.uid)
        setAppointments(doctorAppointments)

        // Calculate statistics
        const stats = {
          total: doctorAppointments.length,
          completed: doctorAppointments.filter(a => a.status === 'Completed').length,
          upcoming: doctorAppointments.filter(a => a.status === 'Booked').length,
          cancelled: doctorAppointments.filter(a => a.status === 'Cancelled').length
        }
        setStats(stats)
      } catch (err) {
        console.error('Error fetching doctor data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [currentUser])

  if (loading) {
    return (
      <div className="doctor-dashboard-page">
        <div className="dashboard-header">
          <h1>Doctor Dashboard</h1>
        </div>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <p>Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="doctor-dashboard-page">
      {/* Header */}
      <div className="dashboard-header">
        <h1>Doctor Dashboard</h1>
        <p>Welcome, Dr. {profile?.fullName || 'Doctor'}</p>
      </div>

      <div className="dashboard-container">
        {/* Main Content */}
        <div className="dashboard-main">
          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon total">
                <i className='bx bx-calendar-check'></i>
              </div>
              <div className="stat-content">
                <h3>Total Appointments</h3>
                <p className="stat-value">{stats.total}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon upcoming">
                <i className='bx bx-calendar-event'></i>
              </div>
              <div className="stat-content">
                <h3>Upcoming</h3>
                <p className="stat-value">{stats.upcoming}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon completed">
                <i className='bx bx-check-circle'></i>
              </div>
              <div className="stat-content">
                <h3>Completed</h3>
                <p className="stat-value">{stats.completed}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon cancelled">
                <i className='bx bx-x-circle'></i>
              </div>
              <div className="stat-content">
                <h3>Cancelled</h3>
                <p className="stat-value">{stats.cancelled}</p>
              </div>
            </div>
          </div>

          {/* Recent Appointments */}
          <div className="recent-appointments">
            <h2>Recent Appointments</h2>
            {appointments.length > 0 ? (
              <div className="appointments-table">
                <div className="table-header">
                  <div className="col-patient">Patient</div>
                  <div className="col-date">Date</div>
                  <div className="col-time">Time</div>
                  <div className="col-status">Status</div>
                  <div className="col-action">Action</div>
                </div>
                {appointments.slice(0, 5).map((apt) => (
                  <div key={apt.id} className="table-row">
                    <div className="col-patient">{apt.fullName || 'N/A'}</div>
                    <div className="col-date">{apt.date}</div>
                    <div className="col-time">{apt.time}</div>
                    <div className={`col-status ${apt.status?.toLowerCase()}`}>
                      {apt.status}
                    </div>
                    <div className="col-action">
                      <button className="view-btn">View</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ textAlign: 'center', color: '#999', padding: '20px' }}>
                No appointments scheduled yet
              </p>
            )}
          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            <h2>Quick Actions</h2>
            <div className="action-buttons">
              <button className="action-btn" onClick={() => navigate('/doctor/appointments')}>
                <i className='bx bx-calendar'></i>
                <span>View All Appointments</span>
              </button>
              <button className="action-btn" onClick={() => navigate('/doctor/availability')}>
                <i className='bx bx-time'></i>
                <span>Manage Availability</span>
              </button>
              <button className="action-btn" onClick={() => navigate('/profile')}>
                <i className='bx bx-user'></i>
                <span>Edit Profile</span>
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="dashboard-sidebar">
          {/* Profile Card */}
          <div className="doctor-profile-card">
            <div className="doctor-profile-header">
              <img src={profile?.image} alt={profile?.fullName} className="doctor-profile-img" />
              <h3>{profile?.fullName || 'Doctor Name'}</h3>
              <p className="specialty">{profile?.specialty || 'Specialization'}</p>
            </div>

            <div className="doctor-profile-info">
              <div className="info-item">
                <label>Email</label>
                <p>{profile?.email}</p>
              </div>
              <div className="info-item">
                <label>Phone</label>
                <p>{profile?.phone || 'Not set'}</p>
              </div>
              <div className="info-item">
                <label>Experience</label>
                <p>{profile?.experience || 'Not set'}</p>
              </div>
              <div className="info-item">
                <label>Consultation Fee</label>
                <p>ZAR {profile?.consultationFee || 0}</p>
              </div>
              <div className="info-item">
                <label>Status</label>
                <p style={{ color: profile?.available ? '#4CAF50' : '#ff1f1f' }}>
                  {profile?.available ? 'Available' : 'Unavailable'}
                </p>
              </div>
            </div>

            <button className="edit-profile-btn" onClick={() => navigate('/profile')}>
              <i className='bx bx-edit'></i>
              Edit Profile
            </button>
          </div>

          {/* Info Card */}
          <div className="doctor-info-card">
            <h3>Doctor Features</h3>
            <div className="doctor-feature-item">
              <i className='bx bx-info-circle'></i>
              <div>
                <h4>Manage Appointments</h4>
                <p>Update status, add notes, and track patient visits</p>
              </div>
            </div>
            <div className="doctor-feature-item">
              <i className='bx bx-time'></i>
              <div>
                <h4>Set Availability</h4>
                <p>Control when you're available for consultations</p>
              </div>
            </div>
            <div className="doctor-feature-item">
              <i className='bx bx-stats'></i>
              <div>
                <h4>View Analytics</h4>
                <p>Track appointments and patient statistics</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      
    </div>
  )
}

export default DoctorDashboard
