import React, { useState, useEffect } from 'react'
import Footer from '../../components/Footer/Footer'
import './Profile.css'
import { useAuth } from '../../context/AuthContext'
import { getUserProfile, updateUserProfile, getPatientAppointments } from '../../services/firestoreService'

interface UserProfileData {
  fullName: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
}

const Profile = () => {
  const { currentUser, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('personal')
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [appointmentCount, setAppointmentCount] = useState(0)
  const [upcomingCount, setUpcomingCount] = useState(0)
  const [completedCount, setCompletedCount] = useState(0)
  const [formData, setFormData] = useState<UserProfileData>({
    fullName: '',
    phone: '',
    dateOfBirth: '',
    gender: 'Male'
  })

  // Load user data from Firestore on mount
  useEffect(() => {
    const loadUserData = async () => {
      if (!currentUser) return

      try {
        // Load user profile from Firestore
        const userData = await getUserProfile(currentUser.uid)
        if (userData) {
          setFormData({
            fullName: userData.fullName || '',
            phone: userData.phone || '',
            dateOfBirth: userData.dateOfBirth || '',
            gender: userData.gender || 'Male'
          })
        } else {
          // Initialize with email name if no saved data
          setFormData(prev => ({
            ...prev,
            fullName: currentUser.displayName || currentUser.email?.split('@')[0] || ''
          }))
        }

        // Load appointment counts
        const userAppointments = await getPatientAppointments(currentUser.uid)
        setAppointmentCount(userAppointments.length)
        setUpcomingCount(userAppointments.filter(a => a.status === 'Booked').length)
        setCompletedCount(userAppointments.filter(a => a.status === 'Completed').length)
      } catch (err) {
        console.error('Error loading profile:', err)
      }
    }

    loadUserData()
  }, [currentUser])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSaveChanges = async () => {
    if (!currentUser) return

    setLoading(true)
    try {
      // Save to Firestore
      await updateUserProfile(currentUser.uid, formData)
      
      setSuccessMessage('Profile updated successfully!')
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (err) {
      console.error('Error saving profile:', err)
      setSuccessMessage('Error updating profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="profile-page">
      {/* Header Section */}
      <div className="profile-header">
        <h1>My Profile</h1>
        <p>Manage your personal information and account settings</p>
      </div>

      {/* User Card Section */}
      <div className="profile-user-card">
        <div className="user-card-left">
          <div className="profile-picture">
            <img src={`https://ui-avatars.com/api/?name=${formData.fullName || 'User'}&background=random`} alt={formData.fullName || 'User'} />
          </div>
          <div className="user-info">
            <h2>{formData.fullName || 'User'} <span className="verified-badge">Verified</span></h2>
            <p><i className='bx bx-envelope'></i> {currentUser?.email || 'No email'}</p>
            <p><i className='bx bx-phone'></i> {formData.phone || 'Not provided'}</p>
            <p><i className='bx bx-calendar'></i> {formData.dateOfBirth || 'Not provided'}</p>
            <p><i className='bx bx-male'></i> {formData.gender || 'Not specified'}</p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="user-stats">
          <div className="stat-card">
            <div className="stat-number">{appointmentCount}</div>
            <div className="profile-stat-label">Appointments</div>
            <div className="stat-desc">Total Booked</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{upcomingCount}</div>
            <div className="profile-stat-label">Upcoming</div>
            <div className="stat-desc">Next in 3 days</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{completedCount}</div>
            <div className="profile-stat-label">Completed</div>
            <div className="stat-desc">All Done</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">-</div>
            <div className="profile-stat-label">Member Since</div>
            <div className="stat-desc">2024</div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="profile-tabs">
        <button 
          className={`tab-btn ${activeTab === 'personal' ? 'active' : ''}`}
          onClick={() => setActiveTab('personal')}
        >
          Personal Information
        </button>
        <button 
          className={`tab-btn ${activeTab === 'medical' ? 'active' : ''}`}
          onClick={() => setActiveTab('medical')}
        >
          Medical Information
        </button>
        <button 
          className={`tab-btn ${activeTab === 'address' ? 'active' : ''}`}
          onClick={() => setActiveTab('address')}
        >
          Address
        </button>
        <button 
          className={`tab-btn ${activeTab === 'security' ? 'active' : ''}`}
          onClick={() => setActiveTab('security')}
        >
          Security
        </button>
      </div>

      {/* Tab Content */}
      <div className="profile-content">
        {activeTab === 'personal' && (
          <div className="tab-content">
            <div className="content-header">
              <h3>Personal Information</h3>
              <p>Update your personal details</p>
            </div>

            <form className="profile-form">
              {successMessage && (
                <div style={{ 
                  background: '#d4edda', 
                  color: '#155724', 
                  padding: '12px', 
                  borderRadius: '4px', 
                  marginBottom: '15px',
                  border: '1px solid #c3e6cb'
                }}>
                  ✓ {successMessage}
                </div>
              )}
              
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name</label>
                  <input 
                    type="text" 
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input 
                    type="email" 
                    value={currentUser?.email || ''}
                    disabled
                    placeholder="Your email"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Phone Number</label>
                  <input 
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="e.g., +1 (555) 123-4567"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Date of Birth</label>
                  <input 
                    type="text" 
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    placeholder="DD/MM/YYYY"
                  />
                </div>
                <div className="form-group">
                  <label>Gender</label>
                  <select 
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <button 
                type="button" 
                className="save-btn"
                onClick={handleSaveChanges}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>

            {/* Quick Actions */}
            <div className="quick-actions">
              <h3>Quick Actions</h3>
              <div className="actions-grid">
                <div className="action-card">
                  <i className='bx bx-lock'></i>
                  <div className="action-content">
                    <h4>Change Password</h4>
                    <p>Update your account password</p>
                  </div>
                  <i className='bx bx-chevron-right'></i>
                </div>
                <div className="action-card">
                  <i className='bx bx-bell'></i>
                  <div className="action-content">
                    <h4>Notification Preferences</h4>
                    <p>Manage your notifications</p>
                  </div>
                  <i className='bx bx-chevron-right'></i>
                </div>
                <div className="action-card">
                  <i className='bx bx-download'></i>
                  <div className="action-content">
                    <h4>Download My Data</h4>
                    <p>Download your data</p>
                  </div>
                  <i className='bx bx-chevron-right'></i>
                </div>
                <div className="action-card delete" onClick={() => logout()}>
                  <i className='bx bx-log-out'></i>
                  <div className="action-content">
                    <h4>Logout</h4>
                    <p>Sign out from your account</p>
                  </div>
                  <i className='bx bx-chevron-right'></i>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'medical' && (
          <div className="tab-content">
            <div className="content-header">
              <h3>Medical Information</h3>
              <p>Your medical history and records</p>
            </div>
            <p>Medical information coming soon...</p>
          </div>
        )}

        {activeTab === 'address' && (
          <div className="tab-content">
            <div className="content-header">
              <h3>Address</h3>
              <p>Manage your addresses</p>
            </div>
            <p>Address information coming soon...</p>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="tab-content">
            <div className="content-header">
              <h3>Security</h3>
              <p>Manage your security settings</p>
            </div>
            <p>Security settings coming soon...</p>
          </div>
        )}
      </div>

      <div className="profile-footer">
        <Footer />
      </div>
    </div>
  )
}

export default Profile
