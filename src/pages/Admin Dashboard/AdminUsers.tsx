import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getAllUsers, deleteUser } from '../../services/firestoreService'
import './AdminUsers.css'

const AdminUsers = () => {
  const { currentUser } = useAuth()
  const [users, setUsers] = useState<any[]>([])
  const [filteredUsers, setFilteredUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [currentUser])

  useEffect(() => {
    filterUsers()
  }, [users, searchTerm, filterType])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const allUsers = await getAllUsers()
      // Filter out admin users
      const filteredUsers = allUsers.filter(u => u.userType !== 'admin')
      setUsers(filteredUsers)
    } catch (err) {
      console.error('Error fetching users:', err)
    } finally {
      setLoading(false)
    }
  }

  const filterUsers = () => {
    let filtered = users.filter(u => !u.deletedAt)

    // Apply type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(u => u.userType === filterType)
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(u =>
        u.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredUsers(filtered)
  }

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(userId)
        setUsers(users.filter(u => u.id !== userId))
        setShowModal(false)
      } catch (err) {
        console.error('Error deleting user:', err)
        alert('Failed to delete user')
      }
    }
  }

  const handleViewUser = (user: any) => {
    setSelectedUser(user)
    setShowModal(true)
  }

  if (loading) {
    return (
      <div className="admin-users-page">
        <div className="users-header">
          <h1>Manage Users</h1>
        </div>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <p>Loading users...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-users-page">
      {/* Header */}
      <div className="users-header">
        <div className="header-top">
          <div>
            <h1>Manage Users</h1>
            <p>Manage all patient and doctor accounts in the system</p>
          </div>
        </div>
      </div>

      <div className="users-container">
        {/* Filters and Search */}
        <div className="users-toolbar">
          <div className="search-box">
            <i className='bx bx-search'></i>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-buttons">
            <button
              className={`filter-btn ${filterType === 'all' ? 'active' : ''}`}
              onClick={() => setFilterType('all')}
            >
              All Users ({users.filter(u => !u.deletedAt).length})
            </button>
            <button
              className={`filter-btn ${filterType === 'patient' ? 'active' : ''}`}
              onClick={() => setFilterType('patient')}
            >
              Patients ({users.filter(u => u.userType === 'patient' && !u.deletedAt).length})
            </button>
            <button
              className={`filter-btn ${filterType === 'doctor' ? 'active' : ''}`}
              onClick={() => setFilterType('doctor')}
            >
              Doctors ({users.filter(u => u.userType === 'doctor' && !u.deletedAt).length})
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="users-table-wrapper">
          {filteredUsers.length > 0 ? (
            <table className="users-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Type</th>
                  <th>Phone</th>
                  <th>Joined</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user.id}>
                    <td>
                      <div className="user-name-cell">
                        <div className="user-avatar">{user.fullName?.charAt(0) || 'U'}</div>
                        <span>{user.fullName || 'N/A'}</span>
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`type-badge ${user.userType}`}>
                        {user.userType === 'doctor' ? 'Doctor' : 'Patient'}
                      </span>
                    </td>
                    <td>{user.phone || 'N/A'}</td>
                    <td>{user.createdAt ? new Date(user.createdAt.toDate?.() || user.createdAt).toLocaleDateString() : 'N/A'}</td>
                    <td>
                      <span className={`status-badge ${user.isActive !== false ? 'active' : 'inactive'}`}>
                        {user.isActive !== false ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-view"
                          onClick={() => handleViewUser(user)}
                          title="View details"
                        >
                          <i className='bx bx-show'></i>
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDeleteUser(user.id)}
                          title="Delete user"
                        >
                          <i className='bx bx-trash'></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="no-results">
              <i className='bx bx-search-alt-2'></i>
              <p>No users found</p>
            </div>
          )}
        </div>
      </div>

      {/* User Details Modal */}
      {showModal && selectedUser && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>User Details</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                <i className='bx bx-x'></i>
              </button>
            </div>

            <div className="modal-body">
              <div className="detail-section">
                <h3>Basic Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Name</label>
                    <p>{selectedUser.fullName || 'N/A'}</p>
                  </div>
                  <div className="detail-item">
                    <label>Email</label>
                    <p>{selectedUser.email}</p>
                  </div>
                  <div className="detail-item">
                    <label>User Type</label>
                    <p>{selectedUser.userType === 'doctor' ? 'Doctor' : 'Patient'}</p>
                  </div>
                  <div className="detail-item">
                    <label>Phone</label>
                    <p>{selectedUser.phone || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {selectedUser.userType === 'doctor' && (
                <div className="detail-section">
                  <h3>Doctor Information</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>Specialization</label>
                      <p>{selectedUser.specialization || 'N/A'}</p>
                    </div>
                    <div className="detail-item">
                      <label>Experience</label>
                      <p>{selectedUser.experience || 'N/A'} years</p>
                    </div>
                    <div className="detail-item">
                      <label>Consultation Fee</label>
                      <p>${selectedUser.consultationFee || 0}</p>
                    </div>
                    <div className="detail-item">
                      <label>Availability Status</label>
                      <p>{selectedUser.available ? 'Available' : 'Not Available'}</p>
                    </div>
                  </div>
                  <div className="detail-section">
                    <label>Bio</label>
                    <p>{selectedUser.bio || 'N/A'}</p>
                  </div>
                </div>
              )}

              <div className="detail-section">
                <h3>Account Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Account Status</label>
                    <p>{selectedUser.isActive !== false ? 'Active' : 'Inactive'}</p>
                  </div>
                  <div className="detail-item">
                    <label>Joined Date</label>
                    <p>{selectedUser.createdAt ? new Date(selectedUser.createdAt.toDate?.() || selectedUser.createdAt).toLocaleDateString() : 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowModal(false)}>Close</button>
              <button className="btn-danger" onClick={() => handleDeleteUser(selectedUser.id)}>Delete User</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminUsers
