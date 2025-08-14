import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PrivateRoute({ component: Component, roles }) {
  const { isAuthenticated, user } = useAuth() ?? {};
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (roles?.length) {
    const role =
      user?.role ||
      (user?.is_admin || user?.is_staff || user?.is_superuser
        ? 'admin'
        : 'user');
    if (!roles.includes(role)) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <Component />;
}
