import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roles = [] }) => {
  const { user } = useAuth();

  if (!user) {
    // If user is not logged in, redirect to login page
    return <Navigate to="/login" replace />;
  }

  if (roles.length && !roles.includes(user.role)) {
    // If user doesn't have the required role, redirect to home page or an unauthorized page
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
