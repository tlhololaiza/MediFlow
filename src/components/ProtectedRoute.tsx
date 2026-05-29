import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'patient' | 'doctor' | 'admin';
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { currentUser, loading, userType } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        Loading authentication...
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has required role
  if (requiredRole && userType !== requiredRole) {
    if (userType === 'doctor') {
      return <Navigate to="/doctor/dashboard" replace />;
    } else if (userType === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/profile" replace />;
  }

  return children;
};

export default ProtectedRoute;