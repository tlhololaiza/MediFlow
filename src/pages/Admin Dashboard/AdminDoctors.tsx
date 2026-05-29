import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getDoctors, createDoctor, updateDoctor, deleteDoctor } from '../../services/firestoreService'
import './AdminDoctors.css'

const AdminDoctors = () => {
  const { currentUser } = useAuth()
  const [doctors, setDoctors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredDoctors, setFilteredDoctors] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null)
  const [formData, setFormData] = useState({
    fullName: '',
    specialization: '',
    experience: '',
    consultationFee: '',
    phone: '',
    email: '',
    bio: '',
    qualifications: '',
    available: true
  })

  useEffect(() => {
    fetchDoctors()
  }, [currentUser])

  useEffect(() => {
    filterDoctors()
  }, [doctors, searchTerm])

  const fetchDoctors = async () => {
    try {
      setLoading(true)
      const allDoctors = await getDoctors()
      setDoctors(allDoctors.filter(d => !d.deletedAt))
    } catch (err) {
      console.error('Error fetching doctors:', err)
    } finally {
      setLoading(false)
    }
  }

  const filterDoctors = () => {
    if (searchTerm) {
      const filtered = doctors.filter(d =>
        d.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.specialization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.email?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredDoctors(filtered)
    } else {
      setFilteredDoctors(doctors)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.fullName || !formData.specialization || !formData.experience || !formData.consultationFee) {
      alert('Please fill in all required fields')
      return
    }

    try {
      if (selectedDoctor) {
        // Update existing doctor
        await updateDoctor(selectedDoctor.id, formData)
        setDoctors(doctors.map(d => d.id === selectedDoctor.id ? { ...d, ...formData } : d))
        alert('Doctor updated successfully!')
      } else {
        // Create new doctor
        const docId = await createDoctor(formData)
        setDoctors([...doctors, { id: docId, ...formData }])
        alert('Doctor created successfully!')
      }
      
      resetForm()
      setShowForm(false)
    } catch (err) {
      console.error('Error saving doctor:', err)
      alert('Failed to save doctor')
    }
  }

  const handleEditDoctor = (doctor: any) => {
    setSelectedDoctor(doctor)
    setFormData({
      fullName: doctor.fullName || '',
      specialization: doctor.specialization || '',
      experience: doctor.experience || '',
      consultationFee: doctor.consultationFee || '',
      phone: doctor.phone || '',
      email: doctor.email || '',
      bio: doctor.bio || '',
      qualifications: doctor.qualifications || '',
      available: doctor.available !== false
    })
    setShowForm(true)
  }

  const handleDeleteDoctor = async (doctorId: string) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      try {
        await deleteDoctor(doctorId)
        setDoctors(doctors.filter(d => d.id !== doctorId))
      } catch (err) {
        console.error('Error deleting doctor:', err)
        alert('Failed to delete doctor')
      }
    }
  }

  const resetForm = () => {
    setFormData({
      fullName: '',
      specialization: '',
      experience: '',
      consultationFee: '',
      phone: '',
      email: '',
      bio: '',
      qualifications: '',
      available: true
    })
    setSelectedDoctor(null)
  }

  if (loading) {
    return (
      <div className="admin-doctors-page">
        <div className="admin-doctors-header">
          <h1>Manage Doctors</h1>
        </div>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <p>Loading doctors...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-doctors-page">
      {/* Header */}
      <div className="admin-doctors-header">
        <div className="admin-header-top">
          <div>
            <h1>Manage Doctors</h1>
            <p>Create, update, and manage doctor profiles</p>
          </div>
          <button className="btn-add-doctor" onClick={() => { resetForm(); setShowForm(true) }}>
            <i className='bx bx-plus'></i>
            Add New Doctor
          </button>
        </div>
      </div>

      <div className="admin-doctors-container">
        {/* Search */}
        <div className="admin-doctors-toolbar">
          <div className="search-box">
            <i className='bx bx-search'></i>
            <input
              type="text"
              placeholder="Search by name, specialty, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Doctors Grid */}
        <div className="admin-doctors-grid">
          {filteredDoctors.length > 0 ? (
            filteredDoctors.map(doctor => (
              <div key={doctor.id} className="admin-doctor-card">
                <div className="admin-doctor-header">
                  <div className="admin-doctor-avatar">{doctor.fullName?.charAt(0) || 'D'}</div>
                  <div className={`admin-availability-badge ${doctor.available ? 'available' : 'unavailable'}`}>
                    {doctor.available ? 'Available' : 'Unavailable'}
                  </div>
                </div>

                <div className="admin-doctor-info">
                  <h3>{doctor.fullName || 'N/A'}</h3>
                  <p className="admin-specialty">{doctor.specialization || 'N/A'}</p>
                  <p className="admin-email">{doctor.email || 'N/A'}</p>
                </div>

                <div className="admin-doctor-details">
                  <div className="admin-detail-row">
                    <span className="admin-label">Experience:</span>
                    <span className="admin-value">{doctor.experience || 0} years</span>
                  </div>
                  <div className="admin-detail-row">
                    <span className="admin-label">Consultation Fee:</span>
                    <span className="admin-value">ZAR {doctor.consultationFee || 0}</span>
                  </div>
                  <div className="admin-detail-row">
                    <span className="admin-label">Phone:</span>
                    <span className="admin-value">{doctor.phone || 'N/A'}</span>
                  </div>
                </div>

                <div className="admin-doctor-actions">
                  <button 
                    className="btn-edit"
                    onClick={() => handleEditDoctor(doctor)}
                    title="Edit doctor"
                  >
                    <i className='bx bx-edit'></i>
                    Edit
                  </button>
                  <button 
                    className="btn-delete"
                    onClick={() => handleDeleteDoctor(doctor.id)}
                    title="Delete doctor"
                  >
                    <i className='bx bx-trash'></i>
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">
              <i className='bx bx-search-alt-2'></i>
              <p>No doctors found</p>
            </div>
          )}
        </div>
      </div>

      {/* Doctor Form Modal */}
      {showForm && (
        <div className="form-overlay" onClick={() => setShowForm(false)}>
          <div className="form-modal" onClick={(e) => e.stopPropagation()}>
            <div className="form-header">
              <h2>{selectedDoctor ? 'Edit Doctor' : 'Add New Doctor'}</h2>
              <button className="close-btn" onClick={() => setShowForm(false)}>
                <i className='bx bx-x'></i>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="admin-doctor-form">
              <div className="admin-form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter doctor's full name"
                  required
                />
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Specialization *</label>
                  <input
                    type="text"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleInputChange}
                    placeholder="e.g., Cardiology"
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label>Experience (Years) *</label>
                  <input
                    type="number"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    placeholder="e.g., 10"
                    required
                  />
                </div>
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Consultation Fee *</label>
                  <input
                    type="number"
                    name="consultationFee"
                    value={formData.consultationFee}
                    onChange={handleInputChange}
                    placeholder="e.g., 50"
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email address"
                />
              </div>

              <div className="admin-form-group">
                <label>Qualifications</label>
                <textarea
                  name="qualifications"
                  value={formData.qualifications}
                  onChange={handleInputChange}
                  placeholder="Enter qualifications"
                  rows={3}
                />
              </div>

              <div className="admin-form-group">
                <label>Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Enter doctor's bio"
                  rows={4}
                />
              </div>

              <div className="admin-form-group checkbox">
                <label>
                  <input
                    type="checkbox"
                    name="available"
                    checked={formData.available}
                    onChange={handleInputChange}
                  />
                  Available for consultations
                </label>
              </div>

              <div className="admin-form-actions">
                <button type="button" className="admin-btn-cancel" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn-submit">
                  {selectedDoctor ? 'Update Doctor' : 'Create Doctor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDoctors
