import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: string[];
  redirectTo?: string;
  inverse?: boolean;
  token?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roles = [], redirectTo = "/login", inverse = false }) => {
  const { user } = useAuth();

  if (!user && !inverse) {
    // If user is not logged in and this is not an inverse route, redirect to login page
    return <Navigate to="/login" replace />;
  }

  if (user && inverse) {
    // If user is logged in and this is an inverse route (e.g., login), redirect to home page
    return <Navigate to={redirectTo} replace />;
  }

  if (roles.length && user && !roles.includes(user.role)) {
    // If user doesn't have the required role, redirect to home page or an unauthorized page
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
