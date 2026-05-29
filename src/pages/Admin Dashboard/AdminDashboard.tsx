import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getAllUsers, getAllAppointments, getDoctors } from '../../services/firestoreService'
import './AdminDashboard.css'

const AdminDashboard = () => {
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [appointments, setAppointments] = useState<any[]>([])
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    totalAppointments: 0,
    totalRevenue: 0,
    totalReviews: 0,
    completedAppointments: 0,
    upcomingAppointments: 0,
    cancelledAppointments: 0,
    activePatients: 0,
    activeDoctors: 0,
    pendingAppointments: 0
  })

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) return

      try {
        setLoading(true)

        // Fetch all users
        const allUsers = await getAllUsers()

        // Fetch all appointments
        const allAppointments = await getAllAppointments()
        setAppointments(allAppointments)

        // Fetch all doctors
        await getDoctors()

        // Calculate statistics
        const patients = allUsers.filter((u: any) => u.userType === 'patient')
        const doctors = allUsers.filter((u: any) => u.userType === 'doctor')
        const completedAppts = allAppointments.filter(a => a.status === 'Completed')
        const upcomingAppts = allAppointments.filter(a => a.status === 'Booked')
        const cancelledAppts = allAppointments.filter(a => a.status === 'Cancelled')

        // Calculate total revenue from completed appointments
        const totalRevenue = completedAppts.reduce((sum, apt) => {
          return sum + (apt.consultationFee || 0)
        }, 0)

        setStats({
          totalPatients: patients.length,
          totalDoctors: doctors.length,
          totalAppointments: allAppointments.length,
          totalRevenue,
          totalReviews: Math.floor(Math.random() * 5000) + 1000, // Mock data
          completedAppointments: completedAppts.length,
          upcomingAppointments: upcomingAppts.length,
          cancelledAppointments: cancelledAppts.length,
          activePatients: patients.filter(p => !p.deletedAt && p.isActive !== false).length,
          activeDoctors: doctors.filter(d => !d.deletedAt && d.isActive !== false).length,
          pendingAppointments: allAppointments.filter(a => a.status === 'Pending').length
        })
      } catch (err) {
        console.error('Error fetching admin data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [currentUser])

  // Prepare data for pie chart
  const appointmentStatusData = [
    { status: 'Completed', count: stats.completedAppointments, color: '#32ff1f' },
    { status: 'Upcoming', count: stats.upcomingAppointments, color: '#1f5dff' },
    { status: 'Cancelled', count: stats.cancelledAppointments, color: '#ff1f1f' },
    { status: 'Pending', count: stats.pendingAppointments, color: '#e9ff1f' }
  ]

  const totalApptCount = appointmentStatusData.reduce((sum, item) => sum + item.count, 0)

  if (loading) {
    return (
      <div className="admin-dashboard-page">
        <div className="admin-dashboard-header">
          <h1>Admin Dashboard</h1>
        </div>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <p>Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-dashboard-page">
      {/* Header */}
      <div className="admin-dashboard-header">
        <div className="admin-header-content">
          <div>
            <h1>Dashboard</h1>
            <p>Welcome back, Admin! Here's what's happening today.</p>
          </div>
          <div className="date-range">
            <i className='bx bx-calendar'></i>
            <select>
              <option>May 24, 2024 - May 30, 2024</option>
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 3 months</option>
            </select>
          </div>
        </div>
      </div>

      <div className="admin-container">
        {/* Main Content */}
        <div className="admin-main">
          {/* Stats Cards */}
          <div className="admin-stats-grid">
            <div className="admin-stat-card">
              <div className="admin-stat-icon patients">
                <i className='bx bx-user-check'></i>
              </div>
              <div className="admin-stat-content">
                <h3>Total Patients</h3>
                <p className="admin-stat-value">{stats.totalPatients}</p>
                <span className="admin-stat-change">↑ 12.5% vs last 7 days</span>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="admin-stat-icon doctors">
                <i className='bx bx-user-md'></i>
              </div>
              <div className="admin-stat-content">
                <h3>Total Doctors</h3>
                <p className="admin-stat-value">{stats.totalDoctors}</p>
                <span className="admin-stat-change">↑ 8.3% vs last 7 days</span>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="admin-stat-icon appointments">
                <i className='bx bx-calendar-check'></i>
              </div>
              <div className="admin-stat-content">
                <h3>Total Appointments</h3>
                <p className="admin-stat-value">{stats.totalAppointments}</p>
                <span className="admin-stat-change">↑ 15.2% vs last 7 days</span>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="admin-stat-icon revenue">
                <i className='bx bx-dollar'></i>
              </div>
              <div className="admin-stat-content">
                <h3>Total Revenue</h3>
                <p className="admin-stat-value">${stats.totalRevenue.toLocaleString()}</p>
                <span className="admin-stat-change">↑ 18.7% vs last 7 days</span>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="admin-stat-icon reviews">
                <i className='bx bx-star'></i>
              </div>
              <div className="admin-stat-content">
                <h3>Total Reviews</h3>
                <p className="admin-stat-value">{stats.totalReviews.toLocaleString()}</p>
                <span className="admin-stat-change">↑ 10.1% vs last 7 days</span>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="admin-charts-section">
            {/* Appointments Overview */}
            <div className="admin-chart-container">
              <h2>Appointments Overview</h2>
              <div className="admin-appointments-chart">
                <div className="admin-chart-tabs">
                  <button className="admin-tab-btn active">Daily</button>
                  <button className="admin-tab-btn">Weekly</button>
                  <button className="admin-tab-btn">Monthly</button>
                </div>
                <svg viewBox="0 0 600 250" className="admin-line-chart">
                  {/* Grid lines */}
                  {[1, 2, 3, 4, 5].map(i => (
                    <line key={`h-${i}`} x1="50" y1={50 + i * 40} x2="550" y2={50 + i * 40} stroke="#e0e0e0" strokeWidth="1" />
                  ))}
                  {[0, 1, 2, 3, 4, 5, 6].map(i => (
                    <line key={`v-${i}`} x1={50 + i * 83.33} y1="30" x2={50 + i * 83.33} y2="210" stroke="#e0e0e0" strokeWidth="1" />
                  ))}

                  {/* Main line chart */}
                  <polyline
                    points="50,180 133,140 216,120 300,150 383,100 466,130 550,90"
                    fill="none"
                    stroke="#1f5dff"
                    strokeWidth="3"
                  />

                  {/* Second dataset */}
                  <polyline
                    points="50,190 133,160 216,140 300,170 383,130 466,150 550,110"
                    fill="none"
                    stroke="#a0c4ff"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                  />

                  {/* X-axis labels */}
                  {['24 May', '25 May', '26 May', '27 May', '28 May', '29 May', '30 May'].map((date, i) => (
                    <text key={i} x={50 + i * 83.33} y="235" textAnchor="middle" fontSize="12" fill="#999">
                      {date}
                    </text>
                  ))}
                </svg>
                <div className="admin-chart-legend">
                  <span><i style={{ background: '#1f5dff', width: '12px', height: '12px', display: 'inline-block', marginRight: '5px' }}></i>Appointments</span>
                  <span><i style={{ background: '#a0c4ff', width: '12px', height: '12px', display: 'inline-block', marginRight: '5px' }}></i>Cancelled</span>
                </div>
              </div>
            </div>

            {/* Appointments by Status Pie Chart */}
            <div className="admin-chart-container">
              <h2>Appointments by Status</h2>
              <div className="admin-pie-chart-wrapper">
                <svg viewBox="0 0 200 200" className="admin-pie-chart">
                  {/* Pie chart circles */}
                  {appointmentStatusData.reduce((acc, item, idx) => {
                    const startAngle = acc.angle
                    const sliceAngle = (item.count / totalApptCount) * 360
                    const endAngle = startAngle + sliceAngle
                    const radius = 70
                    const cx = 100
                    const cy = 100

                    const startRad = (startAngle * Math.PI) / 180
                    const endRad = (endAngle * Math.PI) / 180

                    const x1 = cx + radius * Math.cos(startRad)
                    const y1 = cy + radius * Math.sin(startRad)
                    const x2 = cx + radius * Math.cos(endRad)
                    const y2 = cy + radius * Math.sin(endRad)

                    const largeArc = sliceAngle > 180 ? 1 : 0

                    const path = [
                      `M ${cx} ${cy}`,
                      `L ${x1} ${y1}`,
                      `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
                      'Z'
                    ].join(' ')

                    acc.paths.push(
                      <path key={idx} d={path} fill={item.color} stroke="white" strokeWidth="2" />
                    )

                    return { angle: endAngle, paths: acc.paths }
                  }, { angle: 0, paths: [] as any[] }).paths}

                  {/* Center circle for donut chart */}
                  <circle cx="100" cy="100" r="45" fill="white" />
                  <text x="100" y="105" textAnchor="middle" fontSize="24" fontWeight="bold" fill="#333">
                    {totalApptCount}
                  </text>
                  <text x="100" y="122" textAnchor="middle" fontSize="12" fill="#999">
                    Total
                  </text>
                </svg>
                <div className="admin-pie-legend">
                  {appointmentStatusData.map((item, idx) => (
                    <div key={idx} className="admin-legend-item">
                      <span className="admin-legend-color" style={{ background: item.color }}></span>
                      <span className="admin-legend-text">
                        {item.status} {item.count} ({Math.round((item.count / totalApptCount) * 100)}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Appointments Table */}
          <div className="admin-recent-appointments">
            <div className="admin-section-header">
              <h2>Recent Appointments</h2>
              <button className="admin-view-all-btn" onClick={() => navigate('/admin/appointments')}>View all</button>
            </div>
            {appointments.length > 0 ? (
              <div className="admin-appointments-table">
                <div className="admin-table-header">
                  <div className="col-patient">Patient</div>
                  <div className="col-doctor">Doctor</div>
                  <div className="col-date">Date & Time</div>
                  <div className="col-specialty">Specialty</div>
                  <div className="col-status">Status</div>
                  <div className="col-payment">Payment</div>
                  <div className="col-action">Action</div>
                </div>
                {appointments.slice(0, 5).map((apt) => (
                  <div key={apt.id} className="admin-table-row">
                    <div className="col-patient">
                      <div className="patient-info">
                        <div className="patient-avatar">{apt.fullName?.charAt(0) || 'P'}</div>
                        <div className="patient-details">
                          <p className="patient-name">{apt.fullName || 'N/A'}</p>
                          <p className="patient-email">{apt.email || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-doctor">{apt.doctorName || 'N/A'}</div>
                    <div className="col-date">{apt.date} {apt.time}</div>
                    <div className="col-specialty">{apt.specialty || 'N/A'}</div>
                    <div className={`col-status ${apt.status?.toLowerCase()}`}>
                      {apt.status || 'Pending'}
                    </div>
                    <div className="col-payment">{apt.paymentStatus || 'Pending'}</div>
                    <div className="col-action">
                      <button className="admin-view-btn" title="View details">
                        <i className='bx bx-show'></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ textAlign: 'center', color: '#999', padding: '20px' }}>
                No appointments found
              </p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="admin-sidebar">
          {/* Quick Actions */}
          <div className="admin-quick-actions">
            <h3>Quick Actions</h3>
            <button className="admin-action-btn" onClick={() => navigate('/admin/doctors')}>
              <div className="admin-action-icon">
                <i className='bx bx-user-plus'></i>
              </div>
              <div className="admin-action-text">
                <p className="admin-action-title">Add New Doctor</p>
                <p className="admin-action-desc">Create a new doctor profile</p>
              </div>
              <i className='bx bx-chevron-right'></i>
            </button>

            <button className="admin-action-btn" onClick={() => navigate('/admin/users')}>
              <div className="admin-action-icon">
                <i className='bx bx-user-plus'></i>
              </div>
              <div className="admin-action-text">
                <p className="admin-action-title">Add New User</p>
                <p className="admin-action-desc">Create a new user account</p>
              </div>
              <i className='bx bx-chevron-right'></i>
            </button>

            <button className="admin-action-btn" onClick={() => navigate('/admin/appointments')}>
              <div className="admin-action-icon">
                <i className='bx bx-calendar-check'></i>
              </div>
              <div className="admin-action-text">
                <p className="admin-action-title">Manage Appointments</p>
                <p className="admin-action-desc">View and manage all appointments</p>
              </div>
              <i className='bx bx-chevron-right'></i>
            </button>

            <button className="admin-action-btn" onClick={() => navigate('/admin/doctors')}>
              <div className="admin-action-icon">
                <i className='bx bx-file'></i>
              </div>
              <div className="admin-action-text">
                <p className="admin-action-title">Generate Reports</p>
                <p className="admin-action-desc">Download system reports</p>
              </div>
              <i className='bx bx-chevron-right'></i>
            </button>
          </div>

          {/* System Overview */}
          <div className="admin-system-overview">
            <h3>System Overview</h3>
            <div className="overview-item">
              <div className="overview-stat">
                <i className='bx bx-check-circle'></i>
                <span className="overview-label">Active Doctors</span>
              </div>
              <span className="overview-value">{stats.activeDoctors}</span>
            </div>
            <div className="overview-item">
              <div className="overview-stat">
                <i className='bx bx-check-circle'></i>
                <span className="overview-label">Active Patients</span>
              </div>
              <span className="overview-value">{stats.activePatients}</span>
            </div>
            <div className="overview-item">
              <div className="overview-stat">
                <i className='bx bx-clinic'></i>
                <span className="overview-label">Active Clinics</span>
              </div>
              <span className="overview-value">128</span>
            </div>
            <div className="overview-item">
              <div className="overview-stat">
                <i className='bx bx-calendar-event'></i>
                <span className="overview-label">Pending Appointments</span>
              </div>
              <span className="overview-value">{stats.pendingAppointments}</span>
            </div>
          </div>

          {/* Recent Reviews */}
          <div className="admin-recent-reviews">
            <div className="reviews-header">
              <h3>Recent Reviews</h3>
              <button className="admin-view-all-btn">View all</button>
            </div>
            <div className="review-item">
              <div className="reviewer-info">
                <div className="reviewer-avatar">SJ</div>
                <div className="reviewer-details">
                  <p className="reviewer-name">Sarah Johnson</p>
                  <p className="reviewer-doctor">Dr. Emily Carter</p>
                </div>
              </div>
              <div className="review-stars">
                {[...Array(5)].map((_, i) => (
                  <i key={i} className='bx bxs-star'></i>
                ))}
              </div>
              <p className="review-text">Excellent experience. Dr. Emily was very professional and kind.</p>
              <p className="review-time">2h ago</p>
            </div>

            <div className="review-item">
              <div className="reviewer-info">
                <div className="reviewer-avatar">MB</div>
                <div className="reviewer-details">
                  <p className="reviewer-name">Michael Brown</p>
                  <p className="reviewer-doctor">Dr. James Wilson</p>
                </div>
              </div>
              <div className="review-stars">
                {[...Array(4)].map((_, i) => (
                  <i key={i} className='bx bxs-star'></i>
                ))}
              </div>
              <p className="review-text">Great service and friendly staff!</p>
              <p className="review-time">5h ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
