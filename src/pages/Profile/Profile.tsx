import React, { useState } from 'react'
import Footer from '../../components/Footer/Footer'
import './Profile.css'

const Profile = () => {
  const [activeTab, setActiveTab] = useState('personal')
  const [formData, setFormData] = useState({
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    dateOfBirth: '15/05/1992',
    gender: 'Male'
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
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
            <img src="https://via.placeholder.com/100" alt="John Doe" />
          </div>
          <div className="user-info">
            <h2>John Doe <span className="verified-badge">Verified</span></h2>
            <p><i className='bx bx-envelope'></i> john.doe@example.com</p>
            <p><i className='bx bx-phone'></i> +1 (555) 123-4567</p>
            <p><i className='bx bx-calendar'></i> 15 May 1992</p>
            <p><i className='bx bx-male'></i> Male</p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="user-stats">
          <div className="stat-card">
            <div className="stat-number">12</div>
            <div className="stat-label">Appointments</div>
            <div className="stat-desc">Total Booked</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">2</div>
            <div className="stat-label">Upcoming</div>
            <div className="stat-desc">Next in 3 days</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">10</div>
            <div className="stat-label">Completed</div>
            <div className="stat-desc">All Done</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">Jan 2024</div>
            <div className="stat-label">Member Since</div>
            <div className="stat-desc">1 year ago</div>
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
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name</label>
                  <input 
                    type="text" 
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                  />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="john.doe@example.com"
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
                    placeholder="+1 (555) 123-4567"
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
                    placeholder="15/05/1992"
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

              <button type="button" className="save-btn">Save Changes</button>
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
                <div className="action-card delete">
                  <i className='bx bx-trash'></i>
                  <div className="action-content">
                    <h4>Delete Account</h4>
                    <p>Permanently delete your account</p>
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
