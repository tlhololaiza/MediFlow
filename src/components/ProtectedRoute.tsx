import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/Authcontext';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'patient' | 'doctor';
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
    return <Navigate to={userType === 'doctor' ? '/doctor/dashboard' : '/profile'} replace />;
  }

  return children;
};

export default ProtectedRoute;