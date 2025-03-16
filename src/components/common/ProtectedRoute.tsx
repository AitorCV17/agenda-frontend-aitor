import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

interface ProtectedRouteProps {
  adminOnly?: boolean;
}

const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(window.atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ adminOnly = false }) => {
  const { token, user } = useContext(AuthContext);

  if (!token || isTokenExpired(token)) {
    localStorage.removeItem('token');
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user?.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
